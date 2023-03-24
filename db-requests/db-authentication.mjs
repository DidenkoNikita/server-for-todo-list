import prisma from "../prisma/prismaClient.mjs";

class DBAuthentication {
  async authentication(reqData) {
    const {login, password} = reqData
    try {
      const user = await prisma.user.findUnique({
        where: {
          login,
          password
        }
      })
      return user;
    } catch(e) {
      console.log("error::", e);
      return e;
    }
  }

  async updateAccessToken(id, accessToken) {
    try {
      const token = await prisma.tokens.update({
        where: {
          user_id: id
        },
        data: {
          access_token: accessToken
        }
      })
      return token;
    } catch(e) {
      console.log("error::", e);
      return e;
    }
  }
}

export default new DBAuthentication();