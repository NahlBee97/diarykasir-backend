import { Role } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const authModels = {
  findUser: async (role: Role, pin: string) => {
    const user = await prisma.users.findFirst({
      where: {
        role, pin
      },
    });
    return user;
  },
};
