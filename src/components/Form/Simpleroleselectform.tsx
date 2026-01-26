import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useRoleAndPermissionQuery } from "@/hooks/useRolePermissionQueries";

interface SimpleRoleSelectFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (roleId: string) => void;
}

export default function SimpleRoleSelectForm({
    isOpen,
    onClose,
    onSubmit,
}: SimpleRoleSelectFormProps) {
    const [selectedRole, setSelectedRole] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: roles = [], isLoading, isError } = useRoleAndPermissionQuery();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            toast.error("Please select a role");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Selected Role ID:", selectedRole);

            if (onSubmit) {
                await onSubmit(selectedRole);
            }

            toast.success("Role assigned successfully!");
            setSelectedRole("");
            onClose();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to assign role");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedRole("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <form onSubmit={handleSubmit} className="p-6">
            {/* Heading Section */}
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Assign Role
                </h2>
                <p className="text-sm text-slate-500">
                    Select a role to assign to this user
                </p>
            </div>

            <div className="mb-6">
                <label
                    htmlFor="role-select"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    Role <span className="text-red-500">*</span>
                </label>
                
                {isLoading ? (
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-slate-50 flex items-center justify-center">
                        <span className="text-sm text-slate-500">Loading roles...</span>
                    </div>
                ) : isError ? (
                    <div className="w-full px-4 py-2.5 border border-red-300 rounded-lg bg-red-50">
                        <span className="text-sm text-red-600">Failed to load roles</span>
                    </div>
                ) : (
                    <select
                        id="role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 transition-all duration-200 hover:border-slate-400"
                        required
                    >
                        <option value="">Select a role...</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Confirm Button */}
            <button
                type="submit"
                disabled={isSubmitting || isLoading || isError}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Assigning...
                    </span>
                ) : (
                    "Assign Role"
                )}
            </button>
        </form>
    );
}