import bcrypt from "bcryptjs";
import { userModels } from "../models/userModels";
import { AppError } from "../utils/appError";
import { NewUser, UpdateUser } from "../interfaces/userInterface";
import { authModels } from "../models/authModels";

export const userService = {
  getAllUsers: async () => {
    const users = await userModels.getAll();

    return users;
  },
  getUserById: async (userId: number) => {
    const user = await userModels.findById(userId);

    if (!user) throw new AppError("Kasir tidak ditemukan", 404);

    return user;
  },
  createUser: async (userData: NewUser) => {
    const { name, shift, pin } = userData;

    const existingUser = await userModels.findByName(name);

    if (existingUser) {
      throw new AppError("Kasir dengan nama tersebut sudah ada", 401);
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const newUser = await userModels.create(name, shift, hashedPin);

    if (!newUser) throw new AppError("Gagal mendaftarkan kasir", 500);

    return newUser;
  },
  updateUser: async (userId: number, updateData: UpdateUser) => {
    const existingUser = await authModels.findUser(userId);

    if (!existingUser) throw new AppError("Kasir tidak ditemukan", 404);

    const hashedPin = updateData.pin
      ? await bcrypt.hash(updateData.pin as string, 10)
      : updateData.pin;

    const updatedUser = await userModels.update(
      updateData,
      existingUser,
      hashedPin as string
    );

    if (!updatedUser) throw new AppError("Gagal update user", 500);
    
    return updatedUser;
  },
  deleteUser: async (userId: number) => {
    const deletedUser = await userModels.delete(userId);
    
    if (!deletedUser) throw new AppError("Gagal hapus user", 500);

    return deletedUser;
  },
};
