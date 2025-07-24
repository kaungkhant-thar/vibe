import { inngest } from "@/ingest/client";
import prisma from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )

    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          fragment: true,
        },
      });

      return messages;
    }),
  create: baseProcedure
    .input(
      z.object({
        projectId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const message = await prisma.message.create({
        data: {
          content: input.content,
          role: "USER",
          type: "RESULT",
          projectId: input.projectId,
        },
      });

      await inngest.send({
        name: "vibe/build.app",
        data: {
          text: input.content,
          projectId: input.projectId,
        },
      });

      return message;
    }),
});
