import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RewardClaimStatus } from '@app/contracts';

@Schema({ versionKey: false })
export class RewardClaim {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'EventReward', required: true })
  rewardId: Types.ObjectId;

  @Prop({ required: true, type: String, enum: RewardClaimStatus })
  status: RewardClaimStatus;

  @Prop()
  requestedAt: Date;
}

export const RewardClaimSchema = SchemaFactory.createForClass(RewardClaim);
