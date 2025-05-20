import { Injectable } from '@nestjs/common';
import { SignupRequest, SignupResponse } from '@app/contracts';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(email: string) {
    return await this.usersRepository.findOne({ email });
  }

  async signup(input: SignupRequest): Promise<SignupResponse> {
    const user = await this.usersRepository.create({
      ...input,
      password: await bcrypt.hash(input.password, 10),
    });
    return {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }
}
