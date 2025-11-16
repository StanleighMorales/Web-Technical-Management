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
        <div className="flex fixed inset-0 justify-center items-center z-[60]">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 p-6 w-full max-w-2xl rounded-2xl border shadow-2xl border-white/60 bg-white/80 backdrop-blur">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit Profile</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">First Name</label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                className="py-2 px-3 pr-9 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                                value={values.firstName ?? ""}
                                onChange={(e) => update("firstName", e.target.value)}
                                placeholder="Your firstname"
                                required
                            />
                            <span className="inline-flex absolute inset-y-0 right-2 items-center pointer-events-none text-slate-400"><FaUser /></span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Last Name</label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                className="py-2 px-3 pr-9 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                                value={values.lastName ?? ""}
                                onChange={(e) => update("lastName", e.target.value)}
                                placeholder="Your lastname"
                                required
                            />
                            <span className="inline-flex absolute inset-y-0 right-2 items-center pointer-events-none text-slate-400"><FaUser /></span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Middle Name</label>
                        <input
                            type="text"
                            className="py-2 px-3 mt-1 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                            value={values.middleName ?? ""}
                            onChange={(e) => update("middleName", e.target.value)}
                            placeholder="Your middle name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Username</label>
                        <input
                            type="text"
                            className="py-2 px-3 mt-1 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                            value={values.username ?? ""}
                            onChange={(e) => update("username", e.target.value)}
                            placeholder="Your username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <div className="relative mt-1">
                            <input
                                type="email"
                                className="py-2 px-3 pr-9 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                                value={values.email ?? ""}
                                onChange={(e) => update("email", e.target.value)}
                                placeholder="Your email"
                                required
                            />
                            <span className="inline-flex absolute inset-y-0 right-2 items-center pointer-events-none text-slate-400"><MdOutlineEmail /></span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <div className="relative mt-1">
                            <input
                                type="tel"
                                className="py-2 px-3 pr-9 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                                value={values.phoneNumber ?? ""}
                                onChange={(e) => update("phoneNumber", e.target.value)}
                                maxLength={11}
                                placeholder="09XX XXX XXXX"
                            />
                            <span className="inline-flex absolute inset-y-0 right-2 items-center pointer-events-none text-slate-400"><FaPhone /></span>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="py-2 px-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 md:col-span-2">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="py-2 px-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200 md:col-span-2">
                            {successMessage}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-2 md:col-span-2">
                        <button
                            type="button"
                            className="py-2 px-4 text-sm font-medium bg-white rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="py-2 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

