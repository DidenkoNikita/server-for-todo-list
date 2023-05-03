import prisma from "../prisma/prismaClient.mjs";

class DBUpdate {
  async updateCompletedTask(id, completed) {
    try {
      const tasks = await prisma.tasks.update({
        where: {
          id: id
        },
        data: {
          completed: completed
        }
      })
      return tasks;
    } catch(e) {
      return e;
    }
  }
  
  async updateTokens(data){
    const {refreshToken, id: idUser} = data;
    try {
        const token = await prisma.tokens.upsert({
          where: {
            user_id: idUser,
          },
          update: {
            refresh_token: refreshToken
          },
          create: {
            user_id: idUser,
            refresh_token: refreshToken
          }
        })
      return token;
    } catch(e) {
      return e;
    }
  }
}

export default new DBUpdate();