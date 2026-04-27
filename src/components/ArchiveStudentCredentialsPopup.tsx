import { useGetArchiveUserInfo } from "../hooks/userHooks";
import { useQuery } from "@tanstack/react-query";
import { FormattedDateTime } from "./FormattedDateTime";
import type { TArchiveStudent } from "../@types/types";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BadgeCheck,
  AtSign,
  BookOpen,
  Hash,
  Building,
  Navigation,
  Archive,
  Calendar,
  Loader2,
  CreditCard,
  ImageOff,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";

type ArchiveStudentCredentialsPopupProps = {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ArchiveStudentCredentialsPopup({
  studentId,
  isOpen,
  onClose,
}: ArchiveStudentCredentialsPopupProps) {
  const { data, isLoading, error } = useQuery(useGetArchiveUserInfo(studentId));
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex items-center justify-center h-48 gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          <span className="text-sm font-medium text-slate-500">Loading credentials...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 w-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <Archive className="h-7 w-7 text-rose-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Failed to load</h3>
          <p className="text-sm text-slate-500">Could not load archived student credentials.</p>
          <button
            onClick={onClose}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const student = data as TArchiveStudent;

  const getFullName = () => {
    const middleInitial = student.middleName ? `${student.middleName.charAt(0)}.` : "";
    return `${student.firstName} ${middleInitial} ${student.lastName}`.replace(/\s+/g, " ").trim();
  };

  const initials =
    student.firstName && student.lastName
      ? `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()
      : "S";

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
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {initials}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{getFullName()}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Archived Student Credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          <Section title="Personal Information" icon={<User className="h-4 w-4 text-blue-500" />}>
            <Grid>
              <Field label="Full Name" value={getFullName()} icon={<User className="h-3.5 w-3.5" />} />
              <Field label="Username" value={student.username} icon={<AtSign className="h-3.5 w-3.5" />} />
              <Field label="Email" value={student.email} icon={<Mail className="h-3.5 w-3.5" />} />
              <Field label="Phone Number" value={student.phoneNumber} icon={<Phone className="h-3.5 w-3.5" />} />
            </Grid>
          </Section>

          <Section title="Student Information" icon={<GraduationCap className="h-4 w-4 text-indigo-500" />}>
            <Grid>
              <Field label="Student ID" value={student.studentIdNumber} icon={<Hash className="h-3.5 w-3.5" />} mono />
              <Field label="Course" value={student.course} icon={<BookOpen className="h-3.5 w-3.5" />} />
              <Field label="Section" value={student.section} icon={<BadgeCheck className="h-3.5 w-3.5" />} />
              <Field label="Year Level" value={student.year} icon={<GraduationCap className="h-3.5 w-3.5" />} />
            </Grid>
          </Section>

          <Section title="Address Information" icon={<MapPin className="h-4 w-4 text-emerald-500" />}>
            <div className="grid grid-cols-1 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
              <Field label="Street" value={student.street} icon={<Navigation className="h-3.5 w-3.5" />} full />
              <Field label="City / Municipality" value={student.cityMunicipality} icon={<Building className="h-3.5 w-3.5" />} />
              <Field label="Province" value={student.province} icon={<MapPin className="h-3.5 w-3.5" />} />
              <Field label="Postal Code" value={student.postalCode} icon={<Hash className="h-3.5 w-3.5" />} />
            </div>
          </Section>

          <Section title="Account Information" icon={<BadgeCheck className="h-4 w-4 text-violet-500" />}>
            <Grid>
              <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Role
                </div>
                <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-0.5 ${
                  student.userRole?.toLowerCase() === "admin"
                    ? "bg-red-50 text-red-700 border-red-100"
                    : "bg-blue-50 text-blue-700 border-blue-100"
                }`}>
                  {student.userRole || "N/A"}
                </span>
              </div>
              <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Status
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-100 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {student.status || "Archived"}
                </span>
              </div>
            </Grid>
          </Section>

          <Section title="Student ID Images" icon={<CreditCard className="h-4 w-4 text-sky-500" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
              <IdImageCard
                label="Front ID"
                src={student.frontStudentIdPicture}
                onZoom={setLightboxSrc}
              />
              <IdImageCard
                label="Back ID"
                src={student.backStudentIdPicture}
                onZoom={setLightboxSrc}
              />
            </div>
          </Section>

          <Section title="Archive Information" icon={<Archive className="h-4 w-4 text-amber-500" />}>
            <div className="grid grid-cols-1 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
              <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  Archived At
                </div>
                <p className="text-sm font-semibold text-amber-700">
                  {FormattedDateTime(student.archivedAt)}
                </p>
              </div>
              <Field label="Original User ID" value={student.originalUserId} icon={<Hash className="h-3.5 w-3.5" />} mono full />
            </div>
          </Section>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-4 -right-4 h-9 w-9 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-red-500 hover:text-white transition-colors shadow-lg z-10"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={lightboxSrc}
              alt="ID enlarged"
              className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

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

function IdImageCard({
  label,
  src,
  onZoom,
}: {
  label: string;
  src?: string | null;
  onZoom: (src: string) => void;
}) {
  // Add cache busting to force browser to reload image
  const cacheBustedSrc = src ? `${src}?t=${Date.now()}` : null;
  
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
        <CreditCard className="h-3.5 w-3.5" />
        {label}
      </span>
      {cacheBustedSrc ? (
        <div
          className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer"
          onClick={() => onZoom(cacheBustedSrc)}
        >
          <img
            src={cacheBustedSrc}
            alt={label}
            className="w-full h-44 object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <ZoomIn className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-300">
          <ImageOff className="h-8 w-8" />
          <span className="text-xs font-medium">No image provided</span>
        </div>
      )}
    </div>
  );
}
