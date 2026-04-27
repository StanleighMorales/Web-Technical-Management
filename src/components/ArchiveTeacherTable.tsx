import { UserData } from "../utils/usersData/userData";
import type { FC } from "react";

type ArchiveTeacherTableProps = {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    username: string;
    userRole: string;
    status: string;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    isRestoring: boolean;
    isDeleting: boolean;
};
export const ArchiveTeacherTable: FC<Required<ArchiveTeacherTableProps>> = (
    props
) => {
    type checkIfUserAdminProps = {
        userRole?: string;
        onHandleRestoreTeacher: () => void;
        onHandleDeleteTeacher: () => void;
    };

    const data = UserData();

    const ShowButtonIfUserAdmin = ({
        userRole,
        onHandleRestoreTeacher,
        onHandleDeleteTeacher,
    }: checkIfUserAdminProps) => {
        const role = userRole?.toLowerCase();
        const isAdmin = role === "admin" || role === "superadmin";
        const isStaff = role === "staff";
        if (!isAdmin && !isStaff) return null;
        return (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {isAdmin && (
                    <button
                        onClick={onHandleDeleteTeacher}
                        disabled={props.isDeleting}
                        title="Delete Teacher"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Delete
                    </button>
                )}
                <button
                    onClick={onHandleRestoreTeacher}
                    disabled={props.isRestoring}
                    title="Restore Teacher"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Restore
                </button>
            </div>
        );
    };
    return (
        <>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                {props.id}
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                {props.firstName} {String(props.middleName).charAt(0).toUpperCase()}.{" "}
                {props.lastName}
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                {props.username}
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${props.userRole === "teacher"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {props.userRole}
                </span>
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${props.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {props.status}
                </span>
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                <ShowButtonIfUserAdmin
                    userRole={data.userRole}
                    onHandleDeleteTeacher={() => props.onDelete(props.id)}
                    onHandleRestoreTeacher={() => props.onRestore(props.id)}
                />
            </td>
        </>
    );
};
