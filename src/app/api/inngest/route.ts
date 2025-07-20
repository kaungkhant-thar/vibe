import { serve } from "inngest/next";
import { inngest } from "@/ingest/client";
import { buildApp, helloWorld } from "@/ingest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, buildApp],
});
