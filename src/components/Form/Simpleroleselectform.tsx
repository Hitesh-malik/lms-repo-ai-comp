import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const roles = [
    { id: "1", name: "Student" },
    { id: "2", name: "Developer" },
    { id: "3", name: "Support" },
    { id: "4", name: "VP Accounting" },
    { id: "5", name: "Database Administrator III" },
    { id: "6", name: "Assistant Manager" },
    { id: "7", name: "Quality Engineer" },
    { id: "8", name: "Senior Sales Associate" },
    { id: "9", name: "Automation Specialist I" },
    { id: "10", name: "Technical Writer" },
    { id: "11", name: "Software Test Engineer IV" },
];

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
            <div className="mb-6">
                <label
                    htmlFor="role-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Role <span className="text-red-500">*</span>
                </label>
                <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                >
                    <option value="">Select a role...</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Confirm Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Confirming..." : "Confirm"}
            </button>
        </form>

    );
}