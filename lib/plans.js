export const PLANS = [
  {
    name: "Foundation",
    tagline: "For first-time holders",
    dailyRate: 1.8,
    termDays: 30,
    minDeposit: 500,
    maxDeposit: 4999,
    popular: false,
    features: [
      "Daily payout schedule",
      "Real-time portfolio tracking",
      "Standard email support",
      "Withdrawal requests within 24h",
    ],
  },
  {
    name: "Compounding",
    tagline: "For hands-on investors",
    dailyRate: 2.6,
    termDays: 90,
    minDeposit: 5000,
    maxDeposit: 24999,
    popular: true,
    features: [
      "Everything in Foundation",
      "Automatic daily compounding",
      "Dedicated account contact",
      "Priority withdrawal processing",
      "Quarterly allocation review",
    ],
  },
  {
    name: "Principal",
    tagline: "For institutional-grade capital",
    dailyRate: 3.4,
    termDays: 180,
    minDeposit: 25000,
    maxDeposit: null,
    popular: false,
    features: [
      "Everything in Compounding",
      "Segregated wallet allocation",
      "Direct line to portfolio team",
      "Custom holding structuring",
      "Early access to new asset pools",
    ],
  },
];

export function findPlan(name) {
  return PLANS.find((plan) => plan.name === name) || null;
}