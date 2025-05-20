import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { RewardType } from '../../enum/enum';

export class CreateRewardRequest {
  @IsIn(Object.values(RewardType))
  rewardType: RewardType;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
