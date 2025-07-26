"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const trpc = useTRPC();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (res) => {
        toast.success("Project created.");
        router.push(`/projects/${res.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create project: ${error.message}`);
      },
    })
  );

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      toast.error("Project name is required.");
      return;
    }
    await createProject.mutateAsync({ value: inputValue });
  };

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Build Your Next <span className="text-purple-500">Vibe</span> Code
          Project
        </h1>
        <p className="text-zinc-400 text-lg">
          Describe your idea and start coding instantly in your own sandboxed
          environment.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <Input
            className="w-full text-black placeholder:text-zinc-400 bg-white/90 rounded-xl shadow-md"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. Build a Todo List"
          />
          <Button
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 transition-all rounded-xl px-6 py-2 font-semibold"
            onClick={handleSubmit}
          >
            Build
          </Button>
        </div>
      </div>
    </main>
  );
}
