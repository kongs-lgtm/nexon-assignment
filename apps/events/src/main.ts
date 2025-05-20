import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EventsModule } from './events/events.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventsModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
        host: 'events',
      },
    },
  );
  await app.listen();
}

bootstrap();
