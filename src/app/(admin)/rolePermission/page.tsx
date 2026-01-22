"use client";

import DataTable, { Column } from "@/components/Common/DataTable";
import CommonModal from "@/components/Common/modal";
import { SearchBar } from "@/components/Common/searchBar";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

import { useRoleAndPermissionQuery } from "@/hooks/useRolePermissionQueries"; // ✅ new
import { Role } from "@/services/roleAndPermissionApi";

export default function AddUserPage() {
  const [open, setOpen] = useState(false);

  const { data: roleAndPermission, isLoading, isError, error, refetch } = useRoleAndPermissionQuery();
  const roleAndPermissionData: Role[] = useMemo(() => {
    if (!roleAndPermission) return [];    
    return roleAndPermission?.map((r: Role) => ({
      id: String(r.id),
        name: r.name ?? "NA",
    }));
  }, [roleAndPermission]);

  const columns: Column<Role>[] = [
    {
      key: "name",
      header: "Name",
      accessor: (row) => (
        <div className="flex items-center w-max">
          <div className="ml-2">
            <p className="text-sm font-medium text-slate-900">{row.name}</p>
          </div>
        </div>
      ),
    },
  ];

  const handleOpenDrawer = () => setOpen(true);

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 pt-10 flex flex-col gap-6 flex-wrap">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            Role & Permission
          </h1>

          <SearchBar placeholder="Search Something..." onSearch={() => { }} />
          <NeumorphismButton name="Add Role" icon={<FiPlus />} onClick={handleOpenDrawer} />
        </div>

        {isLoading && <p className="text-slate-600">Loading role & permission...</p>}

        {isError && (
          <div className="border border-red-200 bg-red-50 p-3 rounded-lg text-red-700">
            <p>Failed to load role & permission.</p>
            <p className="text-sm opacity-80">{(error as any)?.message}</p>
            <button
              className="mt-2 underline"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <DataTable<Role>
            title="Role"
            columns={columns}
            data={roleAndPermissionData}
            getRowId={(row) => row.id}
            onEdit={(row) => alert(`Edit: ${row.name}`)}
            onDelete={(row) => alert(`Delete: ${row.name}`)}
          />
        )}
      </div>

      <CommonModal isOpen={open} setIsOpen={setOpen}>
        <div className="flex flex-col gap-4">
        </div>
      </CommonModal>
    </main>
  );
}

const NeumorphismButton = ({
  name,
  icon,
  onClick,
}: {
  name: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="px-4 py-2 rounded-full flex items-center gap-2 text-slate-500 border border-black-700 shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)] transition-all hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)] hover:text-blue-500"
      onClick={onClick}
    >
      {icon}
      <span>{name}</span>
    </button>
  );
};
