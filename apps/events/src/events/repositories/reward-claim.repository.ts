import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/contracts';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { RewardClaim } from '../schemas/reward-claim.schema';

@Injectable()
export class RewardClaimRepository extends AbstractRepository<RewardClaim> {
  protected readonly logger = new Logger(RewardClaimRepository.name);

  constructor(
    @InjectModel(RewardClaim.name) model: Model<RewardClaim>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }
}
