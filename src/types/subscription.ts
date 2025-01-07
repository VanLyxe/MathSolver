export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid';

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}