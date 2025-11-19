import { MdEmail, MdPhone, MdLocationOn, MdSchool, MdPerson, MdBadge } from "react-icons/md";
import { IoIdCard } from "react-icons/io5";
import type { FC } from "react";
import type { TStudent } from "../types/types";
import { FaPlus } from "react-icons/fa6";

type ViewStudentCredentialsProps = {
    student: TStudent;
    isOpen: boolean;
    onClose: () => void;
};

const ViewStudentCredentials: FC<ViewStudentCredentialsProps> = ({
    student,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    const getFullName = () => {
        const middleInitial = student.middleName ? `${student.middleName.charAt(0)}.` : "";
        return `${student.firstName} ${middleInitial} ${student.lastName}`.replace(/\s+/g, " ").trim();
    };

    const getFullAddress = () => {
        return `${student.street}, ${student.cityMunicipality}, ${student.province} ${student.postalCode}`;
    };

    return (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/40">
            <div className="overflow-y-auto w-full max-w-4xl bg-white rounded-lg shadow-xl scrollbar-none max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                            <MdPerson className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Student Credentials</h2>
                            <p className="text-gray-600">Complete student information</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 transition-colors hover:text-gray-600"
                    >
                        <FaPlus data-testid="closebutton" className="justify-center items-center text-2xl text-gray-400 rounded-full transition-all duration-200 transform rotate-45 cursor-pointer hover:text-white hover:bg-red-500 hover:rotate-180 w-[32px] h-[32px]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdPerson className="mr-2 text-blue-600" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                                <p className="font-medium text-gray-900">{getFullName() || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                                <p className="text-gray-900">{student.username || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                                <div className="flex items-center">
                                    <MdEmail className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">{student.email || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="flex items-center">
                                    <MdPhone className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">{student.phoneNumber || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="p-6 bg-blue-50 rounded-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdSchool className="mr-2 text-blue-600" />
                            Student Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Student ID Number</label>
                                <div className="flex items-center">
                                    <MdBadge className="mr-2 text-gray-400" />
                                    <p className="font-mono text-gray-900">{student.studentIdNumber || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Course</label>
                                <p className="text-gray-900">{student.course || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Section</label>
                                <p className="text-gray-900">{student.section || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Year Level</label>
                                <p className="text-gray-900">{student.year || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="p-6 bg-green-50 rounded-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdLocationOn className="mr-2 text-green-600" />
                            Address Information
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Street</label>
                                <p className="text-gray-900">{student.street || "N/A"}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">City/Municipality</label>
                                    <p className="text-gray-900">{student.cityMunicipality || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Province</label>
                                    <p className="text-gray-900">{student.province || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Postal Code</label>
                                    <p className="text-gray-900">{student.postalCode || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Complete Address</label>
                                <p className="text-gray-900">{getFullAddress() || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="p-6 bg-purple-50 rounded-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <IoIdCard className="mr-2 text-purple-600" />
                            Account Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">User Role</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.userRole === 'Admin'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {student.userRole}
                                </span>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {student.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewStudentCredentials;
