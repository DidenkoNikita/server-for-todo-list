import prisma from "../prisma/prismaClient.mjs";

class DBRead {
  async readBoard(idUser) {
    try {
      const boards = await prisma.boards.findMany({
        where: {
          user_id: idUser
        }
      })
      return boards;
    } catch(e) {
      return e;
    }
  }

  async readTask(idUser) {
    try {
      const tasks = await prisma.tasks.findMany({
        where: {
          user_id: idUser
        }
      })
      return tasks;
    } catch(e) {
      return e;
    }
  }
}

export default new DBRead();