import { FaTrash } from "react-icons/fa6";
import { UserData } from "../utils/usersData/userData";
import { FaTrashRestore } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
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
  onView: (id: string) => void;
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
    if (userRole !== "Admin") return null;
    return (
      <>
        <button
          onClick={onHandleDeleteTeacher}
          disabled={props.isDeleting}
          title="Delete Teacher"
          className="mr-2 text-2xl text-red-600 cursor-pointer"
        >
          <FaTrash />
        </button>

        <button
          onClick={onHandleRestoreTeacher}
          disabled={props.isRestoring}
          title="Restore Teacher"
          className="text-2xl text-orange-300 cursor-pointer"
        >
          <FaTrashRestore />
        </button>
      </>
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
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            props.userRole === "teacher"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {props.userRole}
        </span>
      </td>
      <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            props.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {props.status}
        </span>
      </td>
      <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
        <div className="flex flex-row">
          <button
            onClick={() => props.onView(props.id)}
            className="mr-2 text-2xl text-green-500 transition-colors hover:text-green-700"
            title="View teacher credentials"
          >
            <MdVisibility />
          </button>
          <ShowButtonIfUserAdmin
            userRole={data.userRole}
            onHandleDeleteTeacher={() => props.onDelete(props.id)}
            onHandleRestoreTeacher={() => props.onRestore(props.id)}
          />
        </div>
      </td>
    </>
  );
};
