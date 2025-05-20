import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GatewayModule } from '../src/gateway.module';

describe('이벤트 / 보상 시스템 e2e', () => {
  let app: INestApplication;
  let operatorToken: string;
  let userToken: string;
  let auditorToken: string;
  let eventId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/auth').send({
      email: 'operator@test.com',
      password: '123456',
      role: 'Operator',
    });

    // Operator 권한 유저 생성
    const operatorLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'operator@test.com',
        password: '123456',
      });

    operatorToken = operatorLogin.body.access_token;

    // User 권한 유저 생성
    await request(app.getHttpServer()).post('/auth').send({
      email: 'user@test.com',
      password: '123456',
      role: 'User',
    });

    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: '123456',
      });

    userToken = userLogin.body.access_token;

    // Auditor 권한 유저 생성
    await request(app.getHttpServer()).post('/auth').send({
      email: 'auditor@test.com',
      password: '123456',
      role: 'Auditor',
    });

    const auditorLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'auditor@test.com',
        password: '123456',
      });

    auditorToken = auditorLogin.body.access_token;
  });

  it('Operator 권한의 유저는 이벤트를 등록할 수 있다', async () => {
    const eventRes = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({
        title: '여름 출석 이벤트',
        startAt: new Date('2025-07-01'),
        endAt: new Date('2025-07-31'),
        status: 'Scheduled',
        missions: [
          {
            title: '1일차 출석',
            rewards: [{ rewardType: 'Coupon', amount: 1 }],
          },
          {
            title: '10일 연속 출석',
            rewards: [
              { rewardType: 'Coupon', amount: 2 },
              { rewardType: 'XpBoost', amount: 30 },
            ],
          },
        ],
      })
      .expect(201);

    expect(eventRes.body).toHaveProperty('_id');
    expect(eventRes.body.title).toBe('여름 출석 이벤트');
    eventId = eventRes.body._id;
  });

  it('User 권한의 유저는 이벤트를 등록할 수 없다.', async () => {
    const res = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: '신규 출석 이벤트',
        startAt: new Date('2025-08-01'),
        endAt: new Date('2025-08-31'),
        status: 'Scheduled',
        missions: [
          {
            title: '20일 연속 출석',
            rewards: [{ rewardType: 'Coupon', amount: 1 }],
          },
        ],
      })
      .expect(403);

    expect(res.body.message).toBe('Forbidden resource');
  });

  it('유저는 보상을 신청할 수 있으며, 중복 신청은 불가하다.', async () => {
    // 특정 이벤트 상세 조회
    const eventDetailRes = await request(app.getHttpServer())
      .get(`/events/${eventId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    // 유저가 이벤트 UI 에서 첫 번째 미션의 첫 번째 보상 (ex. 300포인트) 을 신청 한다고 가정
    const event = eventDetailRes.body;
    const rewardId = event.missions[0].rewards[0]._id;
    await request(app.getHttpServer())
      .post(`/events/${eventId}/claim-reward`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        rewardId,
      })
      .expect(201);

    // 보상이 정상적으로 처리됐는 지 확인
    const claimsRes = await request(app.getHttpServer())
      .get('/events/me/reward-claims')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    const claims = claimsRes.body;
    const matched = claims.find(
      (c) => c.rewardId === rewardId && c.status === 'Approved',
    );
    expect(matched).toBeDefined();

    const duplicateRes = await request(app.getHttpServer())
      .post(`/events/${eventId}/claim-reward`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ rewardId })
      .expect(400);

    expect(duplicateRes.body.message).toBe(
      '이미 신청한 보상입니다. 중복 신청할 수 없습니다.',
    );
  });

  it('Auditor 권한의 유저는 모든 보상 신청 내역을 조회할 수 있다.', async () => {
    const res = await request(app.getHttpServer())
      .get('/events/user-claims')
      .set('Authorization', `Bearer ${auditorToken}`)
      .expect(200);

    expect(res.body).toBeDefined();
  });
});
