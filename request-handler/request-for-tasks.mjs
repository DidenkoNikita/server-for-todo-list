import { generateAccessToken } from "../authorization-service/generate-token.mjs";
import { validateAccessToken, validateRefreshToken } from "../authorization-service/validate-token.mjs";
import dbCreate from "../db-requests/db-create.mjs";
import dbDelete from "../db-requests/db-delete.mjs";
import dbRead from "../db-requests/db-read.mjs";
import dbUpdate from "../db-requests/db-update.mjs";

class RequestForTasks {
  async searchTasks (req, res) {
    const accessToken = req.cookies.accessToken;
    const validate = validateAccessToken(accessToken);
    if (!validate) { 
      const refreshToken = req.cookies.refreshToken;
      const validateRefresh = validateRefreshToken(refreshToken);
      if (validateRefresh === null) {
        res.status(402);
      } else {
        const idUser = req.body.user_id;
        const newAccessToken = generateAccessToken({idUser});
        res.cookie('accessToken', newAccessToken, {maxAge: 1800000, httpOnly: true});
        const tasks = await dbRead.readTask(idUser);
        res.status(200).json(tasks);
      }
    } else {
      const idUser = req.body.user_id;
      const newAccessToken = generateAccessToken({idUser});
      res.cookie('accessToken', newAccessToken, {maxAge: 1800000, httpOnly: true});
      const tasks = await dbRead.readTask(idUser);
      res.status(200).json(tasks);
    }
  }

  async createTask (req, res) {
    const reqData = req.body;
    if (reqData) {
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