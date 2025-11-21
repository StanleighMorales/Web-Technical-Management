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
        <div className="flex fixed inset-0 z-50 justify-center items-center animate-fadeIn bg-gray-900/60">
            {showAlert && <SuccessAlert message="Student updated successfully!" />}
            <div className="overflow-y-auto relative p-8 w-full max-w-5xl bg-white rounded-3xl shadow-2xl scrollbar-none animate-fadeInUp max-h-[90vh]">
                <button
                    className="absolute top-4 right-4 text-2xl transition-colors text-[#64748b] hover:text-[#2563eb]"
                    aria-label="Close"
                    onClick={onClose}
                >
                    <CloseButton onClick={onClose} />
                </button>
                <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-[#1e293b]">
                    Edit Student
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1">
                            <label
                                htmlFor="firstName"
                                className="block mb-1 font-semibold text-[#2563eb]"
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
                                <p className="mt-1 text-sm text-red-500">{firstnameError}</p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label
                                htmlFor="lastName"
                                className="block mb-1 font-semibold text-[#2563eb]"
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
                                <p className="mt-1 text-sm text-red-500">{lastnameError}</p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label
                                htmlFor="middleName"
                                className="block mb-1 font-semibold text-[#2563eb]"
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
                                <p className="mt-1 text-sm text-red-500">{middlenameError}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1">
                            <label
                                htmlFor="studentIdNumber"
                                className="block mb-1 font-semibold text-[#2563eb]"
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
                                <p className="mt-1 text-sm text-red-500">{studentIdError}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label
                                htmlFor="course"
                                className="block mb-1 font-semibold text-[#2563eb]"
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
                                <p className="mt-1 text-sm text-red-500">{courseError}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1">
                            <label
                                htmlFor="section"
                                className="block mb-1 font-semibold text-[#2563eb]"
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
                                <p className="mt-1 text-sm text-red-500">{sectionError}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label
                                htmlFor="year"
                                className="block mb-1 font-semibold text-[#2563eb]"
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
                                <p className="mt-1 text-sm text-red-500">{yearError}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="pt-6 border-t">
                        <h3 className="mb-4 text-xl font-bold text-[#1e293b]">Contact Information</h3>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <label
                                    htmlFor="resetPhoneNumber"
                                    className="block mb-1 font-semibold text-[#2563eb]"
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
                                    <p className="mt-1 text-sm text-red-500">{phoneError}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="resetEmail"
                                    className="block mb-1 font-semibold text-[#2563eb]"
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
                                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 mt-4 md:flex-row">
                            <div className="flex-1">
                                <label
                                    htmlFor="resetUsername"
                                    className="block mb-1 font-semibold text-[#2563eb]"
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
                                    <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="pt-6 border-t">
                        <h3 className="mb-4 text-xl font-bold text-[#1e293b]">Address Information</h3>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <label
                                    htmlFor="street"
                                    className="block mb-1 font-semibold text-[#2563eb]"
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
                                    <p className="mt-1 text-sm text-red-500">{streetError}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="cityMunicipality"
                                    className="block mb-1 font-semibold text-[#2563eb]"
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
                                    <p className="mt-1 text-sm text-red-500">{cityError}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 mt-4 md:flex-row">
                            <div className="flex-1">
                                <label
                                    htmlFor="province"
                                    className="block mb-1 font-semibold text-[#2563eb]"
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
                                    <p className="mt-1 text-sm text-red-500">{provinceError}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="postalCode"
                                    className="block mb-1 font-semibold text-[#2563eb]"
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
                                    <p className="mt-1 text-sm text-red-500">{postalCodeError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            className="py-3 px-8 font-bold text-white bg-blue-500 rounded-xl shadow-lg transition-all duration-150 cursor-pointer hover:shadow-2xl hover:scale-105 "
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
