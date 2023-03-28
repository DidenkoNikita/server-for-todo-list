import dbCreate from "../db-requests/db-create.mjs";
import dbDelete from "../db-requests/db-delete.mjs";
import dbRead from "../db-requests/db-read.mjs";
import dbUpdate from "../db-requests/db-update.mjs";

class RequestForTasks {
  async searchTasks (req, res) {
    const reqData = req.body;
    const tasks = await dbRead.readTask(reqData);
    res.status(200).json(tasks);
  }

  async createTask (req, res) {
    const reqData = req.body;
    if (reqData) {
      await dbCreate.createTask(reqData);
      res.status(200).json(reqData);
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