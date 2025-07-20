import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ClientGreeting from "./client-greeting";

export default function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: "world" }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className=" p-10 h-screen">
        <ClientGreeting />
        <div className="flex gap-3 w-1/3">
          <Input placeholder="Build a todo list" />
          <Button>Build</Button>
        </div>
      </main>
    </HydrationBoundary>
  );
}
