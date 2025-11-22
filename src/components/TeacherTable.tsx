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
        userRole?: string;
        onHandleArchiveUser: () => void
    }

    const ShowButtonIfUserAdmin: FC<showButtonIfUserAdminProps> = ({
        userRole,
        onHandleArchiveUser,
    }) => {
        if (userRole !== "Admin") return null;
        return (
            <button
                onClick={(e) => { e.stopPropagation(); onHandleArchiveUser(); }}
                title="Archive item"
                className="text-orange-600 text-2xl cursor-pointer hover:text-orange-700 transition-colors"
            >
                <IoArchive />
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
            <td className="py-3 px-6 flex flex-row">
                <button
                    className="mr-2 text-blue-500 text-2xl hover:text-blue-700 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleEditTeacher(id) }}
                    title="Edit user"
                >
                    <CiEdit />
                </button>
                <ShowButtonIfUserAdmin userRole={data.userRole} onHandleArchiveUser={handleArchiveUser} />
            </td>
        </>
    )
}

