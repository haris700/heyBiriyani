import { PrismaClient } from "@prisma/client";

const userRepo = new PrismaClient().user;

export const findUserByEmail = async (email: string) => {
  return await userRepo.findUnique({
    where: {
      email: email,
    },
  });
};

export const findUserByUid = async (uid: string) => {
  return await userRepo.findFirst({
    where: {
      uid,
    },
  });
};
