"use client";

import DataTable, { Column } from "@/components/Common/DataTable";
import CommonModal from "@/components/Common/modal";
import { SearchBar } from "@/components/Common/searchBar";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

import { useSubAdminsQuery } from "@/hooks/useSubAdminQueries";
import UserAuthForm from "@/components/Form/addUser";
import SimpleRoleSelectForm from "@/components/Form/Simpleroleselectform";
import { useAddSubAdminMutation } from "@/hooks/useSubAdminMutations";
import { useAssignRoleMutation } from "@/hooks/useRolePermissionMutations";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export default function AddUserPage() {
  const addSubAdminMutation = useAddSubAdminMutation();
  const assignRoleMutation = useAssignRoleMutation();
 
  const [open, setOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: subAdmins, isLoading, isError, error, refetch } = useSubAdminsQuery();

  const users: UserRow[] = useMemo(() => {
    if (!subAdmins) return [];

    return subAdmins.map((u: any) => ({
      id: String(u.id ?? u._id ?? u.userId ?? crypto.randomUUID()),
      fullName: u.name ?? u.fullName ?? "NA",
      email: u.email ?? u.username ?? "NA",
      role: u.role ?? "SUB_ADMIN",
      joinedAt: u.createdAt
        ? new Date(u.createdAt).toLocaleString()
        : "NA",
    }));
  }, [subAdmins]);

  const columns: Column<UserRow>[] = [
    {
      key: "fullName",
      header: "Full Name",
      accessor: (row) => (
        <div className="flex items-center w-max">
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
  ];

  const handleOpenDrawer = () => setOpen(true);

  const handleEditClick = (row: UserRow) => {
    setSelectedUserId(row.id);
    setRoleModalOpen(true);
  };

  const handleRoleAssign = async (roleId: string) => {
    if (!selectedUserId) {
      toast.error("No user selected");
      return;
    }

    try {
      await assignRoleMutation.mutateAsync({
        user_id: selectedUserId,
        role_id: roleId,
      });
      
      toast.success("Role assigned successfully!");
      setRoleModalOpen(false);
      setSelectedUserId(null);
      refetch(); // Refresh the user list
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || error?.message || "Failed to assign role");
    }
  };

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

        {!isLoading && !isError && (
          <DataTable<UserRow>
            title="Users"
            columns={columns}
            data={users}
            getRowId={(row) => row.id}
            onEdit={handleEditClick}
            onDelete={(row) => alert(`Delete: ${row.fullName}`)}
          />
        )}
      </div>

      {/* Add User Modal */}
      <CommonModal isOpen={open} setIsOpen={setOpen}>
         <UserAuthForm
          onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
              const result = await addSubAdminMutation.mutateAsync({
                username: values.email,
                password: values.password,
                name: values.username,
              });

              if (result.success) {
                toast.success(result.detail || "User created successfully");
                setOpen(false);
                resetForm();
                refetch();
              }
            } catch (error: any) {
              setErrors({
                email: error?.response?.data?.detail || error?.message || "Failed to create user",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </CommonModal>

      {/* Role Assignment Modal */}
      <CommonModal isOpen={roleModalOpen} setIsOpen={setRoleModalOpen}>
        <SimpleRoleSelectForm
          isOpen={roleModalOpen}
          onClose={() => {
            setRoleModalOpen(false);
            setSelectedUserId(null);
          }}
          onSubmit={handleRoleAssign}
        />
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
