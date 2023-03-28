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
      return e;
    }
  }

  async deleteBoard(id) {
    try {
      await prisma.boards.delete({
        where: {
          id
        }
      })
    } catch(e) {
      return e;
    }
  }

  async deleteManyTasks(board_id) {
    try {
      const tasks = await prisma.tasks.deleteMany({
        where: {
          board_id
        }
      })
      return tasks;
    } catch(e) {
      return e;
    }
  }
}

export default new DBDelete();