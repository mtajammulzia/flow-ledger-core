import { Tenant, User } from '@generated/prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../../utils/bcrypt';
import { UserService } from '../user/user.service';
import { JWTPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signInWithEmailAndPassword(email: string, password: string) {
    const { user, tenant } = (await this.userService.getUserByEmail(email)) || {};
    if (!user || !tenant) throw new UnauthorizedException('User or tenant does not exist or is inactive');

    const userCredentials = await this.userService.getUserCredentials(user.id);
    if (!userCredentials) throw new UnauthorizedException('User or tenant does not exist or is inactive');

    const isPasswordValid = await comparePassword(password, userCredentials.password);
    if (!isPasswordValid) throw new UnauthorizedException('One or more credentials are invalid');

    this.userService.updateUserLoginInfo(user.id);

    return await this.getTokens(user, tenant);
  }

  private async getTokens(user: User, tenant: Tenant) {
    const accessTokenPayload: JWTPayload = {
      user,
      tenant,
      expiresAt: Date.now() + this.configService.get<number>('ACCESS_TOKEN_EXPIRES_IN_DAYS', 1) * 24 * 60 * 60 * 1000,
    };

    const refreshTokenPayload: JWTPayload = {
      user,
      tenant,
      expiresAt: Date.now() + this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_DAYS', 7) * 24 * 60 * 60 * 1000,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
