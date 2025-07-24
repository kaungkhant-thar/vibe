import React, { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react";

type FileNode = {
  type: "file" | "folder";
  name: string;
  children?: Record<string, FileNode>;
};

const TreeNode = ({
  node,
  path,
  selected,
  onSelect,
}: {
  node: FileNode;
  path: string;
  selected: string | null;
  onSelect: (path: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const isSelected = selected === path;

  if (node.type === "file") {
    return (
      <div
        onClick={() => onSelect(path)}
        className={`pl-6 py-1 cursor-pointer rounded hover:bg-zinc-300 ${
          isSelected ? "bg-zinc-300 font-medium" : ""
        }`}
      >
        <FileText className="inline-block mr-1 w-4 h-4" />
        {node.name}
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center cursor-pointer pl-2 hover:bg-zinc-200 rounded py-1"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronDown className="w-4 h-4 mr-1" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-1" />
        )}
        <Folder className="w-4 h-4 mr-1" />
        {node.name}
      </div>
      {open && (
        <div className="ml-4">
          {Object.entries(node.children!).map(([key, child]) => (
            <TreeNode
              key={key}
              node={child}
              path={`${path}/${child.name}`}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
