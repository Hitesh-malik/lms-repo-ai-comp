import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronRight, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { usePermissionsQuery } from "@/hooks/usePermissionQueries";
import type { Permission } from "@/services/permissionApi";

export const GROUP_PREFIX = "group:";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

/** Build tree from flat API permissions. "permission:create" → group "permission" with child "create". */
export function buildPermissionTree(permissions: Permission[]): TreeNode[] {
  const topLevel: TreeNode[] = [];
  const groupMap = new Map<string, TreeNode[]>();

  for (const { id, permission } of permissions) {
    if (permission.includes(":")) {
      const colonIndex = permission.indexOf(":");
      const prefix = permission.slice(0, colonIndex);
      const suffix = permission.slice(colonIndex + 1);
      const existing = groupMap.get(prefix) ?? [];
      existing.push({ id, label: suffix, children: [] });
      groupMap.set(prefix, existing);
    } else {
      topLevel.push({ id, label: permission, children: [] });
    }
  }

  const groupNodes: TreeNode[] = Array.from(groupMap.entries()).map(
    ([label, children]) => ({
      id: `${GROUP_PREFIX}${label}`,
      label,
      children,
    })
  );

  return [...topLevel, ...groupNodes];
}

interface PermissionTreeViewProps {
  selectedPermissions: Set<string>;
  setSelectedPermissions: React.Dispatch<React.SetStateAction<Set<string>>>;
  permissionsData?: TreeNode[]; // Optional override; when omitted, data comes from API
}

export default function PermissionTreeView({
  selectedPermissions,
  setSelectedPermissions,
  permissionsData: permissionsDataProp,
}: PermissionTreeViewProps) {
  const { data: permissions = [], isLoading, isError, error } = usePermissionsQuery();

  const permissionsData = useMemo(() => {
    if (permissionsDataProp) return permissionsDataProp;
    return buildPermissionTree(permissions);
  }, [permissionsDataProp, permissions]);

  const handlePermissionChange = (
    itemId: string,
    childrenIds: string[],
    isChecked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      const isGroup = itemId.startsWith(GROUP_PREFIX);

      if (isChecked) {
        if (isGroup) {
          childrenIds.forEach((id) => newSet.add(id));
        } else {
          newSet.add(itemId);
          childrenIds.forEach((id) => newSet.add(id));
        }
      } else {
        if (isGroup) {
          childrenIds.forEach((id) => newSet.delete(id));
        } else {
          newSet.delete(itemId);
          childrenIds.forEach((id) => newSet.delete(id));
        }
      }

      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading permissions…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 py-6 px-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="font-medium">Failed to load permissions</p>
          <p className="text-sm mt-0.5">{(error as Error)?.message}</p>
        </div>
      </div>
    );
  }

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
  const childrenIds = node.children?.map((child) => child.id) ?? [];

  const selectedChildrenCount = childrenIds.filter((id) =>
    selectedPermissions.has(id)
  ).length;

  const isChecked = hasChildren
    ? selectedChildrenCount === childrenIds.length && childrenIds.length > 0
    : selectedPermissions.has(node.id);

  const isIndeterminate =
    hasChildren &&
    selectedChildrenCount > 0 &&
    selectedChildrenCount < childrenIds.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = Boolean(isIndeterminate);
    }
  }, [isIndeterminate]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onPermissionChange(node.id, childrenIds, e.target.checked);
  };

  const handleToggle = () => {
    if (hasChildren) setIsOpen((o) => !o);
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-2 px-2 hover:bg-white rounded transition-colors cursor-pointer"
        onClick={handleToggle}
      >
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

        <input
          ref={checkboxRef}
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
        />

        <span className="text-sm text-gray-700 flex-1">{node.label}</span>

        {hasChildren && (
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
            {node.children?.length ?? 0}
          </span>
        )}
      </div>

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
