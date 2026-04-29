import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWTPayload } from '../auth.types';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request;

      const token = this.extractTokenFromHeader(request);
      if (!token) throw new UnauthorizedException('Access token not found');

      const payload = await this.jwtService.verifyAsync<JWTPayload>(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });
      if (payload.expiresAt < Date.now()) throw new UnauthorizedException('Access token expired');

      request['flo-context'] = payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid access token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
