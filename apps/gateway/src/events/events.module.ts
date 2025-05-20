import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENTS_CLIENT',
        transport: Transport.TCP,
        options: { port: 3002, host: 'events' },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
