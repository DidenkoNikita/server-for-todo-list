import prisma from "../prisma/prismaClient.mjs";

class DBDelete {
  async deleteTask(id) {
    try {
      await prisma.tasks.delete({
        where: {
          id
        }
      })
    } catch(e) {
      console.log(e);
      return e;
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
          id: id
        }
      })
    } catch(e) {
      return e;
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
      return e;
    }
  }
}

export default new DBDelete();