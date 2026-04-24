import type { FC } from "react";
import type { TTeacher } from "../@types/types";
import { FormattedPhoneNumber } from "./FormatedPhoneNumber";
import {
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  BadgeCheck,
  AtSign,
  Hash,
  GraduationCap,
  Layers,
} from "lucide-react";

type ViewTeacherCredentialsProps = {
  teacher: TTeacher;
  isOpen: boolean;
  onClose: () => void;
};

const ViewTeacherCredentials: FC<ViewTeacherCredentialsProps> = ({
  teacher,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getFullName = () => {
    const middleInitial = teacher.middleName
      ? `${teacher.middleName.charAt(0)}.`
      : "";
    return `${teacher.firstName} ${middleInitial} ${teacher.lastName}`
      .replace(/\s+/g, " ")
      .trim();
  };

  const initials =
    teacher.firstName && teacher.lastName
      ? `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`.toUpperCase()
      : "T";

  const isOnline =
    teacher.status?.toLowerCase() === "online" ||
    teacher.status?.toLowerCase() === "active";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {initials}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{getFullName()}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Teacher Credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="closebutton"
            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          <Section title="Personal Information" icon={<User className="h-4 w-4 text-blue-500" />}>
            <Grid>
              <Field label="Full Name" value={getFullName()} icon={<User className="h-3.5 w-3.5" />} />
              <Field label="Username" value={teacher.username} icon={<AtSign className="h-3.5 w-3.5" />} />
              <Field label="Email" value={teacher.email} icon={<Mail className="h-3.5 w-3.5" />} />
              <Field
                label="Phone Number"
                value={teacher.phoneNumber ? FormattedPhoneNumber(teacher.phoneNumber) : null}
                icon={<Phone className="h-3.5 w-3.5" />}
              />
              <Field label="ID" value={teacher.id} icon={<Hash className="h-3.5 w-3.5" />} mono full />
            </Grid>
          </Section>

          <Section title="Teacher Information" icon={<GraduationCap className="h-4 w-4 text-emerald-500" />}>
            <Grid>
              <Field label="Department" value={teacher.department} icon={<BookOpen className="h-3.5 w-3.5" />} />
              <Field label="Subject Specialization" value={teacher.subject} icon={<Layers className="h-3.5 w-3.5" />} />
            </Grid>
          </Section>

          <Section title="Account Information" icon={<BadgeCheck className="h-4 w-4 text-violet-500" />}>
            <Grid>
              <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Role
                </div>
                <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-0.5 ${
                  teacher.userRole?.toLowerCase() === "admin"
                    ? "bg-red-50 text-red-700 border-red-100"
                    : "bg-blue-50 text-blue-700 border-blue-100"
                }`}>
                  {teacher.userRole || "N/A"}
                </span>
              </div>
              <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Status
                </div>
                <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-0.5 ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {teacher.status || "N/A"}
                </span>
              </div>
            </Grid>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacherCredentials;

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
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/60">
        {icon}
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  icon,
  mono = false,
  full = false,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
  mono?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`bg-white px-4 py-3.5 flex flex-col gap-1 ${full ? "col-span-full" : ""}`}>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        {icon}
        {label}
      </div>
      <p className={`text-sm font-semibold text-slate-900 ${mono ? "font-mono" : ""}`}>
        {value || <span className="text-slate-300 font-normal italic text-xs">Not provided</span>}
      </p>
    </div>
  );
}
