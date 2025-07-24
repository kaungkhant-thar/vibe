import { inngest } from "./client";
import { Sandbox } from "e2b";

import {
  createAgent,
  createNetwork,
  createTool,
  openai,
} from "@inngest/agent-kit";
import {
  getSandbox,
  lastAssistantTextMessageContent,
  prettyPrintLastAssistantMessage,
} from "./utils";
import { PROMPT } from "@/lib/promot";
import { z } from "zod";
import prisma from "@/lib/prisma";

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
      system: PROMPT,

      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        // Terminal tool to run commands in the sandbox
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }) => {
            console.log("terminal < ", command);
            const buffers = { stdout: "", stderr: "" };

            try {
              const sandbox = await getSandbox(sandboxId);
              const result = await sandbox.commands.run(command, {
                onStdout: (data) => {
                  buffers.stdout += data;
                },
                onStderr: (data) => {
                  buffers.stderr += data;
                },
              });
              console.log("terminal > ", result.stdout);
              return result.stdout;
            } catch (e) {
              console.error(
                `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
              );
              return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
            }
          },
        }),
        // createOrUpdateFiles tool to write files in the sandbox
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            console.log(
              "createOrUpdateFiles <",
              files.map((f) => f.path)
            );
            const newFiles = await step?.run(
              "create-or-update-files",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (e) {
                  console.error("Error creating or updating files:", e);
                  return `Error creating or updating files: ${e}`;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        // readFiles tool to read files from the sandbox
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",

          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("read-files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = await Promise.all(
                  files.map(async (file) => {
                    const content = await sandbox.files.read(file);
                    return { path: file, content };
                  })
                );
                return JSON.stringify(contents);
              } catch (error) {
                console.error("Error reading files:", error);
                return `Error reading files: ${error}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          prettyPrintLastAssistantMessage(result);

          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeWriterAgent],
      maxIter: 5,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return summary;
        }

        return codeWriterAgent;
      },
    });
    const result = await network.run(event.data.text);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-message", async () => {
      await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          projectId: event.data.projectId,
          fragment: {
            create: {
              files: result.state.data.files,
              sandboxUrl: sandboxUrl,
              title: "Fragment",
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
