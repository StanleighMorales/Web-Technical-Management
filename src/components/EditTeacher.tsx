import React, { useState } from "react";
import { FaUser } from "react-icons/fa6";
import type { TUpdatedTeacher } from "../types/types";
import { usePatchTeacherMutation } from "../query/patch/usePatchTeacherMutation";

type EditTeacherProps = {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    department: string;
    onClose: () => void;
};

export const EditTeacher = ({
    id,
    firstName,
    middleName,
    lastName,
    department,
    onClose
}: EditTeacherProps) => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { mutate } = usePatchTeacherMutation();

    const [formData, setFormData] = useState<TUpdatedTeacher>({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        department: department
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updatedTeacher = {
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            department: formData.department
        }

        mutate({ id, formData: updatedTeacher }, {
            onSuccess: (data) => {
                setSuccessMessage(data.message);
                setTimeout(() => {
                    onClose();
                    setIsSubmitting(false)
                }, 3500);
            },
            onError: (error: unknown) => {
                setIsSubmitting(false)
                if (error instanceof Error) {
                    setErrorMessage(error.message)
                }
            }
        });
    };

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
                                value={formData.firstName ?? ""}
                                name="firstName"
                                onChange={handleInputChange}
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
                                value={formData.lastName ?? ""}
                                name="lastName"
                                onChange={handleInputChange}
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
                            value={formData.middleName ?? ""}
                            name="middleName"
                            onChange={handleInputChange}
                            placeholder="Your middle name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Department</label>
                        <input
                            type="text"
                            className="py-2 px-3 mt-1 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                            value={formData.department ?? ""}
                            name="department"
                            onChange={handleInputChange}
                            placeholder="Your middle name"
                        />
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
                            disabled={isSubmitting}
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
