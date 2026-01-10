import { JwtPayload } from "jsonwebtoken";
import { User } from "../generated/prisma/client";

export type UserWithoutPassword = Omit<User, "password">;

export interface RegisterRequestBody {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
}
