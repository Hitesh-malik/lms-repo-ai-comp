'use client'
import DataTable, { Column } from "@/components/Common/DataTable";
import CommonModal from "@/components/Common/modal";
import { SearchBar } from "@/components/Common/searchBar";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

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
  const handleOpenDrawer = () => {
    setOpen(true);
  };
  const users: UserRow[] = [
    {
      id: "1",
      fullName: "Tim Jones",
      email: "timj1456@gmail.com",
      role: "Product Owner",
      status: "Active",
      joinedAt: "04 April 2025, 8:20 pm",
      avatarUrl: "https://readymadeui.com/team-1.webp",
    },
  ];

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
            className={`w-2 h-2 rounded-full ${row.status === "Active" ? "bg-green-600" : "bg-gray-400"
              }`}
          />
          {row.status}
        </span>
      ),
    },
    { key: "joinedAt", header: "Joined date", accessor: "joinedAt" },
  ];
  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 pt-10 flex flex-col gap-6 flex-wrap">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            Admin page role
          </h1>
          <SearchBar placeholder="Search Something..." onSearch={() => { }} />
          <NeumorphismButton name="Add User" icon={<FiPlus />} onClick={handleOpenDrawer} />
        </div>
        <DataTable<UserRow>
          title="Users"
          columns={columns}
          data={users}
          getRowId={(row) => row.id}
          onView={(row) => alert(`View: ${row.fullName}`)}
          onEdit={(row) => alert(`Edit: ${row.fullName}`)}
          onDelete={(row) => alert(`Delete: ${row.fullName}`)}
        />
      </div>
      <CommonModal isOpen={open} setIsOpen={setOpen}>
        <div className="flex flex-col gap-4"></div>
      </CommonModal>
    </main>
  );
}

const NeumorphismButton = ({ name, icon, onClick }: { name: string; icon?: React.ReactNode; onClick: () => void }) => {
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