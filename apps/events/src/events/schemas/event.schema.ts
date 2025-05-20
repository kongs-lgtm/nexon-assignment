import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EventStatus } from '@app/contracts';

@Schema({ versionKey: false })
export class Event {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  startAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ type: String, required: true, enum: EventStatus })
  status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
