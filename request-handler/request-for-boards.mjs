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
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        res.status(200).json({boards, token});
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
        console.log(reqData);
        const board = await dbCreate.createBoard(reqData);
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        res.status(200).json({board, token});
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
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        res.status(200).json({id: id, token});
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
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        res.status(200).json({board, token});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }
}

export default new RequestForBoards();