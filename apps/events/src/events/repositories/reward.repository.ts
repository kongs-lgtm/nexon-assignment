import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/contracts';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Reward } from '../schemas/reward.schema';

@Injectable()
export class RewardRepository extends AbstractRepository<Reward> {
  protected readonly logger = new Logger(RewardRepository.name);

  constructor(
    @InjectModel(Reward.name) model: Model<Reward>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }
}
