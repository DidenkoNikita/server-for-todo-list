import prisma from "../prisma/prismaClient.mjs";

class DBCreate {
  async createUser(reqData) {
    const {login, password} = reqData;
    try {
      const user = await prisma.users.create({
        data: {
          login: login,
          password: password
        }
      })
      console.log('проверка', user);
      return user;
    } catch(e) {
      return e;
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
    const {title, idUser} = data;
    try {
      const board = await prisma.boards.create({
        data: {
          user_id: idUser,
          title: title
        }
      })
      return board
    } catch(e) {
      return e;
    }
  }

  async createTask(data) {
    const {title, idUser, idBoard} = data;
    try {
      const task = await prisma.tasks.create({
        data: {
          user_id: idUser,
          board_id: idBoard,
          title: title
        }
      })
      return task
    } catch(e) {
      return e;
    }
  }
}

export default new DBCreate();