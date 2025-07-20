"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const ClientGreeting = () => {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: "world" }));
  console.log({ greeting });
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
};

export default ClientGreeting;
