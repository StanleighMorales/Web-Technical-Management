import { useState } from "react";
import type { TBorrowItemData } from "../@types/types";
import { useBorrowItem } from "../hooks/itemHooks";
import { showToast } from "./AppToast";
import {
  ScanLine,
  User,
  Building2,
  Phone,
  Target,
  UserCheck,
  DoorOpen,
  Calendar,
  MessageSquare,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";

export const BorrowItemForm = ({
  prefilledItemId: _prefilledItemId,
  prefilledItemName: _prefilledItemName,
}: {
  prefilledItemId?: string;
  prefilledItemName?: string;
  onLentItemScanned?: (lentItem: any) => void;
}) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showReservationModal, setShowReservationModal] = useState<boolean>(false);
  const [reservationDate, setReservationDate] = useState<string>("");
  const [reservationTime, setReservationTime] = useState<string>("07:30");

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState<TBorrowItemData>({
    tagUid: "",
    borrowerFirstName: "",
    borrowerLastName: "",
    organization: null,
    contactNumber: null,
    purpose: null,
    supervisorName: null,
    room: "",
    subjectTimeSchedule: "",
    reservedFor: null,
    remarks: null,
    status: null,
    guestImage: null,
  });

  const borrowItemMutation = useBorrowItem();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "" ? null : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tagUid) newErrors.tagUid = "Tag UID is required";
    if (!formData.borrowerFirstName) newErrors.borrowerFirstName = "First name is required";
    if (!formData.borrowerLastName) newErrors.borrowerLastName = "Last name is required";
    if (!formData.room) newErrors.room = "Room is required";
    if (!formData.subjectTimeSchedule) newErrors.subjectTimeSchedule = "Subject/Time/Schedule is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReservationSubmit = async () => {
    let hasError = false;
    const newErrors: Record<string, string> = {};

    if (!reservationDate) { newErrors.reservationDate = "Please select a date"; hasError = true; }
    if (!reservationTime) { newErrors.reservationTime = "Please select a time"; hasError = true; }

    if (reservationTime) {
      const [hours, minutes] = reservationTime.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      const minTime = 7 * 60 + 30;
      const maxTime = 20 * 60 + 30;
      if (timeInMinutes < minTime || timeInMinutes > maxTime) {
        newErrors.reservationTime = "Time must be between 7:30 AM and 8:30 PM";
        hasError = true;
      }
    }

    if (hasError) { setErrors((prev) => ({ ...prev, ...newErrors })); return; }

    try {
      const reservedForDateTime = `${reservationDate}T${reservationTime}:00`;
      await borrowItemMutation.mutateAsync({
        ...formData,
        reservedFor: reservedForDateTime,
        status: "Reserved",
      });

      showToast.success("Reservation Submitted", "Reservation submitted successfully!");
      setShowAlert(true);
      setTimeout(() => { setShowAlert(false); setSuccessMessage(""); }, 3000);
      resetForm();
    } catch (error: any) {
      showToast.error("Reservation Failed", error.message || "Failed to submit reservation");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    status: "Borrowed" | "Reserved" = "Borrowed",
  ) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (status === "Reserved") {
      setShowReservationModal(true);
      return;
    }

    try {
      await borrowItemMutation.mutateAsync({ ...formData, status: "Borrowed" });
      showToast.success("Borrow Request Submitted", "Borrow request submitted successfully!");
      setShowAlert(true);
      setTimeout(() => { setShowAlert(false); setSuccessMessage(""); }, 3000);
      resetForm();
    } catch (error: any) {
      showToast.error("Borrow Failed", error.message || "Failed to submit request");
    }
  };

  const resetForm = () => {
    setFormData({
      tagUid: "",
      borrowerFirstName: "",
      borrowerLastName: "",
      organization: null,
      contactNumber: null,
      purpose: null,
      supervisorName: null,
      room: "",
      subjectTimeSchedule: "",
      reservedFor: null,
      remarks: null,
      status: null,
      guestImage: null,
    });
    setShowReservationModal(false);
    setReservationDate("");
    setReservationTime("07:30");
    setErrors({});
  };

  return (
    <>
      {/* Reservation Modal */}
      {showReservationModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowReservationModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Calendar className="h-4.5 w-4.5 text-purple-500" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Set Reservation</h2>
              </div>
              <button
                onClick={() => setShowReservationModal(false)}
                className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => {
                    setReservationDate(e.target.value);
                    setErrors((prev) => ({ ...prev, reservationDate: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all ${
                    errors.reservationDate
                      ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {errors.reservationDate && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{errors.reservationDate}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={reservationTime}
                  onChange={(e) => {
                    setReservationTime(e.target.value);
                    setErrors((prev) => ({ ...prev, reservationTime: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all ${
                    errors.reservationTime
                      ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {errors.reservationTime && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{errors.reservationTime}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Time must be between 7:30 AM and 8:30 PM</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReservationSubmit}
                  disabled={borrowItemMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {borrowItemMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Confirm Reservation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

        {/* Header */}
        <div className="px-6 md:px-8 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-indigo-500" />
            Guest Borrow Form
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Fill out the form below to request equipment. Fields marked with <span className="text-rose-500">*</span> are required.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

          {/* Tag UID */}
          <div>
            <label htmlFor="tagUid" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              <ScanLine className="h-3.5 w-3.5 inline mr-1" />
              Tag UID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="tagUid"
              name="tagUid"
              placeholder="Scan or enter tag UID"
              value={formData.tagUid}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all bg-slate-50 hover:bg-white focus:bg-white ${
                errors.tagUid
                  ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                  : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
              }`}
            />
            {errors.tagUid && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.tagUid}</p>}
          </div>

          {/* Borrower name row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="borrowerFirstName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <User className="h-3.5 w-3.5 inline mr-1" />
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="borrowerFirstName"
                name="borrowerFirstName"
                placeholder="Enter first name"
                value={formData.borrowerFirstName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all bg-slate-50 hover:bg-white focus:bg-white ${
                  errors.borrowerFirstName
                    ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                }`}
              />
              {errors.borrowerFirstName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.borrowerFirstName}</p>}
            </div>

            <div>
              <label htmlFor="borrowerLastName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <User className="h-3.5 w-3.5 inline mr-1" />
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="borrowerLastName"
                name="borrowerLastName"
                placeholder="Enter last name"
                value={formData.borrowerLastName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all bg-slate-50 hover:bg-white focus:bg-white ${
                  errors.borrowerLastName
                    ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                }`}
              />
              {errors.borrowerLastName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.borrowerLastName}</p>}
            </div>
          </div>

          {/* Optional fields row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="organization" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <Building2 className="h-3.5 w-3.5 inline mr-1" />
                Organization <span className="text-slate-300 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                placeholder="Enter organization"
                value={formData.organization || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <Phone className="h-3.5 w-3.5 inline mr-1" />
                Contact Number <span className="text-slate-300 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                placeholder="Enter contact number"
                value={formData.contactNumber || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          {/* Purpose + Supervisor row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="purpose" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <Target className="h-3.5 w-3.5 inline mr-1" />
                Purpose <span className="text-slate-300 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                placeholder="Enter purpose"
                value={formData.purpose || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="supervisorName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <UserCheck className="h-3.5 w-3.5 inline mr-1" />
                Supervisor Name <span className="text-slate-300 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                id="supervisorName"
                name="supervisorName"
                placeholder="Enter supervisor name"
                value={formData.supervisorName || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          {/* Room + Schedule row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="room" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <DoorOpen className="h-3.5 w-3.5 inline mr-1" />
                Room <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="room"
                name="room"
                placeholder="Enter room"
                value={formData.room}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all bg-slate-50 hover:bg-white focus:bg-white ${
                  errors.room
                    ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                }`}
              />
              {errors.room && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.room}</p>}
            </div>

            <div>
              <label htmlFor="subjectTimeSchedule" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                Subject/Time/Schedule <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="subjectTimeSchedule"
                name="subjectTimeSchedule"
                placeholder="e.g., Math 101 - 9:00 AM - 10:00 AM"
                value={formData.subjectTimeSchedule}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all bg-slate-50 hover:bg-white focus:bg-white ${
                  errors.subjectTimeSchedule
                    ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                }`}
              />
              {errors.subjectTimeSchedule && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.subjectTimeSchedule}</p>}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="remarks" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              <MessageSquare className="h-3.5 w-3.5 inline mr-1" />
              Remarks <span className="text-slate-300 text-[10px]">(Optional)</span>
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              placeholder="Enter any additional remarks or notes"
              value={formData.remarks || ""}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white focus:bg-white resize-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, "Reserved")}
              disabled={borrowItemMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-sm shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {borrowItemMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  Submit as Reservation
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={borrowItemMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {borrowItemMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Submit Borrow Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
