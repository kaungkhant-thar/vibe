"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessagesContainer from "@/modules/messages/ui/messages-container";
import ProjectMenu from "./project-menu";
import ProjectPreview from "./project-preview";

type Props = {
  projectId: string;
};
const ProjectDetails = ({ projectId }: Props) => {
  return (
    <div className="h-screen p-5">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ProjectMenu projectId={projectId} />
          <MessagesContainer projectId={projectId} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <ProjectPreview />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectDetails;
