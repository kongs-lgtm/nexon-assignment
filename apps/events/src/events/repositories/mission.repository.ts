import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/contracts';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Mission } from '../schemas/mission.schema';

@Injectable()
export class MissionRepository extends AbstractRepository<Mission> {
  protected readonly logger = new Logger(MissionRepository.name);

  constructor(
    @InjectModel(Mission.name) model: Model<Mission>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }
}
