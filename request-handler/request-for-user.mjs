import { validationResult } from "express-validator";
import { generateAccessToken, generateRefreshToken } from "../authorization-service/generate-token.mjs";
import { passwordHashing, passwordVerifying } from "../authorization-service/password-hashing.mjs";
import { refresh } from "../authorization-service/refresh-token.mjs";
import { userSearch } from "../db-helper-queries/search.js";
import dbAuthentication from "../db-requests/db-authentication.mjs";
import dbCreate from "../db-requests/db-create.mjs";
import dbDelete from "../db-requests/db-delete.mjs";
import dbUpdate from "../db-requests/db-update.mjs";
import apiError from "../exceptions/api-error.mjs";

class RequestForUser {
  async checkAccessToken(req, res, next) {
    try {
      const {login, password} = req.body;
      const user = await dbAuthentication.authentication(login);
      const verifyPassword = await passwordVerifying(user.password, password);
      if (verifyPassword) {
        const refreshToken = generateRefreshToken({ username: login });
        const idUser = await  userSearch(login)
        const id = idUser.id;
        const accessToken = generateAccessToken({ userId: id });
        const data = {refreshToken, ...idUser};
        const update = await dbUpdate.updateTokens(data);
        console.log('update token::', update);
        console.log("refresh token::", refreshToken);
        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        res.json({accessToken: accessToken, id: id});
      } else {
        res.status(400).json('Пароль неверный!');
      }
    } catch(e) {
      next(e)
    }
  }

  async checkRefreshToken(req, res, next) {
    try {
      const {login} = req.body;
      const idUser = await  userSearch(login)
      const id = idUser.id;
      const {refreshToken} = req.cookies;
      const userData = await refresh(refreshToken, login, id);
      res.cookie('refreshToken', userData.refresh_Token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      res.status(200).json({...userData});
    } catch(e) {
      next(e)
    }
  }

  async createUser (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(apiError.BadRequest('Ошибка при валидации', errors.array()))
      }
      const {login, password} = req.body;
      console.log("login::", login);
      const refreshToken = generateRefreshToken({ username: login });
      const passwordHash = await passwordHashing(password);
      await  dbCreate.createUser(login, passwordHash);
      const idUser = await userSearch(login)
      console.log("idUser::", idUser);
      const id = idUser.id;
      const accessToken = generateAccessToken({ userId: id });
      const data = {refreshToken, id};
      await dbCreate.createTokens(data);
      res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      res.json({accessToken: accessToken, id: idUser.id});
    } catch(e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const reqData = req.body;
      const id = reqData.id
      await dbDelete.deleteToken(id);
      res.status(200).json("Поздравляю, можете идти нахуй!!!");
    } catch(e) {
      next(e)
    }
  }
}

export default new RequestForUser();