import { generateAccessToken, generateRefreshToken } from "../authorization-service/generate-token.mjs";
import { passwordHashing, passwordVerifying } from "../authorization-service/password-hashing.mjs";
import { userSearch } from "../db-helper-queries/search.js";
import dbAuthentication from "../db-requests/db-authentication.mjs";
import dbCreate from "../db-requests/db-create.mjs";
import dbRead from "../db-requests/db-read.mjs";
import dbUpdate from "../db-requests/db-update.mjs";

class RequestForUser {
  async login(req, res) {
    try {
      const {login, password} = req.body;
      const user = await dbAuthentication.authentication(login);
      const verifyPassword = await passwordVerifying(user.password, password);
      if (verifyPassword) {
        const refreshToken = generateRefreshToken({ username: login });
        const idUser = await  userSearch(login);
        const id = idUser.id;
        const accessToken = generateAccessToken({ userId: id });
        await dbUpdate.updateTokens(accessToken, id);
        res.status(200).json({refreshToken, id})
      } else {
        res.status(400).json('Пароль неверный!');
      }
    } catch(e) {
      return e;
    }
  }
  
  async createUser(req, res ) {
    try {
      const { login, password, fullName } = req.body;
      const refreshToken = generateRefreshToken({ username: login });
      const passwordHash = await passwordHashing(password);
      const user = await dbCreate.createUser(login, passwordHash, fullName);
      const idUser = await userSearch(login);
      const id = idUser.id;
      const accessToken = generateAccessToken({ userId: id });
      if (user === undefined) {
        res.status(409).json({ error: 'Аккаунт с таким логином уже существует' });
      } else {
        await dbCreate.createTokens(accessToken, id);
        res.json({ id, refreshToken });
      }
    } catch (e) {
      return e;
    }
  }

  async getName(req, res) {
    try {
      if (req.body) {
        const idUser = req.body.user_id;
        const userName = await dbRead.readName(idUser);
        const name = userName.full_name;
        res.status(200).json({name});
      } else {
        res.status(400);
      }
    } catch(e) {
      return e;
    }
  }
}

export default new RequestForUser();