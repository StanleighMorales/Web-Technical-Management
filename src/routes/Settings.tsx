import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLoggedInUser } from "../hooks/userHooks";
import { FormattedPhoneNumber } from "../components/FormatedPhoneNumber";
import SettingsSkeletonLoader from "../loader/SettingsSkeletonLoader";
import ChangePasswordModal from "../components/ChangePasswordModal";
import EditProfileModal from "../components/EditProfileModal";
import type { TUsers } from "../@types/types";
import ErrorTable from "../components/ErrorTables";
import {
  User,
  Mail,
  Phone,
  Shield,
  Pencil,
  Lock,
  BadgeCheck,
  Briefcase,
  AtSign,
  CircleUserRound,
} from "lucide-react";

export default function Settings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState<TUsers | null>(null);
  const { data, isLoading, isError } = useQuery(useLoggedInUser());

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  if (isLoading) return <SettingsSkeletonLoader />;

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

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
      : user?.username?.charAt(0)?.toUpperCase() ?? "U";

  const fullName =
    user?.firstName && user?.lastName
      ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
      : user?.username ?? "User Profile";

  const isOnline = user?.status?.toLowerCase() === "online";

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page title */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Profile</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage your account information and security.
          </p>
        </div>

        {isError ? (
          <ErrorTable />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Left panel — identity card ─────────────────────────── */}
            <div className="lg:w-72 flex-shrink-0 space-y-4">

              {/* Avatar card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center gap-3">
                {/* Avatar circle */}
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-md">
                    {initials}
                  </div>
                  <span className={`absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>

                <div>
                  <p className="font-bold text-slate-900 text-base leading-snug">{fullName}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">@{user?.username}</p>
                </div>

                {/* Role + status pills */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {user?.userRole ?? "User"}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isOnline ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {user?.status ?? "Offline"}
                  </span>
                </div>

                {/* Edit profile button */}
                <button
                  type="button"
                  onClick={() => setShowEditProfile(true)}
                  className="mt-1 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
              </div>

              {/* Security card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Security</p>
                    <p className="text-xs text-slate-400">Protect your account</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Change Password
                </button>
              </div>
            </div>

            {/* ── Right panel — detail sections ─────────────────────── */}
            <div className="flex-1 space-y-4">

              {/* Personal information */}
              <Section title="Personal Information" icon={<CircleUserRound className="h-4 w-4 text-blue-500" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                  <Field label="First Name" value={user?.firstName} icon={<User className="h-3.5 w-3.5 text-slate-400" />} />
                  <Field label="Last Name" value={user?.lastName} icon={<User className="h-3.5 w-3.5 text-slate-400" />} />
                  <Field label="Middle Name" value={user?.middleName} icon={<User className="h-3.5 w-3.5 text-slate-400" />} />
                  <Field
                    label="Phone Number"
                    value={user?.phoneNumber ? FormattedPhoneNumber(user.phoneNumber) : null}
                    icon={<Phone className="h-3.5 w-3.5 text-slate-400" />}
                  />
                </div>
              </Section>

              {/* Account information */}
              <Section title="Account Information" icon={<BadgeCheck className="h-4 w-4 text-indigo-500" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                  <Field label="Username" value={user?.username} icon={<AtSign className="h-3.5 w-3.5 text-slate-400" />} />
                  <Field label="Email" value={user?.email} icon={<Mail className="h-3.5 w-3.5 text-slate-400" />} />
                  <Field label="Role" value={user?.userRole} icon={<BadgeCheck className="h-3.5 w-3.5 text-slate-400" />} badge />
                  <Field label="Position" value={user?.position} icon={<Briefcase className="h-3.5 w-3.5 text-slate-400" />} badge />
                </div>
              </Section>

              {/* Account status */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">Account Status</p>
                  <p className="text-xs text-slate-400 mt-0.5">Your account is active and verified.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${isOnline ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-slate-300"}`} />
                  <span className={`text-sm font-semibold ${isOnline ? "text-emerald-600" : "text-slate-500"}`}>
                    {user?.status ?? "Offline"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {showChangePassword && (
        <ChangePasswordModal id={user?.id} onClose={() => setShowChangePassword(false)} />
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
            position: user?.position,
          }}
          onClose={() => setShowEditProfile(false)}
          onSubmit={handleProfileSubmit}
        />
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
  badge = false,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
  badge?: boolean;
}) {
  return (
    <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        {icon}
        {label}
      </div>
      {badge ? (
        <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {value ?? "N/A"}
        </span>
      ) : (
        <p className="text-sm font-semibold text-slate-900">
          {value ?? <span className="text-slate-400 font-normal italic text-xs">Not provided</span>}
        </p>
      )}
    </div>
  );
}
