const express = require('express');
const app = express();
const cors = require('cors');

let data = [];
let tasks = [];

const host = '127.0.0.1';
const port = 7000;

app.use(express.json());
app.use(cors());

app.get('/boards', (req, res) => {
  res.status(200).json(data);
})

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

console.log(data);

app.use((req, res, next) => {
  res.status(404).type('text/plain')
  res.send('Not found')
})

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`)
})