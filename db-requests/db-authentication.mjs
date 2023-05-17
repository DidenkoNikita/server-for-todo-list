import prisma from "../prisma/prismaClient.mjs";

class DBAuthentication {
  async authentication(login) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          login
        }
      })
      return user;
    } catch(e) {
      return console.log(e);
    }
  }
}

export default new DBAuthentication();