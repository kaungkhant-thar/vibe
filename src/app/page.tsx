"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "./navbar";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const trpc = useTRPC();

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (res) => {
        toast.success("Project created!");
        router.push(`/projects/${res.id}`);
      },
      onError: (error) => {
        toast.error(`Creation failed: ${error.message}`);
      },
    })
  );

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      toast.error("Please describe your project");
      return;
    }
    await createProject.mutateAsync({ value: inputValue });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Build something <span className="text-primary">▶ VibeCode</span>
          </h1>
          <p className="text-xl text-gray-600">
            Create apps and websites by describing your idea
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Ask VibeCode to create...</p>
            <Input
              className="w-full rounded-lg border-2 border-gray-300 p-6 text-lg"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="a blog about how to succeed"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="flex justify-between items-center">
            <Button onClick={handleSubmit} disabled={createProject.isPending}>
              {createProject.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>

        {/* Workspace Section */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">My VibeCode Workspace</h2>
          <div className="flex justify-between items-center mb-4">
            <Input
              className="w-64 rounded-lg"
              placeholder="Search projects..."
            />
            <div className="flex space-x-4">
              <span className="text-gray-600">Last edited</span>
              <span className="text-gray-600">All creators</span>
              <Button variant="ghost" className="text-primary">
                View All
              </Button>
            </div>
          </div> */}
        {/* Project grid would go here */}
        {/* </div> */}
      </main>
    </div>
  );
}
