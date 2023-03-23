console.log('INIT APP');
import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
config();
import cors from 'cors';
import { boardSearch, userSearch } from './db-helper-queries/search.js';
import dbCreate from './db-requests/db-create.mjs'
import dbRead from './db-requests/db-read.mjs';
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
      let refreshToken = generateRefreshToken({ username: reqData.login });
      let accessToken = generateAccessToken({ userId: reqData.userId });
      
      await  dbCreate.createUser(reqData);
      let login = reqData.login;
      console.log(login)
      let idUser = await  userSearch(login)
      console.log('idUser::', idUser)
      let id = idUser.id;
      let data = {accessToken, refreshToken, ...idUser};

      // if(data)
      await dbCreate.createTokens(data);
        res.status(200).json({refreshToken: refreshToken, accessToken: accessToken, id: id});
  } else {
    res.status(422).json({error: 'Bad data'});
  }
})
  
app.post('/read_boards', async (req, res) => {
  const reqData = req.body;
  const idUser = reqData.idUser;
  let boards = await dbRead.readBoard(idUser);
  res.status(200).json(boards);
})

//удалил  checkAuth(), строка 79

app.post('/read_tasks', async (req, res) => {
  const reqData = req.body;
  console.log("reqData::", reqData);
  let tasks = await dbRead.readTask(reqData);
  console.log("server-tasks::", tasks);
  res.status(200).json(tasks);
})

app.post('/boards', async (req, res) => {
  const reqData = req.body;
  if (reqData) {
    await dbCreate.createBoard(reqData)

    let idUser = reqData.idUser;
    console.log("idUser", idUser)

    let idBoard = await boardSearch(idUser);
    console.log("idBoard", idBoard);
    reqData.idBoard = idBoard.id
    console.log('id', reqData.idBoard);
    res.status(200).json(reqData);
  } else {
    res.status(422).json({error: 'Bad data'});
  }
})

app.post('/tasks', async (req, res) => {
  const reqData = req.body;
  if (reqData) {
    await dbCreate.createTask(reqData);
    res.status(200).json(reqData);
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