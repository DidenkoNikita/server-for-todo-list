const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
// const session = require('express-session');
// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
// const flash = require('connect-flash');
const cors = require('cors');

let TOKEN_SECRET = require('crypto').randomBytes(64).toString('hex');

function generateAccessToken(username) {
  return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}

function generateRefreshToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '30d' });
}

const validateAccessToken = (accessToken) => {
  try {
    const userData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
}

const validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.TOKEN_SECRET);
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

// const checkAuth = () => {
//   return app.use((req, res, next) => {
//     if (req.user) next()
//     else res.redirect('/login')
//   })
// }

// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(session({ 
//   secret: 'you secret key',
//   resave: true,
//   saveUninitialized: true
// }));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());

// passport.use(
//   new localStrategy(
//     {
//       usernameField: 'login',
//       passwordField: 'pwd',
//     },
//     (user, password, done) => {
//       if (user !== 'test_user') {
//         return done(null, false, {
//           message: 'User not found',
//         })
//       } else if (password !== 'test_password') {
//         return done(null, false, {
//           message: 'Wrong password',
//         })
//       }

//       return done(null, {id: 1, name: 'Test', age: 21 })
//   })
// )

// app.get('/login', (req, res) => {
//   res.send('Login page. Please, authorize')
// })

// app.use((req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.redirect('/login')
//   }
// })

// app.post(
//   '/login',
//   passport.authenticate('local', {
//     successRedirect: '/boards',
//     failureRedirect: '/login', 
//     failureFlash: true,
//   })
// )

app.use(express.json());

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
            res.status(200).json(
              // accessToken: 
              accessToken);
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

// function accessTokenRequestUponLogin(req, res, next) {
//   const reqData = req.body;
//   const authorisationHeader = req.header('authorization');
//   console.log('reqData', reqData);
//   console.log('authorisationHeader', authorisationHeader);

//   if (reqData) {
//     let user = users.find((item) => {
//       return reqData.login === item.login && reqData.password === item.password;
//     })
//     if (user) {
//       if(!authorisationHeader) {
//         console.log('Полозователь не авторизован')
//         res.status(400).json('Полозователь не авторизован');
//       } else {
//         const accessToken = authorisationHeader.split(' ')[1];
//         if (!accessToken) {
//           console.log('нету токена')
//           res.status(401).json('Bad token');
//         } else {
//           console.log('accessToken::', accessToken);
//           const userData = validateAccessToken(accessToken);
//           console.log('userData::', userData)
//           if (!userData) {
//             next()
//           }
//         }
//       }
//     } else {
//       res.status(200).json({accessToken: accessToken});
//     }
//   }
// } 

// function updateAccessToken(req, res, next) {
//   const authorisationHeaderTwo = req.header('authorizationTwo');
//   if (!authorisationHeaderTwo) {
//     res.status(400).json('Полозователь не авторизован');
//   } else {
//     const refreshToken = authorisationHeaderTwo.split(' ')[1];
//     if (!refreshToken) {
//       res.status(401).json('Bad token');
//     } else {
//       const userDataTwo = validateRefreshToken(refreshToken);
//       if (!userDataTwo) {
//         res.status(403).json('Bad token');
//       } else {
//         let accessToken = generateAccessToken({ userId: user.userId });
//         reqData.accessToken = accessToken;
//         users.push(reqData);
//         res.status(200).json({accessToken: accessToken});
//       }
//     }
//   }
// }

app.post('/signup', (req, res) => {
  const reqData = req.body;
  if (reqData) {
    let user = users.find((item) => {
      return reqData.login === item.login
    })
    if (user) {
      res.status(403).send('Login busy')
      res.end(console.log("error 403 bro"))
    } else {
      let refreshToken = generateRefreshToken({ username: reqData.login });
      let accessToken = generateAccessToken({ userId: reqData.userId });
      reqData.accessToken = accessToken;
      reqData.refreshToken = refreshToken;
      users.push(reqData);
      res.status(200).json({refreshToken: refreshToken, accessToken: accessToken});
    }
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
  if (reqData.id) {
    data.push(reqData);
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
        // res.status(200).json({idT: task.idT, completed: task.completed, titleT: task.titleT, id: task.id})
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