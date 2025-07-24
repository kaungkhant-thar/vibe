import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, ExternalLink, Eye, RefreshCwIcon } from "lucide-react";
import { fragmentStore } from "../state";
import { FileTree } from "./file-tree";
import { Button } from "@/components/ui/button";

const ProjectPreview = () => {
  const [refresh, setRefresh] = React.useState(0);
  const fragment = fragmentStore((store) => store.activeFragment);
  if (!fragment) {
    return (
      <div className="flex flex-col h-full p-4">
        No active fragment selected.
      </div>
    );
  }
  return (
    <Tabs defaultValue="demo" className="flex flex-col h-full p-4">
      <TabsList>
        <TabsTrigger value="demo">
          <Eye /> Demo
        </TabsTrigger>
        <TabsTrigger value="code">
          <Code /> Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="demo">
        <div className="flex items-center  mb-4 gap-2">
          <Button
            variant={"outline"}
            onClick={() => setRefresh((prev) => prev + 1)}
          >
            <RefreshCwIcon />
          </Button>
          <Button className="flex-1 justify-start" variant={"outline"}>
            {fragment.sandboxUrl}
          </Button>

          <Button
            className="ml-auto"
            variant={"outline"}
            onClick={() => window.open(fragment.sandboxUrl, "_blank")}
          >
            <ExternalLink />
          </Button>
        </div>
        <iframe
          key={refresh}
          src={fragment.sandboxUrl}
          className="w-full h-screen rounded-md border"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </TabsContent>
      <TabsContent value="code" className="flex-1 overflow-auto">
        <FileTree files={fragment.files} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectPreview;
