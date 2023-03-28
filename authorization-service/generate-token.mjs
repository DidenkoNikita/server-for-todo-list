import jwt from 'jsonwebtoken';
const {sign} = jwt;

export function generateAccessToken(username) {
  return sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}

export function generateRefreshToken(username) {
  return sign(username, process.env.TOKEN_SECRET, { expiresIn: '30d' });
}