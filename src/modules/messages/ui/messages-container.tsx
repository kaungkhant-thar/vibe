"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MessageCard from "./message-card";
import MessageForm from "./message-form";
import Loading from "@/components/ui/loading";
import { fragmentStore } from "@/modules/projects/state";

type Props = {
  projectId: string;
};
const MessagesContainer = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const setActiveFragment = fragmentStore((store) => store.setActiveFragment);
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      {
        refetchInterval: 10000,
      }
    )
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (lastMessage.role === "ASSISTANT") {
      setActiveFragment(lastMessage.fragment);
    }
  }, [lastMessage, setActiveFragment]);
  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="pt-2 pr-2">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
          {lastMessage && lastMessage.role === "USER" && (
            <Loading label="AI is thinking" />
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="mt-auto">
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessagesContainer;
