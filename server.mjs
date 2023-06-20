import express, { json } from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
config();
import cors from 'cors';

import requestForUser from './request-handler/request-for-user.mjs';
import requestForBoards from './request-handler/request-for-boards.mjs';
import requestForTasks from './request-handler/request-for-tasks.mjs';

import { checkTokenMiddleware } from './middleware/checkTokenMiddleware.mjs';

const app = express();

const host = '127.0.0.1';
const port = 7000;

app.use(cors(
  {
    credentials: true,
    origin: "*"
  }
));
app.use(json());

const secret = 'qwerty';
app.use(cookieParser());

app.post('/login', requestForUser.login);
app.post('/signup', requestForUser.createUser);
app.post('/user', checkTokenMiddleware, requestForUser.getName);

app.post('/read_boards', checkTokenMiddleware, requestForBoards.searchBoards);
app.post('/boards', checkTokenMiddleware, requestForBoards.createBoard);
app.delete('/boards', checkTokenMiddleware, requestForBoards.deleteBoard);
app.post('/update_boards', checkTokenMiddleware, requestForBoards.updateTitleBoard);

app.post('/read_tasks', checkTokenMiddleware, requestForTasks.searchTasks);
app.post('/tasks', checkTokenMiddleware, requestForTasks.createTask);
app.delete('/tasks', checkTokenMiddleware, requestForTasks.deleteTask);
app.post('/tasks_completed', checkTokenMiddleware, requestForTasks.completedTask);
app.post('/update_tasks', checkTokenMiddleware, requestForTasks.updateDescriptionTask);


app.use((req, res) => {
  res.status(404).type('text/plain')
  res.send('Not found')
});

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`)
});

export default app;