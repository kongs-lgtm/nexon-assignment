import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/contracts';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
