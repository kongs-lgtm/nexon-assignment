export enum Role {
  User = 'User',
  Operator = 'Operator',
  Auditor = 'Auditor',
  Admin = 'Admin',
}

export enum RewardClaimStatus {
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum EventStatus {
  Ongoing = 'Ongoing',
  Closed = 'Closed',
  Scheduled = 'Scheduled',
}

export enum RewardType {
  Points = 'Points',
  Coupon = 'Coupon',
  XpBoost = 'XpBoost', // 경험치 부스트
}
