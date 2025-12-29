import { UserRoles } from "@prisma/client";

export interface IUserReqParam {
  id: number; 
  name: string;
  role: UserRoles;
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUserReqParam;
    }
  }
}