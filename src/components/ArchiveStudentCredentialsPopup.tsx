import { useGetArchiveUserInfo } from "../hooks/user/useGetArchiveUserInfo";
import { useQuery } from "@tanstack/react-query";
import {
    MdEmail,
    MdPhone,
    MdLocationOn,
    MdSchool,
    MdPerson,
    MdBadge,
    MdArchive,
} from "react-icons/md";
import { IoIdCard } from "react-icons/io5";
import { FormattedDateTime } from "./FormattedDateTime";
import type { TArchiveStudent } from "../types/types";
import CloseButton from "./CloseButton";

type ArchiveStudentCredentialsPopupProps = {
    studentId: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function ArchiveStudentCredentialsPopup({
    studentId,
    isOpen,
    onClose,
}: ArchiveStudentCredentialsPopupProps) {
    const { data, isLoading, error } = useQuery(useGetArchiveUserInfo(studentId));

    if (!isOpen) return null;

    if (isLoading) {
        return (
            <div className="flex fixed inset-0 z-50 justify-center items-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="overflow-hidden relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh]">
                    <div className="flex justify-center items-center h-96">
                        <div className="w-16 h-16 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex fixed inset-0 z-50 justify-center items-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="overflow-hidden relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh]">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <h2 className="mb-2 text-2xl font-bold text-red-600">Error</h2>
                            <p className="text-gray-600">
                                Failed to load archived student credentials
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex fixed inset-0 z-50 justify-center items-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="overflow-hidden relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh]">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <h2 className="mb-2 text-2xl font-bold text-gray-600">No Data</h2>
                            <p className="text-gray-600">No archived student data found</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const student = data as TArchiveStudent;

    const getFullName = () => {
        const middleInitial = student.middleName
            ? `${student.middleName.charAt(0)}.`
            : "";
        return `${student.firstName} ${middleInitial} ${student.lastName}`
            .replace(/\s+/g, " ")
            .trim();
    };

    const getFullAddress = () => {
        return `${student.street}, ${student.cityMunicipality}, ${student.province} ${student.postalCode}`;
    };
    return (
        <div className="flex fixed inset-0 z-50 justify-center items-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="overflow-hidden relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh]">
                {/* Header */}
                <div className="p-6 bg-white border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-full">
                                <MdArchive className="text-2xl text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Archived Student Credentials
                                </h2>
                                <p className="text-gray-600">
                                    Complete archived student information
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Archived on</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {FormattedDateTime(student.archivedAt)}
                                </p>
                            </div>
                            <CloseButton onClick={onClose} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-6 scrollbar-none max-h-[calc(90vh-120px)]">
                    {/* Personal Information */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdPerson className="mr-2 text-blue-600" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <p className="font-medium text-gray-900">{getFullName()}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <p className="text-gray-900">{student.username || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="flex items-center">
                                    <MdEmail className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">{student.email || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="flex items-center">
                                    <MdPhone className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">
                                        {student.phoneNumber || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdSchool className="mr-2 text-blue-600" />
                            Student Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Student ID Number
                                </label>
                                <div className="flex items-center">
                                    <MdBadge className="mr-2 text-gray-400" />
                                    <p className="font-mono text-gray-900">
                                        {student.studentIdNumber || "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Course
                                </label>
                                <p className="text-gray-900">{student.course || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Section
                                </label>
                                <p className="text-gray-900">{student.section || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Year Level
                                </label>
                                <p className="text-gray-900">{student.year || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdLocationOn className="mr-2 text-green-600" />
                            Address Information
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Street
                                </label>
                                <p className="text-gray-900">{student.street || "N/A"}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        City/Municipality
                                    </label>
                                    <p className="text-gray-900">
                                        {student.cityMunicipality || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Province
                                    </label>
                                    <p className="text-gray-900">{student.province || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Postal Code
                                    </label>
                                    <p className="text-gray-900">{student.postalCode || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Complete Address
                                </label>
                                <p className="text-gray-900">{getFullAddress()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <IoIdCard className="mr-2 text-purple-600" />
                            Account Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    User Role
                                </label>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.userRole === "Admin"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800"
                                        }`}
                                >
                                    {student.userRole || "N/A"}
                                </span>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <span className="inline-flex py-1 px-2 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                                    {student.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Archive Information */}
                    <div className="p-6 bg-orange-50 rounded-lg shadow-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdArchive className="mr-2 text-orange-600" />
                            Archive Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Archived At
                                </label>
                                <p className="text-gray-900">
                                    {FormattedDateTime(student.archivedAt)}
                                </p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Original User ID
                                </label>
                                <p className="font-mono text-sm text-gray-900">
                                    {student.originalUserId || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
