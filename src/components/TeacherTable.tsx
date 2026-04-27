import type { FC } from "react";
import { CiEdit } from "react-icons/ci";
import { IoArchive } from "react-icons/io5";
import { UserData } from "../utils/usersData/userData";

type TeacherTable = {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    username: string;
    email: string;
    userRole: string;
    department: string;
    status: string;
    onSetEditUserId: (value: string) => void;
    onSetIsEditUserOpen: (value: boolean) => void;
    onMutate: (value: string) => void;
}

export default function TeacherTable({
    id,
    firstName,
    lastName,
    middleName,
    username,
    userRole,
    department,
    status,
    onSetEditUserId,
    onSetIsEditUserOpen,
    onMutate }: TeacherTable) {

    const data = UserData()

    const UserStatus = (status: string) => {
        if (!status) return "bg-red-100 text-gray-700"
        if (status === "Online") return "bg-green-100 text-green-700"
        if (status === "Offline") return "bg-orange-100 text-gray-700"
        return status
    }

    const handleArchiveUser = () => {
        onMutate(id)
    }

    const handleEditTeacher = (id: string) => {
        onSetEditUserId(id);
        onSetIsEditUserOpen(true);
    }

    type showButtonIfUserAdminProps = {
        viewerRole?: string;
        targetStatus?: string;
        onHandleArchiveUser: () => void
    }

    const ShowButtonIfUserAdmin: FC<showButtonIfUserAdminProps> = ({
        viewerRole,
        targetStatus,
        onHandleArchiveUser,
    }) => {
        const viewer = viewerRole?.toLowerCase();
        const isAdminOrSuper = viewer === "admin" || viewer === "superadmin";
        const isStaff = viewer === "staff";
        const isOnline = targetStatus?.toLowerCase() === "online";

        // Teachers are not elevated — staff can archive them
        if (!isAdminOrSuper && !isStaff) return null;

        return (
            <button
                onClick={(e) => { e.stopPropagation(); if (!isOnline) onHandleArchiveUser(); }}
                disabled={isOnline}
                title={isOnline ? "Cannot archive — user is currently Online" : "Archive teacher"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
                <IoArchive className="h-3.5 w-3.5" /> Archive
            </button>
        );
    };

    const getFullName = () => {
        const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
        return `${firstName} ${middleInitial} ${lastName}`.replace(/\s+/g, " ").trim();
    };

    return (
        <>
            <td className="py-3 px-6">{getFullName()}</td>
            <td className="py-3 px-6">{username}</td>
            <td className="py-3 px-6">{userRole}</td>
            <td className="py-3 px-6">{department}</td>
            <td className="py-3 px-6">
                <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${UserStatus(status)}`}
                >
                    {status}
                </span>
            </td>
            <td className="py-3 px-6 flex flex-row gap-2">
                <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => { e.stopPropagation(); handleEditTeacher(id) }}
                    title="Edit user"
                >
                    <CiEdit className="h-3.5 w-3.5" /> Edit
                </button>
                <ShowButtonIfUserAdmin viewerRole={data.userRole} targetStatus={status} onHandleArchiveUser={handleArchiveUser} />
            </td>
        </>
    )
}

