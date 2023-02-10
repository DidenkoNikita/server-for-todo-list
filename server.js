const app = require('express')()

const host = '127.0.0.1'
const port = 7000

app.get('/boards', (req, res) => {
  // res.status(200).type('text/plain')
  res.status(200).json({title: 'dont give a fuck'});
})

app.use((req, res, next) => {
  res.status(404).type('text/plain')
  res.send('Not found')
})

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`)
})