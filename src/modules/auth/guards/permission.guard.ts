import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * This guard should always be used after JwtGuard as it is responsible to attach ttContext to request.
 * Throws BadRequestException if ttContext is not found
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    const user = request['flo-context']?.user;
    const tenant = request['flo-context']?.tenant;

    if (!user || !tenant) {
      // How to debug: Check if jwt guard correctly injects ttContext in request
      throw new BadRequestException(
        "Context not found in request. Ensure JwtGuard is applied before PermissionGuard and it correctly attaches user and tenant to request['flo-context']",
      );
    }

    // Get the required permission(s) from metadata
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    // No or empty permissions required implies open access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // TODO IMPLEMENT PERMISSION CHECKING LOGIC HERE

    return true;
  }
}
