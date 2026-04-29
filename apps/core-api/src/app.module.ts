import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentModule } from './modules/document/document.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),

    // System
    SystemModule,

    // Database
    PrismaModule,

    // Auth modules
    AuthModule,
    UserModule,

    // Documents
    DocumentModule,
  ],
})
export class AppModule {}
