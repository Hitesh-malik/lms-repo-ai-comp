import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import PermissionTreeView from "../Common/Permissiontreeview";
import {
  useCreateRoleMutation,
  useUpdateRolePermissionMutation,
} from "@/hooks/useRolePermissionMutations";
import { usePermissionsQuery } from "@/hooks/usePermissionQueries";

// Validation schema
const roleValidationSchema = Yup.object({
  roleName: Yup.string()
    .required("Role name is required")
    .min(3, "Role name must be at least 3 characters")
    .max(50, "Role name must not exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s-_]+$/,
      "Role name can only contain letters, numbers, spaces, hyphens and underscores"
    ),
});

interface AddRoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { roleName: string; permissions: string[] }) => void;
}

export default function AddRoleForm({
  isOpen,
  onClose,
  onSubmit,
}: AddRoleFormProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );

  const createRoleMutation = useCreateRoleMutation();
  const updatePermissionMutation = useUpdateRolePermissionMutation();
  const { data: permissions = [] } = usePermissionsQuery();

  const handleFormSubmit = async (
    values: { roleName: string },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const permissionsArray = Array.from(selectedPermissions);

      if (permissionsArray.length === 0) {
        toast.error("Please select at least one permission");
        setSubmitting(false);
        return;
      }

      const roleName = values.roleName.trim();

      // Step 1: Create the role
      const createResult = await createRoleMutation.mutateAsync({
        name: roleName,
      });

      if (!createResult.role?.id) {
        throw new Error("Role creation failed: No role ID returned");
      }

      const roleId = createResult.role.id;

      // Step 2: Map selected permission IDs to permission objects
      // Filter out group IDs (they start with "group:") and map to API format
      const permissionObjects = permissionsArray
        .filter((id) => !id.startsWith("group:"))
        .map((permissionId) => {
          const permission = permissions.find((p) => p.id === permissionId);
          if (!permission) {
            throw new Error(`Permission not found for ID: ${permissionId}`);
          }
          return {
            permission: permission.permission,
            id: permission.id,
          };
        });

      // Step 3: Update role permissions
      await updatePermissionMutation.mutateAsync({
        name: roleName,
        id: roleId,
        permissions: permissionObjects,
      });

      // Success feedback
      toast.success("Role created and permissions assigned successfully!");

      // Call optional onSubmit callback if provided
      if (onSubmit) {
        await onSubmit({
          roleName,
          permissions: permissionsArray,
        });
      }

      // Reset form and close
      resetForm();
      setSelectedPermissions(new Set());
      onClose();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to create role";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPermissions(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Add New Role</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <Formik
            initialValues={{ roleName: "" }}
            validationSchema={roleValidationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="p-6 space-y-6">
                {/* Role Name Input */}
                <div>
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="roleName"
                    name="roleName"
                    placeholder="Enter role name (e.g., Content Manager)"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.roleName && touched.roleName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="roleName"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Permissions Tree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions <span className="text-red-500">*</span>
                  </label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <PermissionTreeView
                      selectedPermissions={selectedPermissions}
                      setSelectedPermissions={setSelectedPermissions}
                    />
                  </div>
                  {selectedPermissions.size === 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      Select at least one permission for this role
                    </p>
                  )}
                  {selectedPermissions.size > 0 && (
                    <p className="mt-2 text-sm text-blue-600">
                      {selectedPermissions.size} permission(s) selected
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      createRoleMutation.isPending ||
                      updatePermissionMutation.isPending
                    }
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ||
                    createRoleMutation.isPending ||
                    updatePermissionMutation.isPending
                      ? "Creating..."
                      : "Create Role"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}