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
}

export default new DBUpdate();