import { IsString } from 'class-validator';

export class ClaimRewardPayload {
  @IsString()
  rewardId: string;
}

export class ClaimRewardRequest extends ClaimRewardPayload {
  @IsString()
  userId: string;
}
