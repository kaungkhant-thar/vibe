"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import MessageCard from "./message-card";

type Props = {
  projectId: string;
};
const MessagesContainer = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      {
        refetchInterval: 10000,
      }
    )
  );

  const lastMessage = messages[messages.length - 1];
  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="pt-2 pr-2">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>

        {lastMessage && lastMessage.role === "USER" && "AI is thinking"}
      </div>
    </div>
  );
};

export default MessagesContainer;
