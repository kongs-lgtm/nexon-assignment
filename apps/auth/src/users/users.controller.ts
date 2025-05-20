import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { AUTH_PATTERNS, SignupRequest } from '@app/contracts';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(AUTH_PATTERNS.SIGN_UP)
  signup(@Payload() input: SignupRequest) {
    return this.usersService.signup(input);
  }
}
