import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usagesRouter = createTRPCRouter({
  get: protectedProcedure.query(() => {
    const usage = getUsageStatus();
    return usage;
  }),
});
