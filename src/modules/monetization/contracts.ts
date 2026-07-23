/**
 * Stable vocabulary for future billing policies. These are deliberately
 * provider-agnostic: no checkout or payment behavior belongs in the MVP shell.
 */
export const entitlementKeys = [
  "activeVacancies",
  "monthlyInvitations",
  "candidateSearch",
  "teamSeats",
  "vacancyPromotion",
  "candidateVerification",
] as const;

export type EntitlementKey = (typeof entitlementKeys)[number];

export type Entitlement =
  | { key: EntitlementKey; kind: "boolean"; enabled: boolean }
  | { key: EntitlementKey; kind: "quota"; limit: number; window: "month" | "lifetime" };

export type PlanDefinition = {
  code: string;
  holderType: "agency" | "candidate";
  entitlements: readonly Entitlement[];
};

export type FeatureFlag = {
  key: string;
  enabled: boolean;
  audience: "all" | "internal" | "allowlist";
};

export type PolicyContext = {
  holderId: string;
  holderType: "agency" | "candidate";
  now: Date;
};
