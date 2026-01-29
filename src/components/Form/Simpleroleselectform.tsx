import { useState, useEffect } from "react";
import { User, Shield, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { useRoleAndPermissionQuery } from "@/hooks/useRolePermissionQueries";

interface SimpleRoleSelectFormProps {
    isOpen: boolean;
    user?: {
        id: string;
        fullName: string;
        email: string;
        role?: string;
    } | null;
    onClose: () => void;
    onSubmit?: (roleId: string) => void;
}

export default function SimpleRoleSelectForm({
    isOpen,
    user,
    onClose,
    onSubmit,
}: SimpleRoleSelectFormProps) {
    const [selectedRole, setSelectedRole] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: roles = [], isLoading, isError, error } = useRoleAndPermissionQuery();

    // Reset selected role when modal closes or user changes
    useEffect(() => {
        if (!isOpen) {
            setSelectedRole("");
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            toast.error("Please select a role");
            return;
        }

        setIsSubmitting(true);

        try {
            if (onSubmit) {
                await onSubmit(selectedRole);
            }
            // Don't show success toast here - let the parent handle it
            setSelectedRole("");
        } catch (error: unknown) {
            console.error("Error:", error);
            toast.error(getApiErrorMessage(error, "Failed to assign role"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedRole("");
        onClose();
    };

    if (!isOpen) return null;

    const selectedRoleName = roles.find(r => r.id === selectedRole)?.name || "";

    return (
        <form onSubmit={handleSubmit} className="p-6">
            {/* Heading Section */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Assign Role
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Update user's role permissions
                        </p>
                    </div>
                </div>

                {/* User Info Card */}
                {user && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <User className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 truncate">
                                    {user.fullName}
                                </p>
                                <p className="text-sm text-slate-600 truncate">
                                    {user.email}
                                </p>
                                {user.role && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs text-slate-500">Current Role:</span>
                                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
                                            {user.role}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <label
                    htmlFor="role-select"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    Select New Role <span className="text-red-500">*</span>
                </label>
                
                {isLoading ? (
                    <div className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                        <span className="text-sm text-slate-600">Loading available roles...</span>
                    </div>
                ) : isError ? (
                    <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600">
                            Failed to load roles. Please try again.
                        </span>
                    </div>
                ) : roles.length === 0 ? (
                    <div className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-amber-50 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-700">
                            No roles available. Please create a role first.
                        </span>
                    </div>
                ) : (
                    <>
                        <select
                            id="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 transition-all duration-200 hover:border-slate-400 cursor-pointer"
                            required
                            disabled={isSubmitting}
                        >
                            <option value="">Choose a role...</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {selectedRole && selectedRoleName && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>Selected: <span className="font-medium text-slate-900">{selectedRoleName}</span></span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading || isError || !selectedRole || roles.length === 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Assigning...</span>
                        </>
                    ) : (
                        <>
                            <Shield className="w-4 h-4" />
                            <span>Assign Role</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}