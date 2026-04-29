import { Controller, Get } from '@nestjs/common';
import { RequireAuth } from '../auth/decorators/auth.decorator';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('health')
  getHealthStatus(): string {
    return this.systemService.getHealthStatus();
  }

  @Get('protected')
  @RequireAuth()
  getProtectedResource(): string {
    return 'Ok';
  }
}
