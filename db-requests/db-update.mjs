import prisma from "../prisma/prismaClient.mjs";

class DBUpdate {
  async updateCompletedTask(id, completed) {
    try {
      const tasks = await prisma.tasks.update({
        where: {
          id
        },
        data: {
          completed
        },
        select: {
          id: true,
          completed: true
        }
      })
      console.log(tasks);
      return tasks;
    } catch(e) {
      return console.log(e);
    }
  }
  
  async updateTokens(accessToken, idUser){
    try {
        const token = await prisma.tokens.upsert({
          where: {
            user_id: idUser,
          },
          update: {
            access_token: accessToken
          },
          create: {
            user_id: idUser,
            access_token: accessToken
          }
        })
      return token;
    } catch(e) {
      return console.log(e);
    }
  }

  async updateTitleBoard(id, title) {
    try {
      const board = await prisma.boards.update({
        where: {
          id
        },
        data: {
          title
        },
        select: {
          id: true,
          title: true
        }
      })
      console.log(board);
      return board;
    } catch(e) {
      return console.log(e);
    }
  }

  async updateTitleTask(id, title) {
    try {
      const task = await prisma.tasks.update({
        where: {
          id
        },
        data: {
          title
        },
        select: {
          id: true,
          title: true
        }
      })
      console.log(task);
      return task;
    } catch(e) {
      return console.log(e);
    }
  }
}

export default new DBUpdate();