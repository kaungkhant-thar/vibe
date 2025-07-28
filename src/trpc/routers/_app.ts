import { createTRPCRouter } from "../init";

import { projectsRouter } from "@/modules/projects/procedures";
import { messagesRouter } from "@/modules/messages/procedures";
import { usagesRouter } from "@/modules/usage/procedure";
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  messages: messagesRouter,
  usages: usagesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
