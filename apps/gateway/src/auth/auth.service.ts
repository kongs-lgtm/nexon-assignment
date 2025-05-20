import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  SignInRequest,
  SignInResponse,
  SignupRequest,
  SignupResponse,
} from '@app/contracts';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_CLIENT') private authClient: ClientProxy) {}

  signIn(input: SignInRequest): Observable<SignInResponse> {
    const { email, password } = input;
    return this.authClient
      .send(AUTH_PATTERNS.SIGN_IN, {
        email,
        password,
      })
      .pipe(
        catchError((err) => {
          throw new BadRequestException(err.message);
        }),
      );
  }

  signup(createUserDto: SignupRequest): Observable<SignupResponse> {
    return this.authClient.send(AUTH_PATTERNS.SIGN_UP, createUserDto);
  }
}
