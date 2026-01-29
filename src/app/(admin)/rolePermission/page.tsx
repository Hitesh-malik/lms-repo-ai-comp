"use client";

import DataTable, { Column } from "@/components/Common/DataTable";
import CommonModal from "@/components/Common/modal";
import { SearchBar } from "@/components/Common/searchBar";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useRoleAndPermissionQuery } from "@/hooks/useRolePermissionQueries";
import { useDeleteRoleMutation } from "@/hooks/useRolePermissionMutations";
import { Role } from "@/services/roleAndPermissionApi";
import AddRoleForm from "@/components/Form/Addroleform";
import { SkeletonTable } from "@/components/ui/skeleton-table";

export default function AddUserPage() {
  const [open, setOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  const { data: roleAndPermission, isLoading, isError, error, refetch } = useRoleAndPermissionQuery();
  const deleteRoleMutation = useDeleteRoleMutation();
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

  const handleOpenDrawer = () => {
    setEditingRoleId(null);
    setOpen(true);
  };

  const handleEditClick = (row: Role) => {
    setEditingRoleId(row.id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingRoleId(null);
  };

  const handleDeleteClick = (row: Role) => {
    setRoleToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRoleMutation.mutateAsync([
        {
          name: roleToDelete.name,
          id: roleToDelete.id,
        },
      ]);
      toast.success("Role deleted successfully!");
      setDeleteConfirmOpen(false);
      setRoleToDelete(null);
      setDeleteConfirmInput("");
      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to delete role"
      );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setRoleToDelete(null);
    setDeleteConfirmInput("");
  };

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

        {isLoading && (
          <SkeletonTable
            title="Role"
            columnCount={1}
            rowCount={5}
            showActions
          />
        )}

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
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Add/Edit Role Modal */}
      <AddRoleForm
        isOpen={open}
        roleId={editingRoleId}
        onClose={handleCloseModal}
        onSubmit={() => {
          refetch();
        }}
      />

      {/* Delete confirmation pop-up */}
      <CommonModal
        isOpen={deleteConfirmOpen}
        setIsOpen={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) {
            setRoleToDelete(null);
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
                Delete role
              </h3>
              <p className="text-slate-600 mt-1">
                Are you sure that you wish to delete this role? This will permanently remove it and cannot be undone.
              </p>
            </div>
          </div>

          {/* Role being removed */}
          {roleToDelete && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
                Role to remove
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <Trash2 className="w-5 h-5 text-slate-600" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 break-words">
                  <p className="font-semibold text-slate-900">
                    {roleToDelete.name}
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    ID: {roleToDelete.id}
                  </p>
                </div>
              </div>
            </div>
          )}

          {roleToDelete && (
            <div>
              <label htmlFor="delete-role-confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
                Type <span className="font-semibold text-slate-900">{roleToDelete.name}</span> to confirm
              </label>
              <input
                id="delete-role-confirm"
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder={`Enter "${roleToDelete.name}"`}
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
              disabled={deleteRoleMutation.isPending}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteRoleMutation.isPending || deleteConfirmInput.trim() !== roleToDelete?.name}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
            >
              {deleteRoleMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" aria-hidden />
                  Delete role
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
