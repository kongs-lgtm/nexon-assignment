import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      }),
      envFilePath: './apps/gateway/.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: { port: 3001, host: 'auth' },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
