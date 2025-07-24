import ProjectDetails from "@/modules/projects/ui/project-details";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
const ProjectPage = async ({ params }: Props) => {
  const { id } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId: id })
  );
  void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({ id }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetails projectId={id} />
    </HydrationBoundary>
  );
};

export default ProjectPage;
