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
        console.log({ res });
        toast.success("Project created.");
        router.push(`/projects/${res.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create project: ${error.message}`);
      },
    })
  );

  const handleSubmit = async () => {
    await createProject.mutateAsync({ value: inputValue });
  };
  return (
    <main className=" p-10 h-screen">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Build a todo list"
        />
        <Button onClick={handleSubmit}>Build</Button>
      </div>
    </main>
  );
}
