import { UserData } from "../utils/usersData/userData";
import { IoArchive } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import type { FC } from "react";

type UserTableProps = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    userRole: string;
    status: string;
    onSetEditUserId: (value: string) => void;
    onSetIsEditUserOpen: (value: boolean) => void;
    onMutate: (value: string) => void;
};

export default function UserTable({
    id,
    firstName,
    lastName,
    username,
    email,
    userRole,
    status,
    onSetEditUserId,
    onSetIsEditUserOpen,
    onMutate,
}: UserTableProps) {
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

    const handleEditUser = (id: string) => {
        onSetEditUserId(id);
        onSetIsEditUserOpen(true);
    }


    type showButtonIfUserAdminProps = {
        viewerRole?: string;
        targetRole?: string;
        targetStatus?: string;
        onHandleArchiveUser: () => void
    }

    // Role hierarchy: SuperAdmin > Admin > Staff > Teacher/Student
    const ELEVATED_ROLES = ["staff", "admin", "superadmin"];

    const ShowButtonIfUserAdmin: FC<showButtonIfUserAdminProps> = ({
        viewerRole,
        targetRole,
        targetStatus,
        onHandleArchiveUser,
    }) => {
        const viewer = viewerRole?.toLowerCase();
        const target = targetRole?.toLowerCase();
        const isOnline = targetStatus?.toLowerCase() === "online";

        const isAdminOrSuper = viewer === "admin" || viewer === "superadmin";
        const isStaff = viewer === "staff";

        // Staff can only archive teachers and students, not staff/admin/superadmin
        if (isStaff && ELEVATED_ROLES.includes(target ?? "")) return null;
        if (!isAdminOrSuper && !isStaff) return null;

        return (
            <button
                onClick={(e) => { e.stopPropagation(); if (!isOnline) onHandleArchiveUser(); }}
                disabled={isOnline}
                title={isOnline ? "Cannot archive — user is currently Online" : "Archive user"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
                <IoArchive className="h-3.5 w-3.5" /> Archive
            </button>
        );
    };
    return (
        <>
            <td className="py-3 px-6">{firstName}</td>
            <td className="py-3 px-6">{lastName}</td>
            <td className="py-3 px-6">{username}</td>
            <td className="py-3 px-6">{email}</td>
            <td className="py-3 px-6">{userRole}</td>
            <td className="py-3 px-6">
                <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${UserStatus(status)}`}
                >
                    {status}
                </span>
            </td>
            <td className="flex flex-row py-3 px-6 gap-2">
                <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => { e.stopPropagation(); handleEditUser(id) }}
                    title="Edit user"
                >
                    <CiEdit className="h-3.5 w-3.5" /> Edit
                </button>
                <ShowButtonIfUserAdmin viewerRole={data.userRole} targetRole={userRole} targetStatus={status} onHandleArchiveUser={handleArchiveUser} />
            </td >
        </>
    );
}
