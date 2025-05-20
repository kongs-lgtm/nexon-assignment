import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Event } from '../schemas/event.schema';
import { AbstractRepository } from '@app/contracts';

@Injectable()
export class EventsRepository extends AbstractRepository<Event> {
  protected readonly logger = new Logger(EventsRepository.name);

  constructor(
    @InjectModel(Event.name) eventModel: Model<Event>,
    @InjectConnection() connection: Connection,
  ) {
    super(eventModel, connection);
  }
}
