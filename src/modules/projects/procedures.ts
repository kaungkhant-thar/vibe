import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { inngest } from "@/ingest/client";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      });
      return project;
    }),
  create: protectedProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          userId: ctx.auth.userId,
        },
      });
      await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          projectId: response.id,
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "vibe/build.app",
        data: {
          text: input.value,
          projectId: response.id,
        },
      });

      return response;
    }),
});
