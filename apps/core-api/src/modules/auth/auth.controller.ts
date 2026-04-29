import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInRequestDto: SignInRequestDto) {
    const { email, password } = signInRequestDto;
    return await this.authService.signInWithEmailAndPassword(email, password);
  }
}
