// import { Users, Tokens, Boards, Tasks } from "./prismaClient.mjs";
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
      return null;
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
      return null;
    }
  }
}

export default new DBCreate();