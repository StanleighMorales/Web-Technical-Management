import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { useResetUserPassword } from "../hooks/userHooks";
import type { TUpdatePassword } from "../@types/types";

type ChangePasswordModalProps = {
    id?: string;
    onClose: () => void;
};

export default function ChangePasswordModal({
    id,
    onClose,
}: ChangePasswordModalProps) {
    const updateUserPassword = useResetUserPassword();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const isValid = newPassword.length >= 8 && newPassword === confirmPassword;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        if (!isValid) return;

        try {
            const newUserPassword: TUpdatePassword = {
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            };

            setIsSubmitting(true);
            updateUserPassword.mutate(
                { id: id, data: newUserPassword },
                {
                    onSuccess: () => {
                        setSuccessMessage("Password updated successfully.");
                        setNewPassword("");
                        setConfirmPassword("");
                        setTimeout(onClose, 1000);
                    },
                    onError: (err) => {
                        console.log(err.message);
                        setIsSubmitting(false);
                    },
                },
            );
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to update password.";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white/80 backdrop-blur p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <FiLock />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Change Password
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            required
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            required
                            minLength={8}
                        />
                    </div>

                    {errorMessage && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                            {successMessage}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
