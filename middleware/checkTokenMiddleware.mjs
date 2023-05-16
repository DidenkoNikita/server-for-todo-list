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
      const token = await tokenSearch(user_id);
      const validateAccess = validateAccessToken(token.access_token)
      if (validateAccess === null) {
        res.status(401).send('Недействительный токен');
      } else {
        const idUser = req.body.user_id;
        const {login} = await loginSearch(idUser);
        const refreshToken = generateRefreshToken({ username: login }); 
        res.status(200).json({refreshToken})
      }
    }
  } else {
    res.status(401).send('Отсутствует заголовок Authorization');
  }
};