import { Shift } from "../generated/prisma/enums";
import { User } from "../interfaces/authInterface";
import { UpdateUser } from "../interfaces/userInterface";
import { prisma } from "../lib/prisma";

export const userModels = {
  getAll: async () => {
    try {
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
    } catch (error) {
      throw error;
    }
  },

  findById: async (userId: number) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      return user;
    } catch (error) {
      throw error;
    }
  },

  findByName: async (name: string) => {
    try {
      const user = await prisma.users.findFirst({
        where: { name },
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  create: async (name: string, shift: Shift, pin: string) => {
    try {
      const newUser = await prisma.users.create({
        data: {
          name,
          shift,
          pin,
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
    } catch (error) {
      throw error;
    }
  },

  update: async (
    updateData: UpdateUser,
    existingUser: User,
    hashedPin: string
  ) => {
    try {
      const updatedUser = await prisma.users.update({
        where: { id: existingUser.id },
        data: {
          name: updateData.name || existingUser.name,
          shift: updateData.shift || existingUser.shift,
          pin: hashedPin || existingUser.pin,
        },
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  delete: async (userId: number) => {
    try {
      const deletedUser = await prisma.users.update({
        where: { id: userId },
        data: { isActive: false },
      });
      return deletedUser;
    } catch (error) {
      throw error;
    }
  },
};
