import dbCreate from "../db-requests/db-create.mjs";
import dbDelete from "../db-requests/db-delete.mjs";
import dbRead from "../db-requests/db-read.mjs";
import dbUpdate from "../db-requests/db-update.mjs";

class RequestForTasks {
  async searchTasks (req, res) {
    try {
      if (req.body) {
        const idUser = req.body.user_id;
        const tasks = await dbRead.readTask(idUser);
        res.status(200).json({tasks});
      } else {
        res.status(400);
      }
    } catch(e) {

    }
  }

  async createTask (req, res) {
    try {
      if (req.body) {
        const reqData = req.body;
        const task = await dbCreate.createTask(reqData);
        res.status(200).json({task});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }

  async deleteTask (req, res) {
    try {
      if (req.body) {
        const id = req.body.id;
        const task = await dbDelete.deleteTask(id);
        res.status(200).json({task});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }

  async completedTask (req, res) {
    try {
      if (req.body) {
        const id = req.body.id;
        const completed = !req.body.completed;
        const task = await dbUpdate.updateCompletedTask(id, completed);
        res.status(200).json({task});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }

  async updateDescriptionTask (req, res) {
    try {
      if (req.body) {
        const id = req.body.id;
        const title = req.body.title;
        const task = await dbUpdate.updateTitleTask(id, title);
        res.status(200).json({task});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }
}

export default new RequestForTasks();