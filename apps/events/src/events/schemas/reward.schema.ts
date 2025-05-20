import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RewardType } from '@app/contracts';

@Schema({ versionKey: false })
export class Reward {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'EventMission', required: true })
  missionId: Types.ObjectId;

  @Prop({ type: String, required: true, enum: RewardType })
  rewardType: RewardType;

  @Prop({ required: true })
  amount: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
