"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import ClientGreeting from "./client-greeting";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const trpc = useTRPC();
  const buildApp = useMutation(
    trpc.buildApp.mutationOptions({
      onSuccess: () => {
        toast.success("App build request sent successfully!");
      },
    })
  );

  return (
    <main className=" p-10 h-screen">
      <ClientGreeting />
      <div className="flex flex-col items-center justify-center space-y-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Build a todo list"
        />
        <Button
          onClick={() => {
            buildApp.mutate({
              text: inputValue,
            });
          }}
        >
          Build
        </Button>
      </div>
    </main>
  );
}
