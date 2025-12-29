import { Role, Shift } from "../generated/prisma/enums";

export interface User {
  id: number;
  name: string;
  shift: Shift;
  pin: string;
  role: Role;
}