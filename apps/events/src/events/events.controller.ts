import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events.service';
import {
  ClaimRewardRequest,
  CreateEventRequest,
  EVENTS_PATTERNS,
} from '@app/contracts';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern(EVENTS_PATTERNS.CREATE)
  createEvent(@Payload() input: CreateEventRequest) {
    return this.eventsService.createEventWithDetail(input);
  }

  @MessagePattern(EVENTS_PATTERNS.GET_EVENTS)
  getEvents() {
    return this.eventsService.getEvents();
  }

  @MessagePattern(EVENTS_PATTERNS.GET_EVENT_BY_ID)
  getEventById(@Payload() id: string) {
    return this.eventsService.getEventById(id);
  }

  @MessagePattern(EVENTS_PATTERNS.CLAIM_REWARD)
  claimReward(@Payload() input: ClaimRewardRequest) {
    return this.eventsService.claimReward(input);
  }

  @MessagePattern(EVENTS_PATTERNS.GET_MY_CLAIMS)
  getMyRewardClaims(@Payload() userId: string) {
    return this.eventsService.getMyRewardClaims(userId);
  }

  @MessagePattern(EVENTS_PATTERNS.GET_USER_CLAIMS)
  getUserClaims() {
    return this.eventsService.getUserClaims();
  }
}
