import jwt from 'jsonwebtoken';

const {verify} = jwt;

export const validateAccessToken = (accessToken) => {
  try {
    const validateAccessToken = verify(accessToken, process.env.JWT_ACCESS_SECRET);
    return validateAccessToken;
  } catch (e) {
    return null;
  }
}

export const validateRefreshToken = (refreshToken) => {
  try {
    const validateRefreshToken = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return validateRefreshToken;
  } catch (e) {
    return e.code;
  }
}