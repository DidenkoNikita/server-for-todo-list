import dbAuthentication from "../db-requests/db-authentication.mjs";
import { generateAccessToken, generateRefreshToken } from "./generate-token.mjs";
import { validateRefreshToken } from "./validate-token.mjs";

export const refresh = async (refreshToken, login, id) => {
  if (!refreshToken) {
    throw new Error();
  }
  const userData = validateRefreshToken(refreshToken);
  const tokenFromDb = await dbAuthentication.findToken(refreshToken);
  if(!userData || !tokenFromDb) {
    throw new Error();
  }
  const access_Token = generateAccessToken({ userId: id });
  const refresh_Token = generateRefreshToken({ username: login });
  const data = {refreshToken, id};
  await dbAuthentication.updateToken(data);
  return {access_Token, refresh_Token};
}