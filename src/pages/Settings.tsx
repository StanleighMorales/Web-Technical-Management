import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUserQuery } from "../query/get/useUserQuery";
import { FaUser, FaClock, FaPhone } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { FormattedPhoneNumber } from "../components/FormatedPhoneNumber";
import SettingsSkeletonLoader from "../loader/SettingsSkeletonLoader";
import { FiEdit3, FiLock } from "react-icons/fi";
import ChangePasswordModal from "../components/ChangePasswordModal";
import EditProfileModal from "../components/EditProfileModal";
import type { TUsers } from "../types/types";
import ErrorTable from "../components/ErrorTables";

export default function Settings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState<TUsers | null>(null);
  const {
    data,
    isLoading,
    isError,
  } = useQuery(useUserQuery());

  useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data])

  if (isLoading) {
    return <SettingsSkeletonLoader />;
  }

  function handleProfileSubmit(values: {
    firstName?: string | null;
    lastName?: string | null;
    middleName?: string | null;
    username?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  }) {
    console.info("Profile update submitted", values);
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      <div className="py-10 px-6 mx-auto w-full max-w-7xl md:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">Settings</h1>
          <p className="mt-1 text-slate-600">Manage your account information and preferences</p>
        </div>

        <div className="overflow-hidden relative rounded-2xl border shadow-xl border-white/60 bg-white/70 backdrop-blur">
          {isError ? <ErrorTable /> : <>
            <div className="py-7 px-8 from-blue-600 via-blue-700 to-indigo-700 bg-linear-to-r">
              <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <div className="flex justify-center items-center w-16 h-16 rounded-full ring-2 shadow-md bg-white/90 ring-white/40">
                      <span className="text-2xl font-bold text-blue-700">
                        {user?.firstName?.charAt(0)?.toUpperCase() ||
                          user?.username?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </span>
                    </div>
                    <span className="inline-flex absolute right-2 -bottom-6 items-center py-0.5 px-2 mt-10 font-semibold text-white rounded-full ring-1 text-[10px] bg-white/20 ring-white/40">
                      {user?.userRole || "User"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.username || "User Profile"}
                    </h2>
                    <p className="text-sm text-blue-100/90">
                      Keep your profile up to date
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    type="button"
                    className="inline-flex gap-2 items-center py-2 px-4 text-sm font-semibold text-blue-700 rounded-lg ring-1 ring-inset shadow-sm transition-colors hover:bg-white bg-white/90 ring-white/60"
                    onClick={() => setShowEditProfile(true)}
                  >
                    <FiEdit3 className="text-base" />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="inline-flex gap-2 items-center py-2 px-4 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-sm transition-colors hover:bg-blue-400"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <FiLock className="text-base" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-5 space-y-5 rounded-xl border shadow-sm border-slate-200 bg-white/70">
                  <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                      <div className="flex justify-center items-center w-10 h-10 text-blue-700 bg-blue-50 rounded-lg">
                        <FaUser />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">First Name</p>
                        <p className="font-medium text-slate-900">
                          {user?.firstName || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="flex justify-center items-center w-10 h-10 text-blue-700 bg-blue-50 rounded-lg">
                        <FaUser />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Last Name</p>
                        <p className="font-medium text-slate-900">
                          {user?.lastName || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="flex justify-center items-center w-10 h-10 text-blue-700 bg-blue-50 rounded-lg">
                        <FaUser />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Middle Name</p>
                        <p className="font-medium text-slate-900">
                          {user?.middleName || "Not Provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5 rounded-xl border shadow-sm border-slate-200 bg-white/70">
                  <h3 className="text-base font-semibold text-slate-900">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                      <div className="flex justify-center items-center w-10 h-10 text-green-700 bg-green-50 rounded-lg">
                        <CiSettings className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Username</p>
                        <p className="font-medium text-slate-900">
                          {user?.username || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="flex justify-center items-center w-10 h-10 text-purple-700 bg-purple-50 rounded-lg">
                        <MdOutlineEmail className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">
                          {user?.email || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="flex justify-center items-center w-10 h-10 text-orange-700 bg-orange-50 rounded-lg">
                        <FaClock className="text-gray-700 text-md" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Role</p>
                        <p className="font-medium text-slate-900">
                          <span className="inline-flex items-center py-0.5 px-2.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full ring-1 ring-inset ring-blue-200">
                            {user?.userRole || "User"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {user?.phoneNumber && (
                      <div className="flex gap-3 items-center">
                        <div className="flex justify-center items-center w-10 h-10 text-teal-700 bg-teal-50 rounded-lg">
                          <FaPhone />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Phone Number</p>
                          <p className="font-medium text-slate-900">
                            {FormattedPhoneNumber(user.phoneNumber)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
                <div className="flex col-span-2 justify-between items-center p-5 rounded-xl border shadow-sm border-slate-200 bg-white/70">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Account Status</h4>
                    <p className="text-sm text-slate-500">Your account is active and verified</p>
                  </div>
                  <div className="inline-flex gap-2 items-center">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium text-green-700">{user?.status}</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl border shadow-sm border-slate-200 bg-white/70">
                  <h4 className="text-base font-semibold text-slate-900">Security</h4>
                  <p className="mt-1 text-sm text-slate-500">Protect your account and data</p>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex gap-2 justify-center items-center py-2 px-4 w-full text-sm font-semibold text-white rounded-lg shadow-sm transition-colors bg-slate-900 hover:bg-slate-800"
                      onClick={() => setShowChangePassword(true)}
                    >
                      <FiLock className="text-base" />
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>}
        </div>
        {showChangePassword && (
          <ChangePasswordModal
            id={user?.id}
            onClose={() => setShowChangePassword(false)}
          />
        )}
        {showEditProfile && (
          <EditProfileModal
            initialValues={{
              id: user?.id,
              firstName: user?.firstName,
              lastName: user?.lastName,
              middleName: user?.middleName,
              username: user?.username,
              email: user?.email,
              phoneNumber: user?.phoneNumber,
              position: user?.userRole
            }}
            onClose={() => setShowEditProfile(false)}
            onSubmit={handleProfileSubmit}
          />
        )}
      </div>
    </div>
  );
}
