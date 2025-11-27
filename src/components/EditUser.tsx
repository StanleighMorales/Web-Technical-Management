import React, { useState } from "react";
import type { TUpdateUsers } from "../types/types";
import { usePatchUserMutation } from "../query/patch/usePatchUserMutation";
import { FaUser, FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { SuccessAlert } from "./SuccessAlert";
import { ErrorAlert } from "./ErrorAlert";

type TPathUserTypes = Omit<TUpdateUsers, "id">;

type EditItemProps = {
    onClose(): void;
    user: TUpdateUsers;
};

type formData = {
    firstName: string;
    lastName: string;
    middleName: string;
    username: string;
    email: string;
    phoneNumber: string;
    position: string;
};

export default function EditUser({ user, onClose }: EditItemProps) {
    const [ShowSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
    const [ShowErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { mutate } = usePatchUserMutation();

    const [formData, setFormData] = useState<formData>({
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        position: user.position,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const PathUserProps: TPathUserTypes = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        position: formData.position,
    };

    const handleSubmit = (e: React.FormEvent) => {
        setIsSubmitting(true);
        e.preventDefault();
        mutate(
            { id: user.id, formData: PathUserProps },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    setShowSuccessAlert(true);
                    setSuccessMessage("User Profile updated.");
                    setTimeout(() => {
                        setShowSuccessAlert(false);
                        setSuccessMessage("");
                        onClose();
                    }, 3500);
                },
                onError: () => {
                    setIsSubmitting(false);
                    setShowErrorAlert(true)
                    setErrorMessage("You dont have permission to update this user");
                    setTimeout(() => {
                        setShowErrorAlert(false);
                        setErrorMessage("");
                        onClose();
                    }, 3500)
                },
            },
        );
    };

    return (
        <div className="flex fixed inset-0 justify-center items-center z-[60]">
            {ShowSuccessAlert && <SuccessAlert message={successMessage} />}
            {ShowErrorAlert && <ErrorAlert message={errorMessage} />}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 p-6 w-full max-w-2xl rounded-2xl border shadow-2xl border-white/60 bg-white/80 backdrop-blur">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    Edit Profile
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            First Name
                        </label>
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
                            <span className="inline-flex absolute inset-y-0 right-2 items-center pointer-events-none text-slate-400">
                                <FaUser />
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Last Name
                        </label>
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
                            <span className="inline-flex absolute inset-y-0 right-2 items-center pointer-events-none text-slate-400">
                                <FaUser />
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Middle Name
                        </label>
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
                        <label className="block text-sm font-medium text-slate-700">
                            Username
                        </label>
                        <input
                            type="text"
                            className="py-2 px-3 mt-1 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                            value={formData.username ?? ""}
                            name="username"
                            onChange={handleInputChange}
                            placeholder="Your username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="email"
                                className="py-2 px-3 pr-9 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                                value={formData.email ?? ""}
                                name="email"
                                onChange={handleInputChange}
                                placeholder="Your email"
                                required
                            />
                            <span className="inline-flex absolute inset-y-0 right-2 items-center pointer-events-none text-slate-400">
                                <MdOutlineEmail />
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Phone Number
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="tel"
                                className="py-2 px-3 pr-9 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                                value={formData.phoneNumber ?? ""}
                                name="phoneNumber"
                                onChange={handleInputChange}
                                maxLength={10}
                                placeholder="09XX XXX XXXX"
                            />
                            <span className="inline-flex absolute inset-y-0 right-2 items-center pointer-events-none text-slate-400">
                                <FaPhone />
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Position
                        </label>
                        <div className="relative mt-1">
                            <select
                                className="py-2 px-3 mt-1 w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none border-slate-300 bg-white/90 text-slate-900"
                                value={formData.position ?? ""}
                                name="position"
                                onChange={handleInputChange}
                                required
                            >
                                {["Intern", "Full-Time", "Part-Time", "Head-Staff"].map((opt, index) => (
                                    <option key={index} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
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
