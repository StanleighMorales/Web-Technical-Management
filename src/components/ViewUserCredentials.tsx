import { MdEmail, MdPhone, MdPerson } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { IoIdCard } from "react-icons/io5";
import type { TUsers } from "../types/types";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

type ViewUserCredentialsProps = {
  user: TUsers;
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="scrollbar-none bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <MdPerson className="text-green-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Users Credentials</h2>
              <p className="text-gray-600">Complete User information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaPlus data-testid="closebutton" className="transform rotate-45 transition-all duration-200 text-2xl text-gray-400 cursor-pointer w-[32px] h-[32px] items-center justify-center rounded-full hover:text-white hover:bg-red-500 hover:rotate-180" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MdPerson className="mr-2 text-green-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{getFullName()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <p className="text-gray-900">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center">
                  <MdEmail className="text-gray-400 mr-2" />
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex items-center">
                  <MdPhone className="text-gray-400 mr-2" />
                  <p className="text-gray-900">{user.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <IoIdCard className="mr-2 text-purple-600" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.userRole === 'Admin'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
                  }`}>
                  {user.userRole}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 text-sm font-semibold shadow-sm transition-colors"
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
