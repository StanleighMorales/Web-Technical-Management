import React, { useState } from "react";
import CloseButton from "./CloseButton";
import type { TStudent } from "../types/types";
import { usePatchStudentMutation } from "../query/patch/usePatchStudentMutation";
import { SuccessAlert } from "./SuccessAlert";

type EditStudentProps = {
    frontStudentIdPicture: null,
    backStudentIdPicture: null,
    studentIdNumber: string,
    phoneNumber: string,
    course: string,
    section: string,
    year: string,
    profilePicture: null,
    street: string,
    cityMunicipality: string,
    province: string,
    postalCode: string,
    id: string,
    username: string,
    email: string,
    userRole: string,
    status: string,
    lastName: string,
    middleName: string,
    firstName: string
    onClose: () => void;
};

export const EditStudent = ({
    id,
    firstName,
    middleName,
    lastName,
    studentIdNumber,
    phoneNumber,
    course,
    section,
    year,
    street,
    cityMunicipality,
    province,
    postalCode,
    username,
    email,
    userRole,
    status,
    onClose
}: EditStudentProps) => {
    const [firstnameError, setFirstnameError] = useState<string>("");
    const [lastnameError, setLastnameError] = useState<string>("");
    const [middlenameError, setMiddlenameError] = useState<string>("");
    const [studentIdError, setStudentIdError] = useState<string>("");
    const [courseError, setCourseError] = useState<string>("");
    const [sectionError, setSectionError] = useState<string>("");
    const [yearError, setYearError] = useState<string>("");
    const [phoneError, setPhoneError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [streetError, setStreetError] = useState<string>("");
    const [cityError, setCityError] = useState<string>("");
    const [provinceError, setProvinceError] = useState<string>("");
    const [postalCodeError, setPostalCodeError] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const { mutate } = usePatchStudentMutation();

    const [formData, setFormData] = useState<TStudent>({
        frontStudentIdPicture: null,
        backStudentIdPicture: null,
        studentIdNumber: studentIdNumber,
        phoneNumber: phoneNumber,
        course: course,
        section: section,
        year: year,
        profilePicture: null,
        street: street,
        cityMunicipality: cityMunicipality,
        province: province,
        postalCode: postalCode,
        id: id,
        username: username,
        email: email,
        userRole: userRole,
        status: status,
        lastName: lastName,
        middleName: middleName,
        firstName: firstName
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "firstName") return setFirstnameError("");
        if (name === "lastName") return setLastnameError("");
        if (name === "middleName") return setMiddlenameError("");
        if (name === "studentIdNumber") return setStudentIdError("");
        if (name === "course") return setCourseError("");
        if (name === "section") return setSectionError("");
        if (name === "year") return setYearError("");
        if (name === "phoneNumber") return setPhoneError("");
        if (name === "username") return setUsernameError("");
        if (name === "email") return setEmailError("");
        if (name === "street") return setStreetError("");
        if (name === "cityMunicipality") return setCityError("");
        if (name === "province") return setProvinceError("");
        if (name === "postalCode") return setPostalCodeError("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedStudent = {
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            studentIdNumber: formData.studentIdNumber,
            course: formData.course,
            section: formData.section,
            year: formData.year,
            phoneNumber: formData.phoneNumber,
            street: formData.street,
            cityMunicipality: formData.cityMunicipality,
            province: formData.province,
            postalCode: formData.postalCode,
            username: formData.username,
            email: formData.email,
            userRole: formData.userRole,
            status: formData.status,
            frontStudentIdPicture: formData.frontStudentIdPicture,
            backStudentIdPicture: formData.backStudentIdPicture,
            profilePicture: formData.profilePicture
        }

        mutate({ id, formData: updatedStudent }, {
            onSuccess: () => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    onClose();
                }, 1500);
            },
            onError: (error) => {
                console.log(error.message);
            }
        });
    };

    return (
        <div className="fixed animate-fadeIn inset-0 z-50 flex items-center justify-center bg-gray-900/60">
            {showAlert && <SuccessAlert message="Student updated successfully!" />}
            <div className="scrollbar-none bg-white rounded-3xl shadow-2xl p-8 w-full max-w-5xl relative animate-fadeInUp max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-4 right-4 text-2xl text-[#64748b] hover:text-[#2563eb] transition-colors"
                    aria-label="Close"
                    onClick={onClose}
                >
                    <CloseButton onClick={onClose} />
                </button>
                <h2 className="text-3xl font-extrabold text-[#1e293b] mb-6 text-center tracking-tight">
                    Edit Student
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label
                                htmlFor="firstName"
                                className="block text-[#2563eb] font-semibold mb-1"
                            >
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className={`w-full px-4 py-3 rounded-xl border ${firstnameError ? "border-red-500" : "border-[#e0e7ef]"
                                    } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                            />
                            {firstnameError && (
                                <p className="text-red-500 text-sm mt-1">{firstnameError}</p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label
                                htmlFor="lastName"
                                className="block text-[#2563eb] font-semibold mb-1"
                            >
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className={`w-full px-4 py-3 rounded-xl border ${lastnameError ? "border-red-500" : "border-[#e0e7ef]"
                                    } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                            />
                            {lastnameError && (
                                <p className="text-red-500 text-sm mt-1">{lastnameError}</p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label
                                htmlFor="middleName"
                                className="block text-[#2563eb] font-semibold mb-1"
                            >
                                Middle Name <span className="text-gray-400/50">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                id="middleName"
                                name="middleName"
                                className={`w-full px-4 py-3 rounded-xl border ${middlenameError ? "border-red-500" : "border-[#e0e7ef]"
                                    } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                value={formData.middleName}
                                onChange={handleInputChange}
                                placeholder="Enter Middle Initial"
                            />
                            {middlenameError && (
                                <p className="text-red-500 text-sm mt-1">{middlenameError}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label
                                htmlFor="studentIdNumber"
                                className="block text-[#2563eb] font-semibold mb-1"
                            >
                                Student ID Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="studentIdNumber"
                                name="studentIdNumber"
                                className={`w-full px-4 py-3 rounded-xl border ${studentIdError ? "border-red-500" : "border-[#e0e7ef]"
                                    } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                value={formData.studentIdNumber}
                                onChange={handleInputChange}
                                placeholder="Enter student ID number"
                            />
                            {studentIdError && (
                                <p className="text-red-500 text-sm mt-1">{studentIdError}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label
                                htmlFor="course"
                                className="block text-[#2563eb] font-semibold mb-1"
                            >
                                Course <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="course"
                                name="course"
                                className={`w-full px-4 py-3 rounded-xl border ${courseError ? "border-red-500" : "border-[#e0e7ef]"
                                    } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                value={formData.course}
                                onChange={handleInputChange}
                                placeholder="Enter course"
                            />
                            {courseError && (
                                <p className="text-red-500 text-sm mt-1">{courseError}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label
                                htmlFor="section"
                                className="block text-[#2563eb] font-semibold mb-1"
                            >
                                Section <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="section"
                                name="section"
                                className={`w-full px-4 py-3 rounded-xl border ${sectionError ? "border-red-500" : "border-[#e0e7ef]"
                                    } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                value={formData.section}
                                onChange={handleInputChange}
                                placeholder="Enter section"
                            />
                            {sectionError && (
                                <p className="text-red-500 text-sm mt-1">{sectionError}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label
                                htmlFor="year"
                                className="block text-[#2563eb] font-semibold mb-1"
                            >
                                Year <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="year"
                                name="year"
                                className={`w-full px-4 py-3 rounded-xl border ${yearError ? "border-red-500" : "border-[#e0e7ef]"
                                    } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                value={formData.year}
                                onChange={handleInputChange}
                                placeholder="Enter year"
                            />
                            {yearError && (
                                <p className="text-red-500 text-sm mt-1">{yearError}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-xl font-bold text-[#1e293b] mb-4">Contact Information</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label
                                    htmlFor="resetPhoneNumber"
                                    className="block text-[#2563eb] font-semibold mb-1"
                                >
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="resetPhoneNumber"
                                    name="phoneNumber"
                                    className={`w-full px-4 py-3 rounded-xl border ${phoneError ? "border-red-500" : "border-[#e0e7ef]"
                                        } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                />
                                {phoneError && (
                                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="resetEmail"
                                    className="block text-[#2563eb] font-semibold mb-1"
                                >
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="resetEmail"
                                    name="email"
                                    className={`w-full px-4 py-3 rounded-xl border ${emailError ? "border-red-500" : "border-[#e0e7ef]"
                                        } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                />
                                {emailError && (
                                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="flex-1">
                                <label
                                    htmlFor="resetUsername"
                                    className="block text-[#2563eb] font-semibold mb-1"
                                >
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="resetUsername"
                                    name="username"
                                    className={`w-full px-4 py-3 rounded-xl border ${usernameError ? "border-red-500" : "border-[#e0e7ef]"
                                        } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter username"
                                />
                                {usernameError && (
                                    <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-xl font-bold text-[#1e293b] mb-4">Address Information</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label
                                    htmlFor="street"
                                    className="block text-[#2563eb] font-semibold mb-1"
                                >
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    className={`w-full px-4 py-3 rounded-xl border ${streetError ? "border-red-500" : "border-[#e0e7ef]"
                                        } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="Enter street address"
                                />
                                {streetError && (
                                    <p className="text-red-500 text-sm mt-1">{streetError}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="cityMunicipality"
                                    className="block text-[#2563eb] font-semibold mb-1"
                                >
                                    City/Municipality <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="cityMunicipality"
                                    name="cityMunicipality"
                                    className={`w-full px-4 py-3 rounded-xl border ${cityError ? "border-red-500" : "border-[#e0e7ef]"
                                        } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                    value={formData.cityMunicipality}
                                    onChange={handleInputChange}
                                    placeholder="Enter city/municipality"
                                />
                                {cityError && (
                                    <p className="text-red-500 text-sm mt-1">{cityError}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="flex-1">
                                <label
                                    htmlFor="province"
                                    className="block text-[#2563eb] font-semibold mb-1"
                                >
                                    Province <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="province"
                                    name="province"
                                    className={`w-full px-4 py-3 rounded-xl border ${provinceError ? "border-red-500" : "border-[#e0e7ef]"
                                        } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                    value={formData.province}
                                    onChange={handleInputChange}
                                    placeholder="Enter province"
                                />
                                {provinceError && (
                                    <p className="text-red-500 text-sm mt-1">{provinceError}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="postalCode"
                                    className="block text-[#2563eb] font-semibold mb-1"
                                >
                                    Postal Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    className={`w-full px-4 py-3 rounded-xl border ${postalCodeError ? "border-red-500" : "border-[#e0e7ef]"
                                        } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                />
                                {postalCodeError && (
                                    <p className="text-red-500 text-sm mt-1">{postalCodeError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-150 cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
