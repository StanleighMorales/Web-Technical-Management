import { MdEmail, MdPhone, MdSchool, MdPerson } from "react-icons/md";
import { IoIdCard } from "react-icons/io5";
import type { FC } from "react";
import type { TTeacher } from "../types/types";
import { FaPlus } from "react-icons/fa6";
import { FormattedPhoneNumber } from "./FormatedPhoneNumber";
type ViewTeacherCredentialsProps = {
    teacher: TTeacher;
    isOpen: boolean;
    onClose: () => void;
};

const ViewTeacherCredentials: FC<ViewTeacherCredentialsProps> = ({
    teacher,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    const getFullName = () => {
        const middleInitial = teacher.middleName ? `${teacher.middleName.charAt(0)}.` : "";
        return `${teacher.firstName} ${middleInitial} ${teacher.lastName}`.replace(/\s+/g, " ").trim();
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
                            <h2 className="text-2xl font-bold text-gray-900">Teacher Credentials</h2>
                            <p className="text-gray-600">Complete teacher information</p>
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
                            <MdPerson className="mr-2 text-green-600" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">ID</label>
                                <p className="font-medium text-gray-900">{teacher.id}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                                <p className="font-medium text-gray-900">{getFullName()}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                                <p className="text-gray-900">{teacher.username || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                                <div className="flex items-center">
                                    <MdEmail className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">{teacher.email || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="flex items-center">
                                    <MdPhone className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">{FormattedPhoneNumber(teacher.phoneNumber) || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Information */}
                    <div className="p-6 bg-green-50 rounded-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdSchool className="mr-2 text-green-600" />
                            Teacher Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
                                <p className="text-gray-900">{teacher.department || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Subject Specialization</label>
                                <p className="text-gray-900">{teacher.subject || "N/A"}</p>
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
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${teacher.userRole === 'Admin'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    {teacher.userRole || "N/A"}
                                </span>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${teacher.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {teacher.status || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeacherCredentials;
