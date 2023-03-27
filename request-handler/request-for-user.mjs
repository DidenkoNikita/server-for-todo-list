import { generateAccessToken, generateRefreshToken } from "../authorization-service/generate-token.mjs";
import { passwordHashing, passwordVerifying } from "../authorization-service/password-hashing.mjs";
import { validateRefreshToken } from "../authorization-service/validate-token.mjs";
import { userSearch } from "../db-helper-queries/search.js";
import dbAuthentication from "../db-requests/db-authentication.mjs";
import dbCreate from "../db-requests/db-create.mjs";

class RequestForUser {
  async checkAccessToken(req, res, next) {
    const reqData = req.body;
    const authorisationHeader = req.header('authorization');
    console.log('reqData', reqData);
    console.log('authorisationHeader', authorisationHeader);
  
    if (reqData) {
      const password = reqData.password;
      const user = await dbAuthentication.authentication(reqData);
      const hashPassword = user.password;
      const verifyPassword = await passwordVerifying(hashPassword, password);
      console.log("verify password::", verifyPassword);
      if (verifyPassword === true) {
        if(!authorisationHeader) {
          res.status(400).json('Не лезь, оно тебя сожрёт');
        } else {
          const accessToken = authorisationHeader.split(' ')[1];
          if (!accessToken) {
            console.log('нету токена')
            res.status(401).json('Bad token');
          } else {
            console.log('accessToken::', accessToken);
            const userData = validateAccessToken(accessToken);
            console.log("validate::", userData);
            if (userData !== false) {
              res.status(200).json("Пользователь авторизован");
            } else {
              next()
            }
          }
        }
      } else {
        res.status(400).json('Полозователь не авторизован');
      }
    } else {
      res.status(400).json('Полозователь не авторизован');
    }
  }

  async checkRefreshToken(req, res) {
    const authorisationHeaderTwo = req.header('authorizationTwo');
    if (!authorisationHeaderTwo) {
      res.status(400).json('Полозователь не авторизован');
    } else {
      const refreshToken = authorisationHeaderTwo.split(' ')[1];
      if (!refreshToken) {
        res.status(401).json('Bad token');
      } else {
        const userDataTwo = validateRefreshToken(refreshToken);
        if (!userDataTwo) {
          res.status(403).json('Bad token');
        } else {
          const reqData = req.body;
          const user = await dbAuthentication.authentication(reqData);
          const id = user.id
          let accessToken = generateAccessToken({ userId: id });
          dbAuthentication.updateAccessToken(id, accessToken)
          reqData.accessToken = accessToken;
          console.log('access token new', accessToken);
          res.status(200).json({accessToken: accessToken});
        }
      }
    }
    next();
  }

  async createUser (req, res) {
    const reqData = req.body;
    if (reqData) {
        const refreshToken = generateRefreshToken({ username: reqData.login });
        const accessToken = generateAccessToken({ userId: reqData.userId });
  
        const password = reqData.password;
        reqData.password = await passwordHashing(password);
  
        await  dbCreate.createUser(reqData);
  
        let login = reqData.login;
        let idUser = await  userSearch(login)
        let id = idUser.id;
  
        let data = {accessToken, refreshToken, ...idUser};
  
        await dbCreate.createTokens(data);
  
        res.status(200).json({refreshToken: refreshToken, accessToken: accessToken, id: id});
    } else {
      res.status(422).json({error: 'Bad data'});
    }
  }
}

export default new RequestForUser();