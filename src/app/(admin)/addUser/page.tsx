"use client";

import DataTable, { Column } from "@/components/Common/DataTable";
import CommonModal from "@/components/Common/modal";
import { SearchBar } from "@/components/Common/searchBar";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Trash2, AlertTriangle, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";

import { useSubAdminsQuery } from "@/hooks/useSubAdminQueries";
import UserAuthForm from "@/components/Form/addUser";
import SimpleRoleSelectForm from "@/components/Form/Simpleroleselectform";
import {
  useAddSubAdminMutation,
  useDeleteSubAdminMutation,
} from "@/hooks/useSubAdminMutations";
import { useAssignRoleMutation } from "@/hooks/useRolePermissionMutations";
import { SkeletonTable } from "@/components/ui/skeleton-table";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AddUserPage() {
  const addSubAdminMutation = useAddSubAdminMutation();
  const assignRoleMutation = useAssignRoleMutation();
  const deleteSubAdminMutation = useDeleteSubAdminMutation();

  const [open, setOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  const {
    data: subAdmins,
    isLoading,
    isError,
    error,
    refetch,
  } = useSubAdminsQuery();

  const users: UserRow[] = useMemo(() => {
    if (!subAdmins) return [];

    return subAdmins.map((u: any) => ({
      id: String(u.id ?? u._id ?? u.userId ?? crypto.randomUUID()),
      fullName: u.name ?? u.fullName ?? "NA",
      email: u.email ?? u.username ?? "NA",
      role: u.role_name ?? u.role ?? "SUB_ADMIN",
      createdAt: u.created_at ? new Date(u.created_at).toLocaleString() : "NA",
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
    {
      key: "createdAt",
      header: "Created At",
      accessor: (row) => (
        <span className="text-slate-700">{row.createdAt}</span>
      ),
    },
  ];

  const handleOpenDrawer = () => setOpen(true);

  const handleEditClick = (row: UserRow) => {
    setSelectedUserId(row.id);
    setSelectedUser(row);
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
      setSelectedUser(null);
      refetch(); // Refresh the user list
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to assign role"));
    }
  };

  const handleDeleteClick = (row: UserRow) => {
    setUserToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteSubAdminMutation.mutateAsync(userToDelete.id);
      toast.success("User deleted successfully!");
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      setDeleteConfirmInput("");
      refetch();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to delete user"));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
    setDeleteConfirmInput("");
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 pt-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            Admin page role
          </h1>

          <SearchBar placeholder="Search Something..." onSearch={() => {}} />
          <NeumorphismButton
            name="Add User"
            icon={<FiPlus />}
            onClick={handleOpenDrawer}
          />
        </div>

        {/* ✅ Loading + Error UI */}
        {isLoading && (
          <SkeletonTable
            title="Users"
            columnCount={4}
            rowCount={5}
            showActions
          />
        )}

        {isError && (
          <div className="border border-red-200 bg-red-50 p-3 rounded-lg text-red-700">
            <p>Failed to load sub admins.</p>
            <p className="text-sm opacity-80">{(error as any)?.message}</p>
            <button className="mt-2 underline" onClick={() => refetch()}>
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
            onDelete={handleDeleteClick}
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
            } catch (error: unknown) {
              setErrors({
                email: getApiErrorMessage(error, "Failed to create user"),
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
          user={selectedUser}
          onClose={() => {
            setRoleModalOpen(false);
            setSelectedUserId(null);
            setSelectedUser(null);
          }}
          onSubmit={handleRoleAssign}
        />
      </CommonModal>

      {/* Delete confirmation pop-up */}
      <CommonModal
        isOpen={deleteConfirmOpen}
        setIsOpen={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) {
            setUserToDelete(null);
            setDeleteConfirmInput("");
          }
        }}
      >
        <div className="flex flex-col gap-5 py-2">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-red-100 ring-4 ring-red-50">
              <AlertTriangle className="w-7 h-7 text-red-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold text-slate-900">
                Delete sub-admin
              </h3>
              <p className="text-slate-600 mt-1">
                Are you sure that you wish to delete this module? This will
                permanently remove them from sub-admins and cannot be undone.
              </p>
            </div>
          </div>

          {/* User being removed — full name and email, no truncation */}
          {userToDelete && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
                User to remove
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <User className="w-5 h-5 text-slate-600" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 break-words">
                  <p className="font-semibold text-slate-900">
                    {userToDelete.fullName}
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5 break-all">
                    {userToDelete.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {userToDelete && (
            <div>
              <label
                htmlFor="delete-user-confirm"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Type{" "}
                <span className="font-semibold text-slate-900">
                  {userToDelete.email}
                </span>{" "}
                to confirm
              </label>
              <input
                id="delete-user-confirm"
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder={`Enter "${userToDelete.email}"`}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoComplete="off"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDeleteCancel}
              disabled={deleteSubAdminMutation.isPending}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={
                deleteSubAdminMutation.isPending ||
                deleteConfirmInput.trim() !== userToDelete?.email
              }
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
            >
              {deleteSubAdminMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" aria-hidden />
                  Delete user
                </>
              )}
            </button>
          </div>
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
