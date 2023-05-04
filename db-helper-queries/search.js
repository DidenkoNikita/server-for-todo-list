import prisma from "../prisma/prismaClient.mjs";

export async function userSearch(login) {
  try {
    const data = await prisma.users.findUnique({
      where: {
        login: login
      },
      select: {
        id: true
      }
    })
    return data;
  } catch(e) {
    return e;
  }
}

export async function boardSearch(idUser) {
  try {
    const data = await prisma.boards.findFirst({
      where: {
        user_id: idUser
      },
      select: {
        id: true
      }
    })
    return data;
  } catch(e) {
    return e;
  }
}

export async function idSearch(accessToken) {
  try {
    const data = await prisma.tokens.findFirst({
      where: {
        access_token: accessToken
      },
      select: {
        user_id: true
      }
    })
  } catch(e) {
    return e;
  }
}