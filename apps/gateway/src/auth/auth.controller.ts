import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequest, SignupRequest } from '@app/contracts';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() input: SignInRequest) {
    return this.authService.signIn(input);
  }

  @Post()
  signup(@Body() input: SignupRequest) {
    return this.authService.signup(input);
  }
}
