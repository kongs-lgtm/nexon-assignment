import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [AuthModule, EventsModule],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
