import React, { useEffect } from "react";
import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "../code-theme.css";

type Props = {
  filePath: string;
  code: string;
};

function getLanguageExtension(filePath: string): string {
  const extension = filePath.split(".")?.pop()?.toLowerCase() || "";
  return extension;
}
export const CodeViewer = ({ filePath, code }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const lang = getLanguageExtension(filePath);

  return (
    <div className="flex-1 h-full overflow-y-auto p-2">
      <h2 className="text-sm font-mono text-zinc-400 mb-2">{filePath}</h2>
      <pre className=" bg-transparent border-none rounded-none m-0 text-xs">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
};
