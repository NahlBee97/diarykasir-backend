import { Role, Shift } from "../generated/prisma/enums";

export interface User {
  id: number;
  name: string;
  shift: Shift;
  password: string;
  role: Role;
}