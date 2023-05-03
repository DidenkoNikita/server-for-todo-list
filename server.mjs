import express, { json } from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
config();
import cors from 'cors';

import requestForUser from './request-handler/request-for-user.mjs';
import requestForBoards from './request-handler/request-for-boards.mjs';
import requestForTasks from './request-handler/request-for-tasks.mjs';

const app = express();

const host = '127.0.0.1';
const port = 7000;

app.use(cors(
  {
    credentials: true,
    origin: process.env.CLIENT_URL
  }
));
app.use(json());
app.use(cookieParser());

app.post('/login', requestForUser.checkAccessToken);
app.post('/signup', requestForUser.createUser);
app.get('/refresh', requestForUser.checkRefreshToken);
app.post('/read_boards', requestForBoards.searchBoards);
app.post('/logout', requestForUser.logout);
app.post('/read_tasks', requestForTasks.searchTasks);
app.post('/boards', requestForBoards.createBoard);
app.post('/tasks', requestForTasks.createTask);
app.delete('/boards', requestForBoards.deleteBoard);
app.delete('/tasks', requestForTasks.deleteTask);
app.post('/tasks_completed', requestForTasks.completedTask);


app.use((req, res) => {
  res.status(404).type('text/plain')
  res.send('Not found')
});

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`)
});