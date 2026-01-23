"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File } from "lucide-react";
const treeData = [
  {
    id: "course-1",
    label: "React Course",
    children: [
      {
        id: "module-1",
        label: "Basics",
        children: [
          { id: "lesson-1", label: "JSX" },
          { id: "lesson-2", label: "Components" },
        ],
      },
    ],
  },
];

export default function TreeView() {
    return (
      <div className="w-64 border rounded-lg p-3 bg-white">
        {treeData.map(node => (
          <TreeItem key={node.id} node={node} />
        ))}
      </div>
    );
  }

function TreeItem({ node }: any) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children?.length > 0;

  return (
    <div className="ml-4">
      <div
        onClick={() => hasChildren && setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer py-1 hover:bg-gray-100 rounded px-2"
      >
        {hasChildren ? (
          open ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        ) : (
          <File size={14} />
        )}
        <span className="text-sm">{node.label}</span>
      </div>

      {open &&
        node.children?.map((child: any) => (
          <TreeItem key={child.id} node={child} />
        ))}
    </div>
  );
}

