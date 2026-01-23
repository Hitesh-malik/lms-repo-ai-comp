import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

// Sample data structure matching the screenshot
const permissionsData = [
  {
    id: "vp-accounting",
    label: "VP Accounting",
    children: [
      { id: "1way", label: "1Way" },
      { id: "kdb", label: "KDB" },
      { id: "justice", label: "Justice" },
      { id: "utilization-review", label: "Utilization Review" },
      { id: "norton-utilities", label: "Norton Utilities" },
    ],
  },
  {
    id: "database-admin",
    label: "Database Administrator III",
    children: [
      { id: "tfs", label: "TFS" },
      { id: "overhaul", label: "Overhaul" },
      { id: "gtk", label: "GTK" },
      { id: "srp", label: "SRP" },
    ],
  },
  {
    id: "assistant-manager",
    label: "Assistant Manager",
    children: [],
  },
  {
    id: "quality-engineer",
    label: "Quality Engineer",
    children: [],
  },
  {
    id: "senior-sales",
    label: "Senior Sales Associate",
    children: [],
  },
  {
    id: "automation-specialist",
    label: "Automation Specialist I",
    children: [],
  },
  {
    id: "technical-writer",
    label: "Technical Writer",
    children: [],
  },
  {
    id: "software-test-engineer",
    label: "Software Test Engineer IV",
    children: [],
  },
];

export default function TreeView() {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );

  // Handle permission change for both parent and child items
  const handlePermissionChange = (
    itemId: string,
    childrenIds: string[],
    isChecked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      
      if (isChecked) {
        // Add the item and all its children
        newSet.add(itemId);
        childrenIds.forEach((id) => newSet.add(id));
      } else {
        // Remove the item and all its children
        newSet.delete(itemId);
        childrenIds.forEach((id) => newSet.delete(id));
      }
      
      return newSet;
    });
  };

  return (
    <div className="w-80 border rounded-lg p-4 bg-white shadow-sm">
      {permissionsData.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          selectedPermissions={selectedPermissions}
          onPermissionChange={handlePermissionChange}
        />
      ))}
    </div>
  );
}

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface TreeItemProps {
  node: TreeNode;
  selectedPermissions: Set<string>;
  onPermissionChange: (
    itemId: string,
    childrenIds: string[],
    isChecked: boolean
  ) => void;
  level?: number;
}

function TreeItem({
  node,
  selectedPermissions,
  onPermissionChange,
  level = 0,
}: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);
  
  const hasChildren = node.children && node.children.length > 0;
  const childrenIds = node.children?.map((child) => child.id) || [];

  // Calculate checkbox state for parent items
  const selectedChildrenCount = childrenIds.filter((id) =>
    selectedPermissions.has(id)
  ).length;
  
  const isChecked = hasChildren
    ? selectedChildrenCount === childrenIds.length && childrenIds.length > 0
    : selectedPermissions.has(node.id);
    
  const isIndeterminate = hasChildren
    ? selectedChildrenCount > 0 && selectedChildrenCount < childrenIds.length
    : false;

  // Update indeterminate state
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const checked = e.target.checked;
    onPermissionChange(node.id, childrenIds, checked);
  };

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-1.5 hover:bg-gray-50 rounded px-1 cursor-pointer"
        onClick={handleToggle}
      >
        {/* Toggle icon - only for parents with children */}
        <div className="w-4 flex items-center justify-center">
          {hasChildren ? (
            isOpen ? (
              <ChevronDown size={14} className="text-gray-600" />
            ) : (
              <ChevronRight size={14} className="text-gray-600" />
            )
          ) : (
            <span className="text-gray-400 text-xs">+</span>
          )}
        </div>

        {/* Checkbox */}
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 cursor-pointer"
        />

        {/* Label */}
        <span className="text-sm text-gray-700 flex-1">{node.label}</span>
      </div>

      {/* Children */}
      {isOpen && hasChildren && (
        <div className="ml-6">
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selectedPermissions={selectedPermissions}
              onPermissionChange={onPermissionChange}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}