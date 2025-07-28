import { RateLimiterPrisma } from "rate-limiter-flexible";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const FREE_POINTS = 5;
const PRO_POINTS = 50;
const DURATION = 30 * 24 * 60 * 60;
const GENERATION_COST = 1;
export async function getUsageTracker() {
  const { has } = await auth();

  const hasProPlan = has({ plan: "pro_plan" });
  const usage = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProPlan ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  });
  return usage;
}
export async function consumeCredit() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const usage = await getUsageTracker();

  const result = await usage.consume(userId, GENERATION_COST);
  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const usage = await getUsageTracker();

  const result = await usage.get(userId);
  return result;
}
