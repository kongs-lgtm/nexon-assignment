import { Injectable } from '@nestjs/common';
import {
  ClaimRewardRequest,
  CreateEventRequest,
  CreateMissionRequest,
  RewardClaimStatus,
  runWithTransaction,
} from '@app/contracts';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection, Types } from 'mongoose';
import { Mission } from './schemas/mission.schema';
import { MissionRepository } from './repositories/mission.repository';
import { RewardRepository } from './repositories/reward.repository';
import { EventsRepository } from './repositories/events.repository';
import { RewardClaimRepository } from './repositories/reward-claim.repository';
import { Reward } from './schemas/reward.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly missionRepository: MissionRepository,
    private readonly rewardRepository: RewardRepository,
    private readonly claimedRewardRepository: RewardClaimRepository,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  private async createEvent(input: CreateEventRequest, session: ClientSession) {
    return this.eventsRepository.create(
      {
        title: input.title,
        startAt: input.startAt,
        endAt: input.endAt,
        status: input.status,
      },
      { session },
    );
  }

  private async createMissions(
    input: CreateMissionRequest[],
    eventId: Types.ObjectId,
    session: ClientSession,
  ) {
    const missions = input.map((m) => ({
      eventId,
      title: m.title,
    }));
    return this.missionRepository.createMany(missions, session);
  }

  private async createRewards(
    dto: CreateEventRequest,
    missions: Mission[],
    session: ClientSession,
  ) {
    const rewards = missions.flatMap((mission, idx) =>
      dto.missions[idx].rewards.map((reward) => ({
        missionId: mission._id,
        rewardType: reward.rewardType,
        amount: reward.amount,
      })),
    );

    return this.rewardRepository.createMany(rewards, session);
  }

  async createEventWithDetail(input: CreateEventRequest) {
    return runWithTransaction(this.connection, async (session) => {
      const event = await this.createEvent(input, session);
      const missions = await this.createMissions(
        input.missions,
        event._id,
        session,
      );
      await this.createRewards(input, missions, session);
      return event;
    });
  }

  async getEvents() {
    return this.eventsRepository.findMany({}, { sort: { startAt: -1 } });
  }

  private async getEvent(id: Types.ObjectId) {
    const event = await this.eventsRepository.findOne({ _id: id });
    if (!event) {
      throw new RpcException('존재하지 않는 이벤트입니다.');
    }
    return event;
  }

  private async getMissionsWithRewards(eventId: Types.ObjectId) {
    const missions = await this.missionRepository.findMany({ eventId });

    if (missions.length === 0) return [];

    const missionIds = missions.map((m) => m._id);
    const rewards = await this.rewardRepository.find({
      missionId: { $in: missionIds },
    });

    return missions.map((mission) => ({
      ...mission,
      rewards: rewards.filter(
        (r) => r.missionId.toString() === mission._id.toString(),
      ),
    }));
  }

  async getEventById(eventId: string) {
    const id = new Types.ObjectId(eventId);

    const event = await this.getEvent(id);
    const missions = await this.getMissionsWithRewards(id);

    return {
      ...event,
      missions,
    };
  }

  private async checkUserCompletedMission(
    userId: string,
    missionId: string,
    rewardId: string,
    session: ClientSession,
  ): Promise<boolean> {
    const hasCompleted = true; // TODO: missionId 를 가지고 유저가 해당 미션을 완수했는 지 검증
    if (!hasCompleted) {
      await this.saveClaim(
        userId,
        rewardId,
        RewardClaimStatus.Rejected,
        session,
      );
      throw new RpcException('미션을 완수하지 못해서 보상을 받을 수 없습니다.');
    }
    return true;
  }

  private async grantReward(userId: string, reward: Reward) {
    // TODO: 보상 타입 (rewardType) 에 따라 쿠폰 발급, 포인트 지급 등을 처리
  }

  private async saveClaim(
    userId: string,
    rewardId: string,
    status: RewardClaimStatus,
    session: ClientSession,
  ) {
    return this.claimedRewardRepository.create(
      {
        userId: new Types.ObjectId(userId),
        rewardId: new Types.ObjectId(rewardId),
        status,
        requestedAt: new Date(),
      },
      { session },
    );
  }

  async claimReward(input: ClaimRewardRequest) {
    const { userId, rewardId } = input;

    return runWithTransaction(this.connection, async (session) => {
      const reward = await this.rewardRepository.findOne({
        _id: new Types.ObjectId(rewardId),
      });
      if (!reward) {
        throw new RpcException('존재하지 않는 보상입니다.');
      }

      await this.checkUserCompletedMission(
        userId,
        reward.missionId.toString(),
        rewardId,
        session,
      );

      const alreadyClaimed = await this.claimedRewardRepository.findOne({
        userId: new Types.ObjectId(userId),
        rewardId: new Types.ObjectId(rewardId),
        status: RewardClaimStatus.Approved,
      });
      if (alreadyClaimed) {
        throw new RpcException(
          '이미 신청한 보상입니다. 중복 신청할 수 없습니다.',
        );
      }

      const claimed = await this.saveClaim(
        userId,
        rewardId,
        RewardClaimStatus.Approved,
        session,
      );

      await this.grantReward(userId, reward);
      return claimed;
    });
  }

  async getMyRewardClaims(userId: string) {
    return await this.claimedRewardRepository.findMany(
      {
        userId: new Types.ObjectId(userId),
      },
      {
        sort: { requestedAt: -1 },
      },
    );
  }

  async getUserClaims() {
    return await this.claimedRewardRepository.findMany(
      {},
      {
        sort: { requestedAt: -1 },
      },
    );
  }
}
