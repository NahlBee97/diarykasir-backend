import { Shift } from "../generated/prisma/enums";

export interface NewUser {
  name: string;
  shift: Shift;
  password: string;
}

export interface UpdateUser {
  name?: string;
  shift?: Shift;
  password?: string;
}