import { UserData } from "../utils/usersData/userData";
import { MdVisibility } from "react-icons/md";
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
  onSetViewUserId?: (value: string) => void;
  onSetIsViewUserOpen?: (value: boolean) => void;
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
  onSetViewUserId,
  onSetIsViewUserOpen,
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

  const handleEditTeacher = (id: string) => {
    onSetEditUserId(id);
    onSetIsEditUserOpen(true);
  }

  const handleViewUser = (id: string) => {
    if (onSetViewUserId && onSetIsViewUserOpen) {
      onSetViewUserId(id);
      onSetIsViewUserOpen(true);
    }
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
        onClick={onHandleArchiveUser}
        title="Archive item"
        className="text-orange-600 text-2xl cursor-pointer hover:text-orange-700 transition-colors"
      >
        <IoArchive />
      </button>
    );
  };
  return (
    <>
      <td className="py-3 px-6">{id}</td>
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
      <td className="py-3 px-6 flex flex-row">
        {onSetViewUserId && onSetIsViewUserOpen && (
          <button
            className="mr-2 text-green-500 text-2xl hover:text-green-700 transition-colors"
            onClick={() => handleViewUser(id)}
            title="View user credentials"
          >
            <MdVisibility />
          </button>
        )}
        <button
          className="mr-2 text-blue-500 text-2xl hover:text-blue-700 transition-colors"
          onClick={() => handleEditTeacher(id)}
          title="Edit user"
        >
          <CiEdit />
        </button>
        <ShowButtonIfUserAdmin userRole={data.userRole} onHandleArchiveUser={handleArchiveUser} />
      </td>
    </>
  );
}
