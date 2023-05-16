import { generateRefreshToken } from "../authorization-service/generate-token.mjs";
import { validateAccessToken, validateRefreshToken } from "../authorization-service/validate-token.mjs";
import { loginSearch, tokenSearch } from "../db-helper-queries/search.js";

export const checkTokenMiddleware =  async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  console.log('эээээээээээ');
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1];
    const validate = validateRefreshToken(token);
    if (validate) {
      console.log('уй буй');
      next();
    } else {
      console.log('кефтеме');
      const {user_id} = req.body;
      console.log('iddddddddddddd', user_id);
      const token = await tokenSearch(user_id);
      console.log(token);
      const validateAccess = validateAccessToken(token.access_token);
      console.log(validateAccess);
      if (validateAccess === null) {
        res.status(401).send('Недействительный токен');
      } else {
        const idUser = req.body.user_id;
        console.log(idUser);
        const {login} = await loginSearch(idUser);
        console.log(login);
        const refreshToken = generateRefreshToken({ username: login }); 
        console.log(refreshToken);
        res.status(201).json(refreshToken)
      }
    }
  } else {
    res.status(401).send('Отсутствует заголовок Authorization');
  }
};