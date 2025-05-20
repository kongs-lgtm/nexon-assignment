import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ClaimRewardPayload,
  ClaimRewardRequest,
  CreateEventRequest,
  EVENTS_PATTERNS,
} from '@app/contracts';
import { catchError } from 'rxjs';

@Injectable()
export class EventsService {
  constructor(@Inject('EVENTS_CLIENT') private eventsClient: ClientProxy) {}

  createEvent(createEventDto: CreateEventRequest) {
    return this.eventsClient.send(EVENTS_PATTERNS.CREATE, createEventDto).pipe(
      catchError((err) => {
        throw new BadRequestException(err.message);
      }),
    );
  }

  getEvents() {
    return this.eventsClient.send(EVENTS_PATTERNS.GET_EVENTS, {});
  }

  getEventById(id: string) {
    return this.eventsClient.send(EVENTS_PATTERNS.GET_EVENT_BY_ID, id).pipe(
      catchError((err) => {
        throw new BadRequestException(err.message);
      }),
    );
  }

  claimReward(userId: string, input: ClaimRewardPayload) {
    const payload: ClaimRewardRequest = { ...input, userId };
    return this.eventsClient.send(EVENTS_PATTERNS.CLAIM_REWARD, payload).pipe(
      catchError((err) => {
        throw new BadRequestException(err.message);
      }),
    );
  }

  getMyRewardClaims(userId: string) {
    return this.eventsClient.send(EVENTS_PATTERNS.GET_MY_CLAIMS, userId);
  }

  getUserClaims() {
    return this.eventsClient.send(EVENTS_PATTERNS.GET_USER_CLAIMS, {});
  }
}
