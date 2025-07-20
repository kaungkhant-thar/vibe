import { serve } from "inngest/next";
import { inngest } from "@/ingest/client";
import { helloWorld } from "@/ingest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});
