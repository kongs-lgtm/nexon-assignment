import {
  IsArray,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMissionRequest } from './create-mission.request';
import { EventStatus } from '../../enum/enum';

export class CreateEventRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @IsDate()
  @Type(() => Date)
  endAt: Date;

  @IsIn(Object.values(EventStatus))
  status: EventStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMissionRequest)
  missions: CreateMissionRequest[];
}
