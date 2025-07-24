import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye } from "lucide-react";
import { fragmentStore } from "../state";
import { FileTree } from "./file-tree";

const ProjectPreview = () => {
  const fragment = fragmentStore((store) => store.activeFragment);
  if (!fragment) {
    return <div>No active fragment selected.</div>;
  }
  return (
    <Tabs defaultValue="demo" className="flex flex-col h-full">
      <TabsList>
        <TabsTrigger value="demo">
          <Eye /> Demo
        </TabsTrigger>
        <TabsTrigger value="code">
          <Code /> Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="demo">
        <iframe
          src={fragment.sandboxUrl}
          className="w-full h-screen rounded-md border"
          sandbox="allow-scripts allow-same-origin"
        />
      </TabsContent>
      <TabsContent value="code">
        <FileTree files={fragment.files} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectPreview;
