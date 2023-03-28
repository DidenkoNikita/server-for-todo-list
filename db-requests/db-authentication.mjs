import prisma from "../prisma/prismaClient.mjs";

class DBAuthentication {
  async authentication(login) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          login: login
        }
      })
      return user;
    } catch(e) {
      return e;
    }
  }

  async updateToken(id, refreshToken) {
    try {
      const token = await prisma.tokens.update({
        where: {
          user_id: id
        },
        data: {
          refresh_token: refreshToken
        }
      })
      return token;
    } catch(e) {
      return e;
    }
  }

  async findToken(refreshToken) {
    try {
      const tokenData = await prisma.tokens.findUnique({
        where: {
          refreshToken
        }
      })
      return tokenData;
    } catch(e) {
      return e;
    }
  }
}

export default new DBAuthentication();