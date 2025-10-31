import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUserQuery } from "../query/get/useUserQuery";
import { FaUser, FaClock, FaPhone } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { FormatedPhoneNumber } from "../components/FormatedPhoneNumber";
import SettingsSkeletonLoader from "../loader/SettingsSkeletonLoader";
import { FiEdit3, FiLock } from "react-icons/fi";
import ChangePasswordModal from "../components/ChangePasswordModal";
import EditProfileModal from "../components/EditProfileModal";
import type { TUsers } from "../types/types";

export default function Settings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState<TUsers | null>(null);
  const {
    data,
    isLoading,
    error,
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

  if (isError) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : "Failed to load."}
          </p>
        </div>
      </div>
    );
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
    <div className="min-h-screen w-full bg-linear-to-b from-slate-50 to-slate-100">
      <div className="px-6 md:px-10 py-10 w-full mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="mt-1 text-slate-600">Manage your account information and preferences</p>
        </div>

        <div className="relative rounded-2xl border border-white/60 bg-white/70 backdrop-blur shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center ring-2 ring-white/40 shadow-md">
                    <span className="text-2xl font-bold text-blue-700">
                      {user?.firstName?.charAt(0)?.toUpperCase() ||
                        user?.username?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                  <span className="absolute -bottom-5 -right-15 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white ring-1 ring-white/40">
                    {user?.userRole || "User"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username || "User Profile"}
                  </h2>
                  <p className="text-blue-100/90 text-sm">
                    Keep your profile up to date
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/90 text-blue-700 hover:bg-white px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-white/60 transition-colors"
                  onClick={() => setShowEditProfile(true)}
                >
                  <FiEdit3 className="text-base" />
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors"
                  onClick={() => setShowChangePassword(true)}
                >
                  <FiLock className="text-base" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5 rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
                      <FaUser />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">First Name</p>
                      <p className="font-medium text-slate-900">
                        {user?.firstName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
                      <FaUser />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Last Name</p>
                      <p className="font-medium text-slate-900">
                        {user?.lastName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
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

              <div className="space-y-5 rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
                      <CiSettings className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Username</p>
                      <p className="font-medium text-slate-900">
                        {user?.username || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-lg flex items-center justify-center">
                      <MdOutlineEmail className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">
                        {user?.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 text-orange-700 rounded-lg flex items-center justify-center">
                      <FaClock className="text-gray-700 text-md" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Role</p>
                      <p className="font-medium text-slate-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200">
                          {user?.userRole || "User"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {user?.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center">
                        <FaPhone />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone Number</p>
                        <p className="font-medium text-slate-900">
                          {FormatedPhoneNumber(user.phoneNumber)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">Account Status</h4>
                  <p className="text-sm text-slate-500">Your account is active and verified</p>
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium text-green-700">{user?.status}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm">
                <h4 className="text-base font-semibold text-slate-900">Security</h4>
                <p className="mt-1 text-sm text-slate-500">Protect your account and data</p>
                <div className="mt-3">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 text-sm font-semibold shadow-sm transition-colors"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <FiLock className="text-base" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
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
