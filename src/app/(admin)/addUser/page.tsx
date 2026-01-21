"use client";

import DataTable, { Column } from "@/components/Common/DataTable";
import CommonModal from "@/components/Common/modal";
import { SearchBar } from "@/components/Common/searchBar";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

import { useSubAdminsQuery } from "@/hooks/useSubAdminQueries"; // ✅ new

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  joinedAt: string;
  avatarUrl?: string;
};

export default function AddUserPage() {
  const [open, setOpen] = useState(false);

  // ✅ API CALL
  const { data: subAdmins, isLoading, isError, error, refetch } = useSubAdminsQuery();

  // ✅ map backend data -> table rows (adjust fields based on your API response)
  const users: UserRow[] = useMemo(() => {
    if (!subAdmins) return [];

    return subAdmins.map((u: any) => ({
      id: String(u.id ?? u._id ?? u.userId ?? crypto.randomUUID()),
      fullName: u.name ?? u.fullName ?? "NA",
      email: u.email ?? u.username ?? "NA",
      role: u.role ?? "SUB_ADMIN",
      status: (u.status ?? u.isActive ?? true) ? "Active" : "Inactive",
      joinedAt: u.createdAt
        ? new Date(u.createdAt).toLocaleString()
        : "NA",
      avatarUrl: u.avatarUrl ?? u.profilePic ?? undefined,
    }));
  }, [subAdmins]);

  const columns: Column<UserRow>[] = [
    {
      key: "fullName",
      header: "Full Name",
      accessor: (row) => (
        <div className="flex items-center w-max">
          <img
            src={row.avatarUrl || "https://via.placeholder.com/36"}
            alt={row.fullName}
            className="w-9 h-9 rounded-full shrink-0"
          />
          <div className="ml-2">
            <p className="text-sm font-medium text-slate-900">{row.fullName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      accessor: (row) => (
        <a href={`mailto:${row.email}`} className="underline text-slate-700">
          {row.email}
        </a>
      ),
    },
    { key: "role", header: "Role", accessor: "role" },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span className="inline-flex items-center border border-gray-200 gap-2 px-2 py-1 rounded-lg">
          <span
            className={`w-2 h-2 rounded-full ${
              row.status === "Active" ? "bg-green-600" : "bg-gray-400"
            }`}
          />
          {row.status}
        </span>
      ),
    },
    { key: "joinedAt", header: "Joined date", accessor: "joinedAt" },
  ];

  const handleOpenDrawer = () => setOpen(true);

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 pt-10 flex flex-col gap-6 flex-wrap">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            Admin page role
          </h1>

          <SearchBar placeholder="Search Something..." onSearch={() => {}} />
          <NeumorphismButton name="Add User" icon={<FiPlus />} onClick={handleOpenDrawer} />
        </div>

        {/* ✅ Loading + Error UI */}
        {isLoading && <p className="text-slate-600">Loading sub admins...</p>}

        {isError && (
          <div className="border border-red-200 bg-red-50 p-3 rounded-lg text-red-700">
            <p>Failed to load sub admins.</p>
            <p className="text-sm opacity-80">{(error as any)?.message}</p>
            <button
              className="mt-2 underline"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        )}

        {/* ✅ Table */}
        {!isLoading && !isError && (
          <DataTable<UserRow>
            title="Users"
            columns={columns}
            data={users}
            getRowId={(row) => row.id}
            onView={(row) => alert(`View: ${row.fullName}`)}
            onEdit={(row) => alert(`Edit: ${row.fullName}`)}
            onDelete={(row) => alert(`Delete: ${row.fullName}`)}
          />
        )}
      </div>

      <CommonModal isOpen={open} setIsOpen={setOpen}>
        <div className="flex flex-col gap-4"></div>
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
