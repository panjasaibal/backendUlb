type SubscriptionPlan = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
type BillingCycle = "MONTHLY" | "YEARLY";
type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
type PaymentProvider = "STRIPE" | "RAZORPAY" | "PAYPAL" | null;

class Subscription {
  _id = "";
  plan: SubscriptionPlan = "FREE";
  billingCycle: BillingCycle | null = null;
  status: SubscriptionStatus = "ACTIVE";
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  autoRenew = false;
  paymentProvider: PaymentProvider = null;
  paymentCustomerId?: string;
  paymentSubscriptionId?: string;

  constructor(data: Partial<Subscription> = {}) {
    Object.assign(this, data);
  }
}

export { Subscription };
export type {
  BillingCycle,
  PaymentProvider,
  SubscriptionPlan,
  SubscriptionStatus,
};
