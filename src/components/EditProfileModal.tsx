import { useEffect, useState } from "react";
import { FaUser, FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { usePatchUserMutation } from "../query/patch/usePatchUserMutation";

export type EditableUser = {
    id?: string | null,
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

export default function EditProfileModal({ initialValues, onClose, onSubmit }: EditProfileModalProps) {
    const [values, setValues] = useState<EditableUser>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { mutate } = usePatchUserMutation()

    useEffect(() => {
        setValues({
            id: initialValues.id ?? "",
            firstName: initialValues.firstName ?? "",
            lastName: initialValues.lastName ?? "",
            middleName: initialValues.middleName ?? "",
            username: initialValues.username ?? "",
            email: initialValues.email ?? "",
            phoneNumber: initialValues.phoneNumber ?? "",
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        if (!isValid) return;

        const PatchUserProps = {
            firstName: values.firstName ?? "",
            lastName: values.lastName ?? "",
            middleName: values.middleName ?? "",
            username: values.username ?? "",
            email: values.email ?? "",
            phoneNumber: values.phoneNumber ?? "",
            position: values.position ?? ""
        }
        try {
            mutate({ id: values.id ?? "", formData: PatchUserProps }, {
                onSuccess: () => {
                    onSubmit?.(values);
                    setIsSubmitting(true);
                    setSuccessMessage("Profile updated.");
                    setTimeout(onClose, 900);
                },
                onError: (err) => {
                    const message = err instanceof Error ? err.message : "Failed to update profile.";
                    setErrorMessage(message);
                }
            })
        } catch (err) {
            console.log(err)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/60 bg-white/80 backdrop-blur p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Profile</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">First Name</label>
                        <div className="mt-1 relative">
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-300 bg-white/90 px-3 py-2 pr-9 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={values.firstName ?? ""}
                                onChange={(e) => update("firstName", e.target.value)}
                                placeholder="Your firstname"
                                required
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-2 inline-flex items-center text-slate-400"><FaUser /></span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Last Name</label>
                        <div className="mt-1 relative">
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-300 bg-white/90 px-3 py-2 pr-9 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={values.lastName ?? ""}
                                onChange={(e) => update("lastName", e.target.value)}
                                placeholder="Your lastname"
                                required
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-2 inline-flex items-center text-slate-400"><FaUser /></span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Middle Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={values.middleName ?? ""}
                            onChange={(e) => update("middleName", e.target.value)}
                            placeholder="Your middle name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Username</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={values.username ?? ""}
                            onChange={(e) => update("username", e.target.value)}
                            placeholder="Your username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <div className="mt-1 relative">
                            <input
                                type="email"
                                className="w-full rounded-lg border border-slate-300 bg-white/90 px-3 py-2 pr-9 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={values.email ?? ""}
                                onChange={(e) => update("email", e.target.value)}
                                placeholder="Your email"
                                required
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-2 inline-flex items-center text-slate-400"><MdOutlineEmail /></span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <div className="mt-1 relative">
                            <input
                                type="tel"
                                className="w-full rounded-lg border border-slate-300 bg-white/90 px-3 py-2 pr-9 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={values.phoneNumber ?? ""}
                                onChange={(e) => update("phoneNumber", e.target.value)}
                                maxLength={10}
                                placeholder="09XX XXX XXXX"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-2 inline-flex items-center text-slate-400"><FaPhone /></span>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="md:col-span-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="md:col-span-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                            {successMessage}
                        </div>
                    )}

                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
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
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


