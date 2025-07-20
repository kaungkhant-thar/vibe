import { inngest } from "./client";
import { Sandbox } from "e2b";

import { createAgent, openai } from "@inngest/agent-kit";
import { getSandbox } from "./utils";

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
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-template");
      return sandbox.sandboxId;
    });
    const codeWriterAgent = createAgent({
      name: "Code writer",
      system:
        "You are an expert Next.js developer. You write simple and clean Next.js React code like Button and Input components.",
      model: openai({ model: "gpt-4o-mini" }),
    });

    const { output } = await codeWriterAgent.run(
      `Write the following code in Next.js React: ${event.data.text}`
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });
    return { output, sandboxUrl };
  }
);
