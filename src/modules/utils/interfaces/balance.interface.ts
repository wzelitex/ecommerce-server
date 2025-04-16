export interface BalanceInterfaceRequest {
  userId: string;
  amount: number;
  activityType: string;
  date?: Date;
  description: string;
}
