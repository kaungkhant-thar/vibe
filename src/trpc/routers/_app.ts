import { createTRPCRouter } from "../init";

import { projectsRouter } from "@/modules/projects/procedures";
import { messagesRouter } from "@/modules/messages/procedures";
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  messages: messagesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
