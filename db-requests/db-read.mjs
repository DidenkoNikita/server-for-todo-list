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
      return null;
    }
  }

  async readTask(data) {
    const { idUser, idBoard } = data;
    try {
      const tasks = await prisma.tasks.findMany({
        where: {
          user_id: idUser,
          board_id: idBoard
        }
      })
      console.log("tasks::", tasks);
      return tasks;
    } catch(e) {
      console.log(e);
      return e;
    }
  }
}

export default new DBRead();