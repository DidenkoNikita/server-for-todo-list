import { boardSearch } from "../db-helper-queries/search.js";
import dbCreate from "../db-requests/db-create.mjs";
import dbDelete from "../db-requests/db-delete.mjs";
import dbRead from "../db-requests/db-read.mjs";

class RequestForBoards {
  async searchBoards (req, res) {
    const reqData = req.body;
    const idUser = reqData.idUser;
    let boards = await dbRead.readBoard(idUser);
    res.status(200).json(boards);
  }

  async createBoard(req, res) {
    const reqData = req.body;
    if (reqData) {
      await dbCreate.createBoard(reqData)
  
      let idUser = reqData.idUser;
  
      let idBoard = await boardSearch(idUser);
      reqData.idBoard = idBoard.id
      console.log('id', reqData.idBoard);
      res.status(200).json(reqData);
    } else {
      res.status(422).json({error: 'Bad data'});
    }
  }

  async deleteBoard (req, res) {
    const reqData = req.body;
    if (reqData) {
      const id = reqData.id;
      await dbDelete.deleteBoard(id);
      await dbDelete.deleteManyTasks(id);
      res.status(200).json({id: id});
    } else {
      res.status(422).json({error: 'Bad data'});
    }
  }
}

export default new RequestForBoards();