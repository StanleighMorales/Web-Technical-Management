import { useViewArchiveUserCredentials } from "../query/get/useViewArchiveUserCredentials";
import { useQuery } from "@tanstack/react-query";
import { MdEmail, MdPhone, MdSchool, MdPerson, MdBadge, MdArchive, MdClose, MdWork } from "react-icons/md";
import { IoIdCard } from "react-icons/io5";
import type { TArchiveTeacher } from "../types/types";

type ArchiveTeacherCredentialsPopupProps = {
    teacherId: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function ArchiveTeacherCredentialsPopup({
    teacherId,
    isOpen,
    onClose
}: ArchiveTeacherCredentialsPopupProps) {
    const { data, isLoading, error } = useQuery(useViewArchiveUserCredentials(teacherId));

    if (!isOpen) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                            <p className="text-gray-600">Failed to load archived teacher credentials</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-600 mb-2">No Data</h2>
                            <p className="text-gray-600">No archived teacher data found</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const teacher = data as TArchiveTeacher;

    const getFullName = () => {
        const middleInitial = teacher.middleName ? `${teacher.middleName.charAt(0)}.` : "";
        return `${teacher.firstName} ${middleInitial} ${teacher.lastName}`.replace(/\s+/g, " ").trim();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 p-2 rounded-full">
                                <MdArchive className="text-orange-600 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Archived Teacher Credentials</h2>
                                <p className="text-gray-600">Complete archived teacher information</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Archived on</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(teacher.archivedAt)}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Close"
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="scrollbar-none overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <MdPerson className="mr-2 text-blue-600" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <p className="text-gray-900 font-medium">{getFullName()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <p className="text-gray-900">{teacher.username}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="flex items-center">
                                    <MdEmail className="text-gray-400 mr-2" />
                                    <p className="text-gray-900">{teacher.email}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="flex items-center">
                                    <MdPhone className="text-gray-400 mr-2" />
                                    <p className="text-gray-900">{teacher.phoneNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Information */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <MdSchool className="mr-2 text-blue-600" />
                            Teacher Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                                <div className="flex items-center">
                                    <MdBadge className="text-gray-400 mr-2" />
                                    <p className="text-gray-900 font-mono">{teacher.id}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <div className="flex items-center">
                                    <MdWork className="text-gray-400 mr-2" />
                                    <p className="text-gray-900">{teacher.department}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <IoIdCard className="mr-2 text-purple-600" />
                            Account Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${teacher.userRole === 'Admin'
                                    ? 'bg-red-100 text-red-800'
                                    : teacher.userRole === 'Teacher'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {teacher.userRole}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                    {teacher.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Archive Information */}
                    <div className="bg-orange-50 rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <MdArchive className="mr-2 text-orange-600" />
                            Archive Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Archived At</label>
                                <p className="text-gray-900">{formatDate(teacher.archivedAt)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original User ID</label>
                                <p className="text-gray-900 font-mono text-sm">{teacher.originalUserId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
