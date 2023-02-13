const app = require('express')();
const cors = require('cors');

const data = [{id: 'b1', title: "Board1", tasks: [{idT: 1, completed: false, titleT: "task1"}, {idT: 2, completed: true, titleT: "task2"}, {idT: 3, completed: false, titleT: "task3"}]},
              {id: 'b2', title: "Board2", tasks: [{idT: 4, completed: false, titleT: "task4"}, {idT: 5, completed: true, titleT: "task5"}, {idT: 6, completed: false, titleT: "task6"}]}];


const host = '127.0.0.1';
const port = 7000;

app.use(cors());

app.get('/boards', (req, res) => {
  // res.status(200).type('text/plain')
  res.status(200).json(data);
})

app.use((req, res, next) => {
  res.status(404).type('text/plain')
  res.send('Not found')
})

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`)
})