import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS, SignInRequest } from '@app/contracts';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.SIGN_IN)
  signIn(@Payload() input: SignInRequest) {
    return this.authService.signIn(input);
  }
}
