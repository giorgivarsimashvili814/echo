import type { Request } from 'express';

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  avatar:{url:string} | null
}

export type RequestWithOptionalUser = Request & { user?: SessionUser };

export type AuthenticatedRequest = Request & { user: SessionUser };

export interface DriverAdapterError {
  cause?: {
    constraint?: {
      fields?: string[];
    };
  };
}
