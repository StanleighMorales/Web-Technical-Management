import { useEffect, useState } from "react";
import { useUpdateUser } from "../hooks/userHooks";
import { showToast } from "./AppToast";
import {
    User,
    Mail,
    Phone,
    AtSign,
    Briefcase,
    CircleUserRound,
    BadgeCheck,
    X,
    Loader2,
} from "lucide-react";

export type EditableUser = {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    middleName?: string | null;
    username?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    position?: string | null;
};

type EditProfileModalProps = {
    initialValues: EditableUser;
    onClose: () => void;
    onSubmit?: (values: EditableUser) => Promise<void> | void;
};

const POSITIONS = ["Intern", "Full-Time", "Part-Time", "Head-Staff"];

export default function EditProfileModal({
    initialValues,
    onClose,
    onSubmit,
}: EditProfileModalProps) {
    const [values, setValues] = useState<EditableUser>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutate } = useUpdateUser();

    useEffect(() => {
        setValues({
            id: initialValues.id ?? "",
            firstName: initialValues.firstName ?? "",
            lastName: initialValues.lastName ?? "",
            middleName: initialValues.middleName ?? "",
            username: initialValues.username ?? "",
            email: initialValues.email ?? "",
            phoneNumber: initialValues.phoneNumber ?? "",
            position: initialValues.position ?? "",
        });
    }, [initialValues]);

    function update<K extends keyof EditableUser>(key: K, value: NonNullable<EditableUser[K]>) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    const isValid =
        (values.firstName?.trim()?.length ?? 0) > 0 &&
        (values.lastName?.trim()?.length ?? 0) > 0 &&
        (values.username?.trim()?.length ?? 0) > 0 &&
        (values.email?.includes("@") ?? false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isValid) return;
        setIsSubmitting(true);

        mutate(
            {
                id: values.id ?? "",
                data: {
                    firstName: values.firstName ?? "",
                    lastName: values.lastName ?? "",
                    middleName: values.middleName ?? "",
                    username: values.username ?? "",
                    email: values.email ?? "",
                    phoneNumber: values.phoneNumber ?? "",
                    position: values.position ?? "",
                },
            },
            {
                onSuccess: () => {
                    onSubmit?.(values);
                    showToast.success("Profile Updated", "User profile updated successfully.");
                    setTimeout(() => {
                        setIsSubmitting(false);
                        onClose();
                    }, 1500);
                },
                onError: (err) => {
                    const message = err instanceof Error ? err.message : "Failed to update profile.";
                    showToast.error("Update Failed", message);
                    setIsSubmitting(false);
                },
            },
        );
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <CircleUserRound className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Edit Profile</h3>
                            <p className="text-xs text-slate-400">Update your personal information</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                        {/* Personal Information */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-blue-500" />
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    Personal Information
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field
                                    label="First Name"
                                    icon={<User className="h-3.5 w-3.5" />}
                                    required
                                >
                                    <input
                                        type="text"
                                        value={values.firstName ?? ""}
                                        onChange={(e) => update("firstName", e.target.value)}
                                        placeholder="Enter first name"
                                        required
                                        className="input-base"
                                    />
                                </Field>

                                <Field
                                    label="Last Name"
                                    icon={<User className="h-3.5 w-3.5" />}
                                    required
                                >
                                    <input
                                        type="text"
                                        value={values.lastName ?? ""}
                                        onChange={(e) => update("lastName", e.target.value)}
                                        placeholder="Enter last name"
                                        required
                                        className="input-base"
                                    />
                                </Field>

                                <Field
                                    label="Middle Name"
                                    icon={<User className="h-3.5 w-3.5" />}
                                >
                                    <input
                                        type="text"
                                        value={values.middleName ?? ""}
                                        onChange={(e) => update("middleName", e.target.value)}
                                        placeholder="Enter middle name"
                                        className="input-base"
                                    />
                                </Field>

                                <Field
                                    label="Phone Number"
                                    icon={<Phone className="h-3.5 w-3.5" />}
                                >
                                    <input
                                        type="tel"
                                        value={values.phoneNumber ?? ""}
                                        onChange={(e) => update("phoneNumber", e.target.value)}
                                        placeholder="09XX XXX XXXX"
                                        maxLength={11}
                                        className="input-base"
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100" />

                        {/* Account Information */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="h-3.5 w-3.5 text-indigo-500" />
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    Account Information
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field
                                    label="Username"
                                    icon={<AtSign className="h-3.5 w-3.5" />}
                                    required
                                >
                                    <input
                                        type="text"
                                        value={values.username ?? ""}
                                        onChange={(e) => update("username", e.target.value)}
                                        placeholder="Enter username"
                                        required
                                        className="input-base"
                                    />
                                </Field>

                                <Field
                                    label="Email"
                                    icon={<Mail className="h-3.5 w-3.5" />}
                                    required
                                >
                                    <input
                                        type="email"
                                        value={values.email ?? ""}
                                        onChange={(e) => update("email", e.target.value)}
                                        placeholder="Enter email address"
                                        required
                                        className="input-base"
                                    />
                                </Field>

                                <Field
                                    label="Position"
                                    icon={<Briefcase className="h-3.5 w-3.5" />}
                                >
                                    <select
                                        value={values.position ?? ""}
                                        onChange={(e) => update("position", e.target.value)}
                                        className="input-base"
                                    >
                                        {POSITIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Sub-component ────────────────────────────────────────────────────────────

function Field({
    label,
    icon,
    required,
    children,
}: {
    label: string;
    icon: React.ReactNode;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <span className="text-slate-400">{icon}</span>
                {label}
                {required && <span className="text-rose-400">*</span>}
            </label>
            {children}
        </div>
    );
}
