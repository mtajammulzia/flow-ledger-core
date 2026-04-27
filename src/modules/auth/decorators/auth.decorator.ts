import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGuard, PermissionGuard } from '../guards';

type RequireAuthOptions = {
  permissions?: string[];
};

export function RequireAuth(options?: RequireAuthOptions) {
  const { permissions } = options || {};
  return applyDecorators(SetMetadata('permissions', permissions), UseGuards(JwtGuard, PermissionGuard));
}
