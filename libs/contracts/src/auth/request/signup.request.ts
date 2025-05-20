import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@app/contracts';

export class SignupRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(Object.values(Role))
  role: string;
}
