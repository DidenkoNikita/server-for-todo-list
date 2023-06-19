import prisma from "../prisma/prismaClient.mjs";

class DBCreate {
  async createUser(login, password, fullName) {
    try {
      const user = await prisma.users.create({
        data: {
          login,
          password,
          full_name: fullName
        }
      })
      return user;
    } catch(e) {
      return console.log(e);
    }
  }

  async createTokens(accessToken, id){
    try {
      const token = await prisma.tokens.create({
        data: {
          user_id: id,
          access_token: accessToken
        }
      })
      return token;
    } catch(e) {
      return console.log(e);
    }
  }

  async createBoard(data){
    const {title, user_id} = data;
    try {
      const board = await prisma.boards.create({
        data: {
          user_id,
          title
        }
      })
      return board;
    } catch(e) {
      return console.log(e);
    }
  }

  async createTask(data) {
    const {description, id, user_id, completed} = data;
    try {
      const task = await prisma.tasks.create({
        data: {
          user_id,
          board_id: id,
          title: description,
          completed
        }
      })
      return task;
    } catch(e) {
      return console.log(e);
    }
  }
}

export default new DBCreate();