import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class Mission {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  title: string; // 예: '미션 1: 50마리 몬스터 처치'
}

export const MissionSchema = SchemaFactory.createForClass(Mission);
