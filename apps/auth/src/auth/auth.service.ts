import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { SignInRequest, SignInResponse } from '@app/contracts';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(input: SignInRequest): Promise<SignInResponse> {
    const { email, password } = input;
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new RpcException('존재하지 않는 사용자입니다.');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new RpcException('비밀번호가 일치하지 않습니다.');
    }
    const payload = { userId: user._id.toString(), role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
