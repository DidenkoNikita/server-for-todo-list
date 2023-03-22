import prisma from "./prismaClient.mjs";

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
      return new Error(e);
    }
}