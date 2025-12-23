import { Shift } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const userService = {
  getAllUsers: async () => {
    const users = await prisma.users.findMany({
      where: {
        role: "CASHIER",
      },
      select: {
        id: true,
        name: true,
        shift: true,
      },
    });

    return users;
  },
  getUserById: async (userId: number) => {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        shift: true,
        pin: true,
      },
    });

    return user;
  },
  createUser: async (userData: { name: string; shift: Shift; pin: string }) => {
    const newUser = await prisma.users.create({
      data: {
        name: userData.name,
        shift: userData.shift,
        pin: userData.pin,
        role: "CASHIER",
      },
    });

    return newUser;
  },
  updateUser: async (
    userId: number,
    updateData: { name: string; shift: Shift; pin: string }
  ) => {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        name: updateData.name,
        shift: updateData.shift,
        pin: updateData.pin,
      },
    });

    return updatedUser;
  },
  deleteUser: async (userId: number) => {
    await prisma.users.delete({
      where: { id: userId },
    });
  },
};
