/**
 * BorrowLogsDetailModal — Shows detailed information about a borrow log entry
 */

import { X, User, Package, Hash, ArrowRight, Clock, MessageSquare, Calendar } from "lucide-react";
import type { TBorrowingLogs } from "../@types/types";

type BorrowLogsDetailModalProps = {
  log: TBorrowingLogs;
  isOpen: boolean;
  onClose: () => void;
};

const getStatusBadge = (status: string) => {
  const s = status?.toLowerCase() ?? "";
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
  let dotClass = "bg-slate-400";

  if (s === "borrowed" || s === "lent") {
    colorClass = "bg-blue-50 text-blue-700 border-blue-200/60";
    dotClass = "bg-blue-500";
  } else if (s === "returned") {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    dotClass = "bg-emerald-500";
  } else if (s === "reserved") {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200/60";
    dotClass = "bg-amber-500";
  } else if (s === "overdue") {
    colorClass = "bg-rose-50 text-rose-700 border-rose-200/60";
    dotClass = "bg-rose-500";
  } else if (s === "available") {
    colorClass = "bg-teal-50 text-teal-700 border-teal-200/60";
    dotClass = "bg-teal-500";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm ${colorClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
};

const getRoleBadge = (role: string) => {
  const r = role?.toLowerCase() ?? "";
  if (r === "student") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">
        Student
      </span>
    );
  }
  if (r === "teacher" || r === "faculty") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
        {role}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
      {role}
    </span>
  );
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
};

const getInitials = (name: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const avatarGradients = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-cyan-600",
];

const getAvatarGradient = (name: string | null) => {
  if (!name) return avatarGradients[0];
  const idx = name.charCodeAt(0) % avatarGradients.length;
  return avatarGradients[idx];
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <span className="mt-0.5 text-lg text-blue-500 flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
        <div className="text-sm font-semibold text-slate-800 break-words">{value || "N/A"}</div>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title, color = "text-blue-600" }: { icon: React.ReactNode; title: string; color?: string }) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${color}`}>
      <span className="text-lg">{icon}</span>
      <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
    </div>
  );
}

export default function BorrowLogsDetailModal({ log, isOpen, onClose }: BorrowLogsDetailModalProps) {
  if (!isOpen) return null;

  // Handle different possible field names for images
  const studentIdImage = log.frontStudentIdPictureUrl || (log as any).frontStudentIdPicture;
  const guestImage = log.guestImageUrl || (log as any).guestImage;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Package className="text-blue-600 text-lg" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 truncate leading-tight">
                Borrow Log Details
              </h2>
              <p className="text-xs text-slate-400 leading-tight">
                {log.itemName} • {log.itemSerialNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
          
          {/* Borrower Information */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <SectionHeading icon={<User />} title="Borrower Information" color="text-blue-600" />
            
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`h-16 w-16 rounded-full bg-gradient-to-tr ${getAvatarGradient(log.borrowerName)} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}
              >
                {getInitials(log.borrowerName)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {log.borrowerName || "Unknown Borrower"}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {getRoleBadge(log.borrowerRole)}
                  {log.studentIdNumber && (
                    <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-md">
                      ID: {log.studentIdNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Student ID Image or Guest Image */}
            {log.borrowerRole?.toLowerCase() === "student" && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Student ID Card</p>
                <div className="flex justify-center">
                  {studentIdImage ? (
                    <img
                      src={studentIdImage}
                      alt="Student ID"
                      className="max-h-48 object-contain rounded-xl shadow-sm border border-blue-100"
                      onError={(e) => { 
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 w-64 h-48">
                              <svg class="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                              </svg>
                              <p class="text-xs text-slate-400 font-medium">Image not available</p>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 w-64 h-48">
                      <svg className="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <p className="text-xs text-slate-400 font-medium">Student ID image not available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {log.borrowerRole?.toLowerCase() === "guest" && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Guest Photo</p>
                <div className="flex justify-center">
                  {guestImage ? (
                    <img
                      src={guestImage}
                      alt="Guest Photo"
                      className="max-h-48 object-contain rounded-xl shadow-sm border border-blue-100"
                      onError={(e) => { 
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 w-64 h-48">
                              <svg class="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <p class="text-xs text-slate-400 font-medium">Image not available</p>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 w-64 h-48">
                      <svg className="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-xs text-slate-400 font-medium">Guest photo not available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Item Information */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <SectionHeading icon={<Package />} title="Item Information" color="text-slate-600" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow 
                icon={<Package />} 
                label="Item Name" 
                value={log.itemName} 
              />
              <InfoRow 
                icon={<Hash />} 
                label="Serial Number" 
                value={
                  <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                    {log.itemSerialNumber}
                  </span>
                } 
              />
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
            <SectionHeading icon={<ArrowRight />} title="Status Information" color="text-amber-600" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow 
                icon={<ArrowRight />} 
                label="Previous Status" 
                value={log.previousStatus ? getStatusBadge(log.previousStatus) : "—"} 
              />
              <InfoRow 
                icon={<ArrowRight />} 
                label="Current Status" 
                value={getStatusBadge(log.currentStatus)} 
              />
            </div>
            
            {/* Status transition visual */}
            {log.previousStatus && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Status Transition</p>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  {getStatusBadge(log.previousStatus)}
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-100">
                    <ArrowRight className="h-3 w-3 text-amber-600" />
                  </div>
                  {getStatusBadge(log.currentStatus)}
                </div>
              </div>
            )}
          </div>

          {/* Timeline Information */}
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
            <SectionHeading icon={<Clock />} title="Timeline" color="text-emerald-600" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow 
                icon={<Calendar />} 
                label="Borrowed At" 
                value={
                  log.borrowedAt ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-700">
                        {formatDateTime(log.borrowedAt)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Not borrowed yet</span>
                  )
                } 
              />
              <InfoRow 
                icon={<Calendar />} 
                label="Returned At" 
                value={
                  log.returnedAt ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-emerald-700">
                        {formatDateTime(log.returnedAt)}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">
                      Not returned yet
                    </span>
                  )
                } 
              />
            </div>

            {/* Reserved For */}
            {log.reservedFor && (
              <div className="mt-4">
                <InfoRow 
                  icon={<Calendar />} 
                  label="Reserved For" 
                  value={formatDateTime(log.reservedFor)} 
                />
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
            <SectionHeading icon={<MessageSquare />} title="Additional Information" color="text-purple-600" />
            <div className="grid grid-cols-1 gap-4">
              <InfoRow 
                icon={<MessageSquare />} 
                label="Remarks" 
                value={
                  log.remarks ? (
                    <p className="text-sm text-slate-700 leading-relaxed">{log.remarks}</p>
                  ) : (
                    <span className="text-slate-400 italic">No remarks</span>
                  )
                } 
              />
              <InfoRow 
                icon={<Clock />} 
                label="Log Created At" 
                value={formatDateTime(log.createdAt)} 
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-xl hover:bg-white hover:shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}