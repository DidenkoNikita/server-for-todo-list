// import { Users, Tokens, Boards, Tasks } from "./prismaClient.mjs";
import prisma from "./prismaClient.mjs";

class DBRequest {
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
      return null;
    }
  }

  async createTokens(data){
    const {accessToken, refreshToken, id: idUser} = data;
    console.log('data', data);
    try {
        const token = await prisma.tokens.create({
          data: {
            user_id: idUser,
            access_token: accessToken,
            refresh_token: refreshToken
          }
        })
        console.log("token-test", token);
        return token;
    } catch(e) {
      console.log(e)
      return new Error(e);
    }
  }

  async createBoard(data){
    const {title} = data;
    try {
      const board = await prisma.boards.create({
        data: {
          title
        }
      })
      return board
    } catch(e) {
      return null;
    }
  }

  async createTask(data) {
    const {title} = data;
    try {
      const task = await prisma.tasks.create({
        data: {
          title
        }
      })
      return task
    } catch(e) {
      return null;
    }
  }

  // async userSearch(login) {
  //   const user = await prisma.users.findUnique({
  //     where : {
  //       login: login
  //     }
  //   })
  //   console.log('user', user)
  //   return user
  // }
}

export default new DBRequest();