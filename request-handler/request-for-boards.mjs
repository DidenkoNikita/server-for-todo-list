import dbCreate from "../db-requests/db-create.mjs";
import dbDelete from "../db-requests/db-delete.mjs";
import dbRead from "../db-requests/db-read.mjs";
import dbUpdate from "../db-requests/db-update.mjs";

class RequestForBoards {
  async searchBoards(req, res) {
    try {
      if (req.body) {
        const idUser = req.body.user_id;
        const boards = await dbRead.readBoard(idUser);
        res.status(200).json({boards});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }

  async createBoard(req, res) {
    try {
      if (req.body) {
        const reqData = req.body;
        const board = await dbCreate.createBoard(reqData);
        res.status(200).json({board});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }

  async deleteBoard (req, res) {
    try {
      if (req.body) {
        const id = req.body.id;
        await dbDelete.deleteBoard(id);
        res.status(200).json({id: id});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }

  async updateTitleBoard (req, res) {
    try {
      if (req.body) {
        const id = req.body.id;
        const title = req.body.title;
        const board = await dbUpdate.updateTitleBoard(id, title);
        res.status(200).json({board});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }
}

export default new RequestForBoards();