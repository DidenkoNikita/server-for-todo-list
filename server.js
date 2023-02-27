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
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
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

app.post('/login', (req, res) => {
  const reqData = req.body;
  const tokenKliento = generateAccessToken({ username: reqData.login });

  let user = users.find((item) => {
    return reqData.login === item.login && reqData.password === item.password;
  })
  if (user) {
    // let token = generateAccessToken({ username: reqData.login });
    const token = generateAccessToken({ username: user.login });
    // console.log(token);
    if (tokenKliento === token) {
      console.log('нихуя себе оно работает');
      console.log('token::', token);
      console.log('tokenKliento::', tokenKliento);
      res.status(200).json(token);
    } else {
      res.status(403).json({error: 'Bad data'});
    }
  }
})

app.post('/signup', (req, res) => {
  const reqData = req.body;
  if (reqData) {
    let user = users.find((item) => {
      return reqData.login === item.login
    })
    if (user) {
      res.status(200).send('Login busy')
    } else {
      token = generateAccessToken({ username: reqData.login });
      reqData.token = token
      users.push(reqData);
      res.status(200).json(token);
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