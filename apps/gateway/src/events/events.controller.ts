import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ClaimRewardPayload, CreateEventRequest, Role } from '@app/contracts';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IAuthorizedRequest } from '../interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.Operator, Role.Admin])
  @Post()
  createEvent(@Body() input: CreateEventRequest) {
    return this.eventsService.createEvent(input);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.Auditor, Role.Admin])
  @Get('/user-claims')
  getUserClaims() {
    return this.eventsService.getUserClaims();
  }

  @UseGuards(AuthGuard)
  @Get()
  getEvents() {
    return this.eventsService.getEvents();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/claim-reward')
  claimReward(
    @Request() req: IAuthorizedRequest,
    @Body() input: ClaimRewardPayload,
  ) {
    return this.eventsService.claimReward(req.user.userId, input);
  }

  @UseGuards(AuthGuard)
  @Get('/me/reward-claims')
  getMyRewardClaims(@Request() req: IAuthorizedRequest) {
    return this.eventsService.getMyRewardClaims(req.user.userId);
  }
}
