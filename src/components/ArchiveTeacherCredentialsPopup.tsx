import { useGetArchiveUserInfo } from "../hooks/userHooks";
import { useQuery } from "@tanstack/react-query";
import {
    MdEmail,
    MdPhone,
    MdSchool,
    MdPerson,
    MdBadge,
    MdArchive,
    MdWork,
} from "react-icons/md";
import { IoIdCard } from "react-icons/io5";
import { FormattedDateTime } from "./FormattedDateTime";
import type { TArchiveTeacher } from "../types/types";
import CloseButton from "./CloseButton";

type ArchiveTeacherCredentialsPopupProps = {
    teacherId: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function ArchiveTeacherCredentialsPopup({
    teacherId,
    isOpen,
    onClose,
}: ArchiveTeacherCredentialsPopupProps) {
    const { data, isLoading, error } = useQuery(useGetArchiveUserInfo(teacherId));

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
                                Failed to load archived teacher credentials
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
                            <p className="text-gray-600">No archived teacher data found</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const teacher = data as TArchiveTeacher;

    const getFullName = () => {
        const middleInitial = teacher.middleName
            ? `${teacher.middleName.charAt(0)}.`
            : "";
        return `${teacher.firstName} ${middleInitial} ${teacher.lastName}`
            .replace(/\s+/g, " ")
            .trim();
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
                                    Archived Teacher Credentials
                                </h2>
                                <p className="text-gray-600">
                                    Complete archived teacher information
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Archived on</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {FormattedDateTime(teacher.archivedAt)}
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
                                <p className="text-gray-900">{teacher.username}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="flex items-center">
                                    <MdEmail className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">{teacher.email}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="flex items-center">
                                    <MdPhone className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">{teacher.phoneNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Information */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdSchool className="mr-2 text-blue-600" />
                            Teacher Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Teacher ID
                                </label>
                                <div className="flex items-center">
                                    <MdBadge className="mr-2 text-gray-400" />
                                    <p className="font-mono text-gray-900">{teacher.id}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <div className="flex items-center">
                                    <MdWork className="mr-2 text-gray-400" />
                                    <p className="text-gray-900">{teacher.department}</p>
                                </div>
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
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${teacher.userRole === "Admin"
                                            ? "bg-red-100 text-red-800"
                                            : teacher.userRole === "Teacher"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {teacher.userRole}
                                </span>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <span className="inline-flex py-1 px-2 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                                    {teacher.status}
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
                                    {FormattedDateTime(teacher.archivedAt)}
                                </p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Original User ID
                                </label>
                                <p className="font-mono text-sm text-gray-900">
                                    {teacher.originalUserId}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
