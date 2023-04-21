import { generateAccessToken } from "../authorization-service/generate-token.mjs";
import { validateAccessToken, validateRefreshToken } from "../authorization-service/validate-token.mjs";
import dbCreate from "../db-requests/db-create.mjs";
import dbDelete from "../db-requests/db-delete.mjs";
import dbRead from "../db-requests/db-read.mjs";

class RequestForBoards {
  async searchBoards (req, res) {
    const data = req.headers.authorization;
    const accessToken = data?.split(' ')[1];
    const validate = validateAccessToken(accessToken);
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
      res.status(200).json(...boards, newAccessToken);
    } else {
      const reqData = req.body;
      const idUser = reqData.id;
      let boards = await dbRead.readBoard(idUser);
      res.status(200).json(boards);
    }
  }

  async createBoard(req, res) {
    const reqData = req.body;
    if (reqData) {
      const board = await dbCreate.createBoard(reqData);
      res.status(200).json(board);
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