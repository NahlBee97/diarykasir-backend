import { Role } from "../generated/prisma/enums";

export interface User {
  id: number;
  name: string;
  pin: string;
  role: Role;
}