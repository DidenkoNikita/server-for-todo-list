import { generateAccessToken, generateRefreshToken } from "../authorization-service/generate-token.mjs";
import { passwordHashing, passwordVerifying } from "../authorization-service/password-hashing.mjs";
import { refresh } from "../authorization-service/refresh-token.mjs";
import { userSearch } from "../db-helper-queries/search.js";
import dbAuthentication from "../db-requests/db-authentication.mjs";
import dbCreate from "../db-requests/db-create.mjs";

class RequestForUser {
  async checkAccessToken(req, res, next) {
    try {
        // const authorisationHeader = req.header('authorization');
      const {login, password} = req.body;
      const user = await dbAuthentication.authentication(login);
      const verifyPassword = await passwordVerifying(user.password, password);
      if (verifyPassword) {
        // const accessToken = authorisationHeader.split(' ')[1];
        // if (!accessToken) {
        //   res.status(401).json('Bad token');
        // } else {
        //   const userData = validateAccessToken(accessToken);
        //   if (userData !== false) {
        //     res.status(200).json("Пользователь авторизован");
        //   } else {
        //     next()
        //   }
        //   }
        const refreshToken = generateRefreshToken({ username: login });
        const idUser = await  userSearch(login)
        const id = idUser.id;
        const accessToken = generateAccessToken({ userId: id });
        const data = {refreshToken, ...idUser};
        await dbCreate.createTokens(data);
        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        res.status(200).json({accessToken: accessToken, id: id});
      } else {
        res.status(400).json('Полозователь не авторизован');
      }
    } catch (e) {
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
    // const authorisationHeaderTwo = req.header('authorizationTwo');
    // if (!authorisationHeaderTwo) {
    //   res.status(400).json('Полозователь не авторизован');
    // } else {
    //   const refreshToken = authorisationHeaderTwo.split(' ')[1];
    //   if (!refreshToken) {
    //     res.status(401).json('Bad token');
    //   } else {
    //     const userDataTwo = validateRefreshToken(refreshToken);
    //     if (!userDataTwo) {
    //       res.status(403).json('Bad token');
    //     } else {
    //       const reqData = req.body;
    //       const user = await dbAuthentication.authentication(reqData);
    //       const id = user.id
    //       const accessToken = generateAccessToken({ userId: id });
    //       dbAuthentication.updateAccessToken(id, accessToken)
    //       reqData.accessToken = accessToken;
    //       res.status(200).json({accessToken: accessToken});
    //     }
    //   }
    // }
    // next();
  }

  async createUser (req, res) {
    const reqData = req.body;
    if (reqData) {
        const refreshToken = generateRefreshToken({ username: reqData.login });
        const password = reqData.password;
        reqData.password = await passwordHashing(password);
        await  dbCreate.createUser(reqData);
        const login = reqData.login;
        const idUser = await  userSearch(login)
        const id = idUser.id;
        const accessToken = generateAccessToken({ userId: id });
        const data = {refreshToken, ...idUser};
        await dbCreate.createTokens(data);
        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        res.status(200).json({accessToken: accessToken, id: id});
    } else {
      res.status(422).json({error: 'Bad data'});
    }
  }
}

export default new RequestForUser();