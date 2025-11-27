import React, { useState } from "react";
import type { TUserFormData } from "../types/types";
import CloseButton from "./CloseButton";
import { usePostUserMutation } from "../query/post/usePostUserMutation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { SuccessAlert } from "./SuccessAlert";

type AddUserProps = {
    onClose: () => void;
};

export const AddUsers = ({ onClose }: AddUserProps) => {
    const [firstnameError, setFirstnameError] = useState<string>("");
    const [lastnameError, setLastnameError] = useState<string>("");
    const [middlenameError, setMiddlenameError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [phoneNumberError, setPhoneNumberError] = useState<string>("");
    const [roleError, setRoleError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [formData, setFormData] = useState<TUserFormData>({
        firstName: "",
        lastName: "",
        middleName: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "firstName") return setFirstnameError("");
        if (name === "lastName") return setLastnameError("");
        if (name === "middleName") return setMiddlenameError("");
        if (name === "username") return setUsernameError("");
        if (name === "email") return setEmailError("");
        if (name === "phoneNumber") return setPhoneNumberError("");
        if (name === "password") return setPasswordError("");
        if (name === "confirmPassword") return setConfirmPasswordError("");
        if (name === "role") return setRoleError("");
    };

    const { mutate } = usePostUserMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("User data:", formData);

        let hasError = false;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (
            !formData.firstName &&
            !formData.lastName &&
            !formData.username &&
            !formData.email &&
            !formData.phoneNumber &&
            !formData.role &&
            !formData.password &&
            !formData.confirmPassword
        ) {
            setFirstnameError("First name is required");
            setLastnameError("Last name is required");
            setUsernameError("Username is required");
            setEmailError("Email is required");
            setPhoneNumberError("Phone number is required");
            setRoleError("Role is required");
            setPasswordError("Password is required");
            setConfirmPasswordError("Confirm password is required");
            hasError = true;
        }

        if (!formData.firstName) {
            setFirstnameError("First name is required");
            hasError = true;
        }

        if (!formData.lastName) {
            setLastnameError("Last name is required");
            hasError = true;
        }

        if (!formData.username) {
            setUsernameError("Username is required");
            hasError = true;
        }

        if (!formData.email) {
            setEmailError("Email is required");
            hasError = true;
        }

        if (!formData.phoneNumber) {
            setPhoneNumberError("Phone number is required");
            hasError = true;
        }

        if (!formData.role) {
            setRoleError("Role is required");
            hasError = true;
        }

        if (!passwordRegex.test(formData.password)) {
            setPasswordError("❌ Password must include:\n uppercase, lowercase, number, special character and be at least 8 characters long.");
        }

        if (!formData.password) {
            setPasswordError("Password is required");
            hasError = true;
        }

        if (!formData.confirmPassword) {
            setConfirmPasswordError("Confirm password is required");
            hasError = true;
        }

        if (formData.password !== formData.confirmPassword) {
            setConfirmPasswordError("Password does not match");
            hasError = true;
        }

        if (hasError) return;

        mutate(formData, {
            onSuccess: () => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    onClose();
                }, 1000);
                setFormData({
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    username: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    confirmPassword: "",
                    role: "",
                });
            },
            onError: (error) => {
                console.log(error)
            }
        });
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-gray-900/60 overflow-y-auto py-10 flex justify-center items-start">
                {showAlert && <SuccessAlert message={"User Created Successfully"} />}

                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl relative animate-fadeInUp">
                    <button
                        className="absolute top-4 right-4 text-2xl text-[#64748b] hover:text-[#2563eb] transition-colors"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <CloseButton onClick={onClose} />
                    </button>

                    <h2 className="text-3xl font-extrabold text-[#1e293b] mb-6 text-center tracking-tight">
                        New User
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* 🟦 Name Row */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="firstName" className="block text-[#2563eb] font-semibold mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg 
                            ${formData.firstName === "" && firstnameError ? "border-red-500" :
                                            firstnameError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Enter first name"
                                    data-testid="firstName"
                                />
                                {firstnameError && <p className="text-red-500 text-sm mt-1">{firstnameError}</p>}
                            </div>

                            <div className="flex-1">
                                <label htmlFor="lastName" className="block text-[#2563eb] font-semibold mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg 
                            ${formData.lastName === "" && lastnameError ? "border-red-500" :
                                            lastnameError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Enter last name"
                                    data-testid="lastName"
                                />
                                {lastnameError && <p className="text-red-500 text-sm mt-1">{lastnameError}</p>}
                            </div>

                            <div className="flex-1">
                                <label htmlFor="middleName" className="block text-[#2563eb] font-semibold mb-1">
                                    Middle Name <span className="text-gray-400/50">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg
                            ${formData.middleName === "" && middlenameError ? "border-red-500" :
                                            middlenameError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                    value={formData.middleName}
                                    onChange={handleInputChange}
                                    placeholder="Enter middle name"
                                    data-testid="middleName"
                                />
                                {middlenameError && <p className="text-red-500 text-sm mt-1">{middlenameError}</p>}
                            </div>
                        </div>

                        {/* 🟦 Username / Email / Phone */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="username" className="block text-[#2563eb] font-semibold mb-1">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg
                            ${formData.username === "" && usernameError ? "border-red-500" :
                                            usernameError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter username"
                                    data-testid="username"
                                />
                                {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                            </div>

                            <div className="flex-1">
                                <label htmlFor="email" className="block text-[#2563eb] font-semibold mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg
                            ${formData.email === "" && emailError ? "border-red-500" :
                                            emailError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="example@example.com"
                                    data-testid="email"
                                />
                                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                            </div>

                            <div className="flex-1">
                                <label htmlFor="phoneNumber" className="block text-[#2563eb] font-semibold mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    maxLength={10}
                                    className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg
                            ${formData.phoneNumber === "" && phoneNumberError ? "border-red-500" :
                                            phoneNumberError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="9XXXXXXXXX"
                                    data-testid="phoneNumber"
                                />
                                {phoneNumberError && <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>}
                            </div>
                        </div>

                        {/* 🟦 Passwords */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-[#2563eb] font-semibold mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg
                                ${formData.password === "" && passwordError ? "border-red-500" :
                                                passwordError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter password"
                                        data-testid="password"
                                    />

                                    {formData.password.length > 0 && (
                                        showPassword ? (
                                            <FaEye
                                                onClick={() => setShowPassword(false)}
                                                className="absolute top-4 right-4 text-2xl text-gray-400 cursor-pointer"
                                            />
                                        ) : (
                                            <FaEyeSlash
                                                onClick={() => setShowPassword(true)}
                                                className="absolute top-4 right-4 text-2xl text-gray-400 cursor-pointer"
                                            />
                                        )
                                    )}
                                </div>

                                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                            </div>

                            <div className="flex-1">
                                <label className="block text-[#2563eb] font-semibold mb-1">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg
                                ${formData.confirmPassword === "" && confirmPasswordError ? "border-red-500" :
                                                confirmPasswordError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm password"
                                        data-testid="confirmPassword"
                                    />

                                    {formData.confirmPassword.length > 0 && (
                                        showConfirmPassword ? (
                                            <FaEye
                                                onClick={() => setShowConfirmPassword(false)}
                                                className="absolute top-4 right-4 text-2xl text-gray-400 cursor-pointer"
                                            />
                                        ) : (
                                            <FaEyeSlash
                                                onClick={() => setShowConfirmPassword(true)}
                                                className="absolute top-4 right-4 text-2xl text-gray-400 cursor-pointer"
                                            />
                                        )
                                    )}
                                </div>

                                {confirmPasswordError && (
                                    <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
                                )}
                            </div>
                        </div>

                        {/* 🟦 Role */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="role" className="block text-[#2563eb] font-semibold mb-1">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    className={`w-full px-4 py-3 rounded-xl border bg-[#f8fafc] focus:ring-2 focus:ring-[#2563eb] text-lg
                            ${formData.role === "" && roleError ? "border-red-500" :
                                            roleError ? "border-red-500" : "border-[#e0e7ef]"}`}
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    data-testid="role"
                                >
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Staff">Staff</option>
                                </select>
                                {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
                            </div>
                        </div>

                        {/* 🟦 Submit */}
                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-md hover:scale-105 transition-all duration-150 cursor-pointer"
                                data-testid="button-user"
                            >
                                Save User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
