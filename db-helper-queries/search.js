import prisma from "../prisma/prismaClient.mjs";

export async function userSearch(login) {
  try {
    const data = await prisma.users.findUnique({
      where: {
        login
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

export async function tokenSearch(user_id) {
  try {
    const token = await prisma.tokens.findUnique({
      where: {
        user_id
      },
      select: {
        access_token: true
      }
    })
    return token;
  } catch(e) {
    return e;
  }
}

export async function loginSearch(idUser) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: idUser
      },
      select: {
        login: true
      }
    })
    return user
  } catch(e) {
    return e;
  }
}

export async function searchLogin(login) {
  try {
    const user = await prisma.findFirst({
      where: {
        login
      }
    })
    return user;
  } catch(e) {
    return e;
  }
}