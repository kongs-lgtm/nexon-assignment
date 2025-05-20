import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { DatabaseModule } from '@app/contracts';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Mission, MissionSchema } from './schemas/mission.schema';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { RewardClaim, RewardClaimSchema } from './schemas/reward-claim.schema';
import { EventsRepository } from './repositories/events.repository';
import { MissionRepository } from './repositories/mission.repository';
import { RewardRepository } from './repositories/reward.repository';
import { RewardClaimRepository } from './repositories/reward-claim.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/events/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Mission.name, schema: MissionSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardClaim.name, schema: RewardClaimSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    EventsRepository,
    MissionRepository,
    RewardRepository,
    RewardClaimRepository,
  ],
})
export class EventsModule {}
