import prisma from "../prisma/prismaClient.mjs";

class DBDelete {
  async deleteTask(id) {
    try {
      const task = await prisma.tasks.delete({
        where: {
          id
        },
        select: {
          id: true
        }
      })
      return task;
    } catch(e) {
      return console.log(e);
    }
  }

  async deleteBoard(id) {
    try {
      await prisma.tasks.deleteMany({
        where: {
          board_id: id
        }
      })
      await prisma.boards.delete({
        where: {
          id
        }
      })
    } catch(e) {
      return console.log(e);
    }
  }

  async deleteToken(idUser) {
    try {
      await prisma.tokens.delete({
        where: {
          user_id: idUser
        }
      })
    } catch(e) {
      return console.log(e);
    }
  }
}

export default new DBDelete();