import { JsonValue } from "@/generated/prisma/runtime/library";
import { useState } from "react";
import TreeNode from "./tree-node";
import { CodeViewer } from "./code-view";

type Props = {
  files: JsonValue;
};

type FileNode = {
  type: "file" | "folder";
  name: string;
  children?: Record<string, FileNode>;
};

const buildTree = (paths: string[]) => {
  const root: Record<string, FileNode> = {};

  for (const path of paths) {
    const parts = path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (!current[part]) {
        current[part] = {
          name: part,
          type: isFile ? "file" : "folder",
          ...(isFile ? {} : { children: {} }),
        };
      }

      if (!isFile) {
        current = current[part].children!;
      }
    }
  }

  return root;
};

function isFileMap(val: JsonValue): val is Record<string, string> {
  return (
    typeof val === "object" &&
    val !== null &&
    !Array.isArray(val) &&
    Object.values(val).every((v) => typeof v === "string")
  );
}
export const FileTree = ({ files }: Props) => {
  const fileList = Object.keys(files as Record<string, string>);
  const tree = buildTree(fileList);
  const [selected, setSelected] = useState<string>(() => fileList[0]);

  if (!isFileMap(files)) {
    return <div>Invalid file format</div>;
  }

  return (
    <div className="flex ">
      <div className="min-w-64  bg-zinc-100 border-r overflow-y-auto p-3 text-sm">
        {Object.entries(tree).map(([key, node]) => (
          <TreeNode
            key={key}
            node={node}
            path={node.name}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </div>

      {files && <CodeViewer code={files[selected]} filePath={selected} />}
    </div>
  );
};
