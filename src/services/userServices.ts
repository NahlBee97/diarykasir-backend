import { Shift } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs"

export const userService = {
  getAllUsers: async () => {
    const users = await prisma.users.findMany({
      where: {
        role: "CASHIER",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        shift: true,
      },
      orderBy: { createdAt: "desc" },
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
    const existingUser = await prisma.users.findFirst({
      where: { name: userData.name },
    });

    if (existingUser) {
      throw new Error("Kasir dengan nama tersebut sudah ada.");
    }

    const hashedPin = await bcrypt.hash(userData.pin, 10);

    const newUser = await prisma.users.create({
      data: {
        name: userData.name,
        shift: userData.shift,
        pin: hashedPin,
        role: "CASHIER",
      },
    });

    await prisma.carts.create({
      data: {
        userId: newUser.id,
        quantity: 0,
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
    await prisma.users.update({
      where: { id: userId },
      data: { isActive: false },
    });
  },
};
