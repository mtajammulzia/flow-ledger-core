import { Tenant, User } from '../../generated/prisma/client';

export type JWTPayload = {
  user: Omit<User, 'password'>;
  tenant: Tenant;
  expiresAt: number;
};
