import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

// This will be replaced with API data later
const mockPermissionsData = [
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

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface PermissionTreeViewProps {
  selectedPermissions: Set<string>;
  setSelectedPermissions: React.Dispatch<React.SetStateAction<Set<string>>>;
  permissionsData?: TreeNode[]; // Optional prop for API data
}

export default function PermissionTreeView({
  selectedPermissions,
  setSelectedPermissions,
  permissionsData = mockPermissionsData, // Use mock data by default
}: PermissionTreeViewProps) {
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
    <div className="space-y-1">
      {permissionsData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No permissions available
        </div>
      ) : (
        permissionsData.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            selectedPermissions={selectedPermissions}
            onPermissionChange={handlePermissionChange}
          />
        ))
      )}
    </div>
  );
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
        className="flex items-center gap-2 py-2 px-2 hover:bg-white rounded transition-colors cursor-pointer"
        onClick={handleToggle}
      >
        {/* Toggle icon - only for parents with children */}
        <div className="w-4 flex items-center justify-center flex-shrink-0">
          {hasChildren ? (
            isOpen ? (
              <ChevronDown size={16} className="text-gray-600" />
            ) : (
              <ChevronRight size={16} className="text-gray-600" />
            )
          ) : (
            <span className="text-gray-400 text-xs">•</span>
          )}
        </div>

        {/* Checkbox */}
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
        />

        {/* Label */}
        <span className="text-sm text-gray-700 flex-1">{node.label}</span>

        {/* Badge for children count */}
        {hasChildren && (
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
            {node.children?.length ?? 0}
          </span>
        )}
      </div>

      {/* Children */}
      {isOpen && hasChildren && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
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