import { MdEmail, MdPhone, MdPerson } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { IoIdCard } from "react-icons/io5";
import type { TUsers } from "../types/types";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

type TNewUserTyps = Omit<TUsers, 'course' | 'year' | 'section'>

type ViewUserCredentialsProps = {
  user: TNewUserTyps;
  isOpen: boolean;
  onClose: () => void;
};

const ViewUserCredentials = ({ user, isOpen, onClose }: ViewUserCredentialsProps) => {
  if (!isOpen) return null;

  const [userId, setUserId] = useState<string>("");
  const [showPassword, setShowPasswod] = useState<boolean>(false);

  const handleShowPassword = (id: string) => {
    setUserId(id)
    setShowPasswod(true)
  }

  const getFullName = () => {
    const middleInitial = user.middleName ? `${user.middleName.charAt(0)}.` : "";
    return `${user.firstName} ${middleInitial} ${user.lastName}`.replace(/\s+/g, " ").trim();
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/40">
      <div className="overflow-y-auto w-full max-w-4xl bg-white rounded-lg shadow-xl scrollbar-none max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <MdPerson className="text-2xl text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Users Credentials</h2>
              <p className="text-gray-600">Complete User information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <FaPlus data-testid="closebutton" className="justify-center items-center text-2xl text-gray-400 rounded-full transition-all duration-200 transform rotate-45 cursor-pointer hover:text-white hover:bg-red-500 hover:rotate-180 w-[32px] h-[32px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <MdPerson className="mr-2 text-green-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">ID</label>
                <p className="font-medium text-gray-900">{user.id}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <p className="font-medium text-gray-900">{getFullName() || "N/A"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                <p className="text-gray-900">{user.username || "N/A"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center">
                  <MdEmail className="mr-2 text-gray-400" />
                  <p className="text-gray-900">{user.email || "N/A"}</p>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                <div className="flex items-center">
                  <MdPhone className="mr-2 text-gray-400" />
                  <p className="text-gray-900">{user.phoneNumber || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="p-6 bg-purple-50 rounded-lg">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <IoIdCard className="mr-2 text-purple-600" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">User Role</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.userRole === 'Admin'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
                  }`}>
                  {user.userRole}
                </span>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => handleShowPassword(user?.id)}
              className="inline-flex gap-2 justify-center items-center py-2 px-4 w-full text-sm font-semibold text-white rounded-lg shadow-sm transition-colors bg-slate-900 hover:bg-slate-800"
            >
              <FiLock className="text-base" />
              Update Password
            </button>
          </div>
        </div>
      </div>
      {userId && showPassword && (
        <ChangePasswordModal
          id={userId}
          onClose={() => setShowPasswod(false)}
        />
      )}
    </div>
  );
};

export default ViewUserCredentials;
