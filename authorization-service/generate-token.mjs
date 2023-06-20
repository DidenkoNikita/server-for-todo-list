import jwt from 'jsonwebtoken';
const {sign} = jwt;

export function generateAccessToken(id) {
  return sign(id, process.env.JWT_ACCESS_SECRET, {expiresIn: '30d'});
}

export  function generateRefreshToken(username) {
  return sign(username, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
}