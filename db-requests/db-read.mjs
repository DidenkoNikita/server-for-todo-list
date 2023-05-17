import prisma from "../prisma/prismaClient.mjs";

class DBRead {
  async readBoard(idUser) {
    try {
      const boards = await prisma.boards.findMany({
        where: {
          user_id: idUser
        }
      })
      console.log(boards);
      return boards;
    } catch(e) {
      return console.log(e);
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
      return console.log(e);
    }
  }

  async readName(idUser) {
    try {
      const userName = await prisma.users.findUnique({
        where: {
          id: idUser
        },
        select: {
          full_name: true
        }
      })
      return userName;
    } catch(e) {
      return console.log(e);
    }
  }
}

export default new DBRead();