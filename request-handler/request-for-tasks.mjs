import { validateAccessToken } from "../authorization-service/validate-token.mjs";
import dbCreate from "../db-requests/db-create.mjs";
import dbDelete from "../db-requests/db-delete.mjs";
import dbRead from "../db-requests/db-read.mjs";
import dbUpdate from "../db-requests/db-update.mjs";

class RequestForTasks {
  async searchTasks (req, res) {
    const accessToken = req.headers.authorization;
    const validateToken = accessToken.split(' ')[1];
    const validate = validateAccessToken(validateToken);
    if (!validate) { 
      const refreshToken = req.cookies.refreshToken
      const validateRefresh = validateRefreshToken(refreshToken);
      if (validateRefresh === null) {
        res.status(401).json("ой ты invalid");
      }
      const reqData =  req.body;
      const idUser = reqData.id;
      const newAccessToken = generateAccessToken({idUser});
      const boards = await dbRead.readBoard(idUser);
      res.status(200).json(...boards, newAccessToken)
    } else {
      const reqData = req.body;
      const tasks = await dbRead.readTask(reqData);
      res.status(200).json(tasks);
    }
  }

  async createTask (req, res) {
    const reqData = req.body;
    if (reqData) {
      console.log("TASKAAAA!!! ::", reqData);
      const task = await dbCreate.createTask(reqData);
      res.status(200).json(task);
    } else {
      res.status(422).json({error: 'Bad data'});
    }
  }

  async deleteTask (req, res) {
    const reqData = req.body;
    if (reqData) {
      const id = reqData.id;
      await dbDelete.deleteTask(id);
      res.status(200).json({id: reqData.id});
    } else {
      res.status(422).json({error: 'Bad data'});
    }
  }

  async completedTask (req, res) {
    const reqData = req.body;
    if (reqData) {
      const id = reqData.id;
      const completed = !reqData.completed;
      const task = await dbUpdate.updateCompletedTask(id, completed);
      res.status(200).json(task);
    } else {
      res.status(422).json({error: 'Bad data'});
    }
  }
}

export default new RequestForTasks();