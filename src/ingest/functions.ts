import { OpenAi } from "inngest";
import { inngest } from "./client";

import { createAgent, openai } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
  },
  {
    event: "test/hello.world",
  },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.name}` };
  }
);

export const buildApp = inngest.createFunction(
  { id: "build-app" },
  { event: "vibe/build.app" },
  async ({ event, step }) => {
    const codeWriterAgent = createAgent({
      name: "Code writer",
      system:
        "You are an expert Next.js developer. You write simple and clean Next.js React code like Button and Input components.",
      model: openai({ model: "gpt-4o-mini" }),
    });

    const { output } = await codeWriterAgent.run(
      `Write the following code in Next.js React: ${event.data.text}`
    );

    return output;
  }
);
