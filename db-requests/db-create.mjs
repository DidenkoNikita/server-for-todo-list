import prisma from "../prisma/prismaClient.mjs";

class DBCreate {
  async createUser(login, password) {
    try {
      const user = await prisma.users.create({
        data: {
          login: login,
          password: password
        }
      })
      return user;
    } catch {
      return null;
    }
  }

  async createTokens(data){
    const {refreshToken, id: idUser} = data;
    try {
      const token = await prisma.tokens.create({
        data: {
          user_id: idUser,
          refresh_token: refreshToken
        }
      })
      return token;
    } catch(e) {
      return e;
    }
  }

  async createBoard(data){
    const {title, user_id} = data;
    try {
      const board = await prisma.boards.create({
        data: {
          user_id: user_id,
          title: title
        }
      })
      return board
    } catch(e) {
      return e;
    }
  }

  async createTask(data) {
    const {title, idBoard, idUser, completed} = data;
    try {
      const task = await prisma.tasks.create({
        data: {
          user_id: idUser,
          board_id: idBoard,
          title: title,
          completed: completed
        }
      })
      return task;
    } catch(e) {
      return e;
    }
  }
}

export default new DBCreate();