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
        userRole?: string;
        onHandleArchiveUser: () => void
    }

    const ShowButtonIfUserAdmin: FC<showButtonIfUserAdminProps> = ({
        userRole,
        onHandleArchiveUser,
    }) => {
        if (userRole !== "Admin" && userRole !== "SuperAdmin" && userRole !== "Staff") return null;
        return (
            <button
                onClick={(e) => { e.stopPropagation(); onHandleArchiveUser(); }}
                title="Archive item"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <IoArchive /> Archive
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
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => { e.stopPropagation(); handleEditUser(id) }}
                    title="Edit user"
                >
                    <CiEdit /> Edit
                </button>
                <ShowButtonIfUserAdmin userRole={data.userRole} onHandleArchiveUser={handleArchiveUser} />
            </td >
        </>
    );
}
