import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRewardRequest } from './create-reward.request';

export class CreateMissionRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRewardRequest)
  rewards: CreateRewardRequest[];
}
