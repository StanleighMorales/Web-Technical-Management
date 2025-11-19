import { UserData } from "../utils/usersData/userData";
import { FaTrash } from "react-icons/fa6";
import { FaTrashRestore } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
import type { FC } from "react";

type ArchiveItemTableProps = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  course: string;
  section: string;
  year: string;
  userRole: string;
  status: string;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onView: (id: string) => void;
  isRestoring: boolean;
  isDeleting: boolean;
};

export const ArchiveStudentTable: FC<Required<ArchiveItemTableProps>> = (
  props
) => {
  type checkIfUserAdminProps = {
    userRole?: string;
    onHandleRestoreStudent: () => void;
    onHandleDeleteStudent: () => void;
  };
  const data = UserData();

  const ShowButtonIfUserAdmin = ({
    userRole,
    onHandleRestoreStudent,
    onHandleDeleteStudent,
  }: checkIfUserAdminProps) => {
    if (userRole !== "Admin") return null;
    return (
      <>
        <button
          onClick={onHandleDeleteStudent}
          disabled={props.isDeleting}
          title="Delete item"
          className="mr-2 text-2xl text-red-600 cursor-pointer"
        >
          <FaTrash />
        </button>

        <button
          onClick={onHandleRestoreStudent}
          disabled={props.isRestoring}
          title="Restore item"
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
        {props.course}
      </td>
      <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
        {props.section}
      </td>
      <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
        {props.year}
      </td>
      <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            props.userRole === "student"
              ? "bg-green-100 text-green-800"
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
            title="View student credentials"
          >
            <MdVisibility />
          </button>
          <ShowButtonIfUserAdmin
            userRole={data.userRole}
            onHandleRestoreStudent={() => props.onRestore(props.id)}
            onHandleDeleteStudent={() => props.onDelete(props.id)}
          />
        </div>
      </td>
    </>
  );
};
