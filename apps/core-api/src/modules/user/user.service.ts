import { Tenant, User, UserCredentials } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserCredentials(userId: string): Promise<UserCredentials | null> {
    const userCredentials = await this.prismaService.userCredentials.findUnique({ where: { userId: userId } });
    if (!userCredentials) return null;
    return userCredentials;
  }

  async getUserByEmail(email: string): Promise<{ user: User; tenant: Tenant } | null> {
    const userWithTenant = await this.prismaService.user.findUnique({
      where: { email, isActive: true },
      include: { tenant: true },
    });
    if (!userWithTenant || !userWithTenant.tenant.isActive) return null;

    const { tenant, ...user } = userWithTenant;

    return { user, tenant };
  }

  async updateUserLoginInfo(userId: string) {
    await this.prismaService.userCredentials.update({
      where: { userId: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}
