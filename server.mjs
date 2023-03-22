console.log('INIT APP');
import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
config();
import cors from 'cors';
import dbRequest from './prisma/db-request.mjs';
import { userSearch } from './prisma/user-search.js';
console.log('BEFORE crypto INIT');
const {sign, verify} = jwt
const app = express();

// let TOKEN_SECRET = require('crypto').randomBytes(64).toString('hex');

function generateAccessToken(username) {
  return sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}

function generateRefreshToken(username) {
  return sign(username, process.env.TOKEN_SECRET, { expiresIn: '30d' });
}

const validateAccessToken = (accessToken) => {
  try {
    const userData = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
}

const validateRefreshToken = (token) => {
  try {
    const userData = verify(token, process.env.TOKEN_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
}

const host = '127.0.0.1';
const port = 7000;

let data = [];
let tasks = [];
let users = [];

app.use(cors());

app.use(json());

app.use(cookieParser('secret key'));

app.get('/login', (req, res) => {
  res.status(200).json(users);
})

app.post('/login', function(req, res, next) {
  const reqData = req.body;
  const authorisationHeader = req.header('authorization');
  console.log('reqData', reqData);
  console.log('authorisationHeader', authorisationHeader);

  if (reqData) {
    let user = users.find((item) => {
      return reqData.login === item.login && reqData.password === item.password;
    })
    if (user) {
      if(!authorisationHeader) {
        res.status(400).json('Полозователь не авторизован');
      } else {
        const accessToken = authorisationHeader.split(' ')[1];
        if (!accessToken) {
          console.log('нету токена')
          res.status(401).json('Bad token');
        } else {
          console.log('accessToken::', accessToken);
          const userData = validateAccessToken(accessToken);
          if (!userData) {
            next()
          } else {
            res.status(200).json(accessToken);
          }
        }
      }
    } else {
      res.status(400).json('Полозователь не авторизован');
    }
  }
}, function(req, res, next) {
  const authorisationHeaderTwo = req.header('authorizationTwo');
  if (!authorisationHeaderTwo) {
    res.status(400).json('Полозователь не авторизован');
  } else {
    const refreshToken = authorisationHeaderTwo.split(' ')[1];
    if (!refreshToken) {
      res.status(401).json('Bad token');
    } else {
      const userDataTwo = validateRefreshToken(refreshToken);
      if (!userDataTwo) {
        res.status(403).json('Bad token');
      } else {
        const reqData = req.body;
        let user = users.find((item) => {
          return reqData.login === item.login && reqData.password === item.password;
        })
        let accessToken = generateAccessToken({ userId: user.userId });
        reqData.accessToken = accessToken;
        users.push(reqData);
        console.log('access token new', accessToken);
        res.status(200).json({accessToken: accessToken});
      }
    }
  }
  next();
});

app.post('/signup', async (req, res) => {
  console.log('Registration.................')
  const reqData = req.body;
  if (reqData) {
    // let user = users.find((item) => {
    //   return reqData.login === item.login
    // })
    // if (user) {
    //   res.status(403).send('Login busy')
    //   res.end(console.log("error 403 bro"))
    // } else {
      let refreshToken = generateRefreshToken({ username: reqData.login });
      let accessToken = generateAccessToken({ userId: reqData.userId });
      reqData.accessToken = accessToken;
      reqData.refreshToken = refreshToken;
      // users.push(reqData);
      dbRequest.createUser(reqData);
      let login = reqData.login;
      console.log(login)
      let idUser = await  userSearch(login)
      console.log('idUser::', idUser)
      // console.log(reqData)
      let data = {accessToken, refreshToken, ...idUser};
    if(data)
    await dbRequest.createTokens(data);
      res.status(200).json({refreshToken: refreshToken, accessToken: accessToken});
    // }
  } else {
    res.status(422).json({error: 'Bad data'});
  }
})
  
app.get('/boards', (req, res) => {
  res.status(200).json(data);
})

//удалил  checkAuth(), строка 79

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
})

app.post('/boards', (req, res) => {
  const reqData = req.body;
  if (reqData) {
    dbRequest.createBoard(reqData)
    res.status(200).json(reqData);
  } else {
    res.status(422).json({error: 'Bad data'});
  }
})

app.post('/tasks', (req, res) => {
  const reqData = req.body;
  if (reqData.idT) {
    // if(board.id === reqData.id) {
        tasks.push(reqData);
        res.status(200).json(reqData);
        // }
      } else {
        res.status(422).json({error: 'Bad data'});
  }
})

app.delete('/boards', (req, res) => {
  const reqData = req.body;
  if (reqData.id) {

    let idIndex = data.indexOf(reqData.id)
    if (idIndex) {
      data.splice(idIndex);
    } else {
      res.status(404).json({error: 'Not found'});
    }

    res.status(200).json({id: reqData.id});
  } else {
    res.status(422).json({error: 'Bad data'});
  }
})

app.delete('/tasks', (req, res) => {
  const reqData = req.body;
  if (reqData.idT) {

    let idIndex = tasks.indexOf(reqData.idT)
    if (idIndex) {
      tasks.splice(idIndex);
    } else {
      res.status(404).json({error: 'Not found'});
    }

    res.status(200).json({idT: reqData.idT});
  } else {
    res.status(422).json({error: 'Bad data'});
  }
})

app.put('/tasks', (req, res) => {
  const reqData = req.body;
  if (reqData.idT) {
    tasks.forEach((task) => {
      if(task.idT === reqData.idT) {
        task.completed = !reqData.completed;
        res.status(200).json(task);
      }
    })
  } else {
    res.status(422).json({error: 'Bad data'});
  }
})

app.use((req, res, next) => {
  res.status(404).type('text/plain')
  res.send('Not found')
})

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`)
})