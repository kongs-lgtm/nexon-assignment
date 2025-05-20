# Nexon Assignment

## Backend API

```
POST   /auth/login                # 로그인
POST   /auth                      # 회원가입

POST   /events                    # 이벤트 생성
GET    /events                    # 이벤트 목록 조회 
GET    /events/user-claims        # 모든 유저의 보상 요청 조회
GET    /events/:id                # 이벤트 상세 조회
POST   /events/:id/claim-reward   # 보상 요청
GET    /events/me/reward-claims   # 나의 보상 요청 목록 조회
```

## 기술 스택

- Nest.js, TypeScript, Supertest, MongoDB (Mongoose)

## 개발환경 세팅 및 실행

```
docker compose up --build
```

## 테스트 실행

```
docker compose -f docker-compose.test.yml up --build
```

- 먼저 전체 서버 환경이 구성된 후, `gateway-test` 컨테이너에서 E2E 테스트가 자동으로 수행됩니다.
- 테스트 코드는 apps/gateway/test/app.e2e-spec.ts 에 작성되어 있습니다.

## 구현 내용

### Schema

- event
    - 이벤트 정보 관리
- mission
    - 하나의 이벤트에 속한 미션을 정의
    - 한 이벤트에 여러 개의 미션이 존재할 수 있음
- reward
    - 미션 완료 시 제공되는 보상 정보 관리
    - 한 미션에 여러 개의 보상이 지급될 수 있음
- rewardClaim
    - 사용자가 요청한 보상 내역 관리

### Architecture Overview

- gateway
    - 모든 API 요청을 처리하는 API Gateway
    - JWT 토큰 검증
- auth
    - JWT 토큰 발급
    - gateway 와 TCP 소켓 통신
    - user 관련 CRUD 수행
- events
    - gateway 와 TCP 소켓 통신
    - 이벤트 및 보상 관련 CRUD 수행
  
