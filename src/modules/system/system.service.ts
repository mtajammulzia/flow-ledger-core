import { Injectable } from '@nestjs/common'

@Injectable()
export class SystemService {
  getHealthStatus(): string {
    return 'Healthy!'
  }
}
