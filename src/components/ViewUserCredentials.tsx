import { X, User, Mail, Phone, AtSign, BadgeCheck, Briefcase, Activity, Hash } from "lucide-react";
import type { TUsers } from "../@types/types";
// import { useState } from "react";
// import ChangePasswordModal from "./ChangePasswordModal";
import { FormattedPhoneNumber } from "./FormatedPhoneNumber";

type TNewUserTyps = Omit<TUsers, "course" | "year" | "section">;

type ViewUserCredentialsProps = {
    user: TNewUserTyps;
    isOpen: boolean;
    onClose: () => void;
};

const ViewUserCredentials = ({ user, isOpen, onClose }: ViewUserCredentialsProps) => {
    if (!isOpen) return null;

    // const [userId, setUserId] = useState<string>("");
    // const [showPassword, setShowPassword] = useState<boolean>(false);

    // const handleShowPassword = (id: string) => {
    //     setUserId(id);
    //     setShowPassword(true);
    // };

    const fullName = [user.firstName, user.middleName ? `${user.middleName.charAt(0)}.` : "", user.lastName]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    const initials =
        user.firstName && user.lastName
            ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
            : user.username?.charAt(0)?.toUpperCase() ?? "U";

    const isOnline = user.status?.toLowerCase() === "online";
    const isAdmin = user.userRole === "Admin";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">User Credentials</h3>
                            <p className="text-xs text-slate-400">Complete user information</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        data-testid="closebutton"
                        className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5 scrollbar-thin">

                    {/* Identity card */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="relative shrink-0">
                            <div className="h-14 w-14 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-extrabold text-white shadow-md">
                                {initials}
                            </div>
                            <span className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-base truncate">{fullName || user.username}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">@{user.username}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isAdmin ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}>
                                    {user.userRole ?? "User"}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isOnline ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                                    {user.status ?? "Offline"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-blue-500" />
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Personal Information</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                            <InfoField icon={<Hash className="h-3.5 w-3.5" />} label="ID" value={user.id} mono />
                            <InfoField icon={<User className="h-3.5 w-3.5" />} label="Full Name" value={fullName || "N/A"} />
                            <InfoField icon={<AtSign className="h-3.5 w-3.5" />} label="Username" value={user.username} />
                            <InfoField icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={user.email} />
                            <InfoField
                                icon={<Phone className="h-3.5 w-3.5" />}
                                label="Phone Number"
                                value={user.phoneNumber ? FormattedPhoneNumber(user.phoneNumber) : null}
                            />
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-3.5 w-3.5 text-indigo-500" />
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Account Information</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                            <InfoField icon={<BadgeCheck className="h-3.5 w-3.5" />} label="Role" value={user.userRole} badge />
                            <InfoField icon={<Briefcase className="h-3.5 w-3.5" />} label="Position" value={user.position} badge />
                            <InfoField icon={<Activity className="h-3.5 w-3.5" />} label="Status" value={user.status} badge />
                        </div>
                    </div>

                    {/* Update Password — commented out until ready */}
                    {/* <button
                        type="button"
                        onClick={() => handleShowPassword(user?.id)}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <Lock className="h-4 w-4" />
                        Update Password
                    </button> */}
                </div>
            </div>

            {/* {userId && showPassword && (
                <ChangePasswordModal id={userId} onClose={() => setShowPassword(false)} />
            )} */}
        </div>
    );
};

export default ViewUserCredentials;

// ── Sub-component ────────────────────────────────────────────────────────────

function InfoField({
    icon,
    label,
    value,
    badge = false,
    mono = false,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
    badge?: boolean;
    mono?: boolean;
}) {
    return (
        <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="text-slate-400">{icon}</span>
                {label}
            </div>
            {badge ? (
                <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {value ?? "N/A"}
                </span>
            ) : (
                <p className={`text-sm font-semibold text-slate-900 break-all ${mono ? "font-mono text-xs" : ""}`}>
                    {value ?? <span className="text-slate-400 font-normal italic text-xs">Not provided</span>}
                </p>
            )}
        </div>
    );
}
