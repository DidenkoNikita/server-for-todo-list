import jwt from 'jsonwebtoken';
const {verify} = jwt;

export const validateAccessToken = (accessToken) => {
  try {
    const userData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return userData;
  } catch (e) {
    return e;
  }
}

export const validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.TOKEN_SECRET);
    return userData;
  } catch (e) {
    return e;
  }
}