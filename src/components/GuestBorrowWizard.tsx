import { useEffect, useState } from "react";
import { useGuestBorrowWizard } from "../hooks/useGuestBorrowWizard";
import { GuestBorrowStepIndicator } from "./GuestBorrowStepIndicator";
import { WebcamCapture } from "./WebcamCapture";
import { ReviewCountdown } from "./ReviewCountdown";
import { ErrorAlert } from "./ErrorAlert";
import { BorrowSuccessModal } from "./BorrowSuccessModal";

interface GuestBorrowWizardProps {
  prefilledTagUid?: string;
  onSuccess?: () => void;
  mode?: "borrow" | "reserve";
}

const BORROW_STEPS = [
  { label: "Scan Item" },
  { label: "Guest Info" },
  { label: "Photo" },
  { label: "Review" },
];

const RESERVE_STEPS = [
  { label: "Scan Item" },
  { label: "Guest Info" },
  { label: "Schedule" },
  { label: "Photo" },
  { label: "Review" },
];

export const GuestBorrowWizard = ({
  prefilledTagUid,
  onSuccess,
  mode = "borrow",
}: GuestBorrowWizardProps) => {
  const {
    step,
    formData,
    errors,
    isSubmitting,
    isCheckingRfid,
    isCheckingName,
    scannedItem,
    submitError,
    submitSuccess,
    countdown,
    updateField,
    nextStep,
    prevStep,
    submit,
    reset,
    cancel,
  } = useGuestBorrowWizard(mode);

  const isReserve = mode === "reserve";
  const STEPS = isReserve ? RESERVE_STEPS : BORROW_STEPS;

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Pre-fill tag UID if provided
  useEffect(() => {
    if (prefilledTagUid) {
      updateField("tagUid", prefilledTagUid);
    }
  }, [prefilledTagUid]);

  // Show success modal when submission succeeds
  useEffect(() => {
    if (submitSuccess) {
      setShowSuccessModal(true);
    }
  }, [submitSuccess]);

  const handleCapture = (file: File | null) => {
    if (file) {
      updateField("guestImage", file);
      updateField("guestImagePreview", URL.createObjectURL(file));
    } else {
      updateField("guestImage", null);
      updateField("guestImagePreview", null);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-4 md:p-8 ring-1 ring-gray-100">
      {/* Success modal */}
      {showSuccessModal && (
        <BorrowSuccessModal
          title={isReserve ? "Reservation Completed" : "Borrow Completed"}
          message={isReserve ? "The guest reservation has been submitted successfully." : "The guest borrow has been submitted successfully."}
          onClose={() => {
            setShowSuccessModal(false);
            reset();
            onSuccess?.();
          }}
        />
      )}

      {/* Error alert */}
      {submitError && <ErrorAlert message={submitError} />}

      {/* Step indicator */}
      <GuestBorrowStepIndicator currentStep={step} steps={STEPS} />

      {/* Step 1: Scan Item */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Scan Item
            </h2>
            <p className="text-sm text-gray-500">
              Enter the RFID tag UID of the item to {isReserve ? "reserve" : "borrow"}. The system will
              verify availability before proceeding.
            </p>
          </div>

          {/* RFID input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RFID Tag UID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tagUid}
              onChange={(e) => {
                updateField("tagUid", e.target.value);
              }}
              onKeyDown={(e) => { if (e.key === "Enter") nextStep(); }}
              placeholder="Enter or scan RFID tag UID"
              disabled={isCheckingRfid}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                errors.tagUid || errors.rfid
                  ? "border-red-400 focus:ring-red-400 bg-red-50"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.tagUid && (
              <p className="text-red-500 text-sm mt-1">{errors.tagUid}</p>
            )}
          </div>

          {/* Checking spinner */}
          {isCheckingRfid && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking item availability…
            </div>
          )}

          {/* RFID / availability error */}
          {errors.rfid && !isCheckingRfid && (
            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-300 rounded-lg">
              <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-700">Item Unavailable</p>
                <p className="text-sm text-red-600 mt-0.5">{errors.rfid}</p>
              </div>
            </div>
          )}

          {/* Item found + available preview card */}
          {scannedItem && !errors.rfid && !isCheckingRfid && (
            <div className="flex items-center gap-4 px-4 py-3 bg-green-50 border border-green-300 rounded-lg">
              {scannedItem.image ? (
                <img
                  src={scannedItem.image}
                  alt={scannedItem.itemName}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-green-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{scannedItem.itemName}</p>
                <p className="text-xs text-gray-500 truncate">{scannedItem.serialNumber} · {scannedItem.category}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {scannedItem.status}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={nextStep}
              disabled={isCheckingRfid}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingRfid ? "Checking…" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Guest Info */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Guest Information
            </h2>
            <p className="text-sm text-gray-500">
              Fill in the guest's details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              required
              error={errors.borrowerFirstName}
            >
              <input
                type="text"
                value={formData.borrowerFirstName}
                onChange={(e) =>
                  updateField("borrowerFirstName", e.target.value)
                }
                placeholder="First name"
                className={inputClass(!!errors.borrowerFirstName)}
              />
            </FormField>

            <FormField
              label="Last Name"
              required
              error={errors.borrowerLastName}
            >
              <input
                type="text"
                value={formData.borrowerLastName}
                onChange={(e) =>
                  updateField("borrowerLastName", e.target.value)
                }
                placeholder="Last name"
                className={inputClass(!!errors.borrowerLastName)}
              />
            </FormField>

            <FormField label="Organization" error={errors.organization}>
              <input
                type="text"
                value={formData.organization ?? ""}
                onChange={(e) =>
                  updateField("organization", e.target.value || null)
                }
                placeholder="Organization (optional)"
                className={inputClass(false)}
              />
            </FormField>

            <FormField label="Contact Number" error={errors.contactNumber}>
              <input
                type="text"
                value={formData.contactNumber ?? ""}
                onChange={(e) =>
                  updateField("contactNumber", e.target.value || null)
                }
                placeholder="Contact number (optional)"
                className={inputClass(false)}
              />
            </FormField>

            <FormField label="Purpose" error={errors.purpose}>
              <input
                type="text"
                value={formData.purpose ?? ""}
                onChange={(e) =>
                  updateField("purpose", e.target.value || null)
                }
                placeholder="Purpose (optional)"
                className={inputClass(false)}
              />
            </FormField>

            <FormField label="Supervisor Name" error={errors.supervisorName}>
              <input
                type="text"
                value={formData.supervisorName ?? ""}
                onChange={(e) =>
                  updateField("supervisorName", e.target.value || null)
                }
                placeholder="Supervisor name (optional)"
                className={inputClass(false)}
              />
            </FormField>

            <FormField label="Room" required error={errors.room}>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => updateField("room", e.target.value)}
                placeholder="Room"
                className={inputClass(!!errors.room)}
              />
            </FormField>

            <FormField
              label="Subject / Time / Schedule"
              required
              error={errors.subjectTimeSchedule}
            >
              <input
                type="text"
                value={formData.subjectTimeSchedule}
                onChange={(e) =>
                  updateField("subjectTimeSchedule", e.target.value)
                }
                placeholder="e.g. MATH101 / 8:00-9:30 AM / MWF"
                className={inputClass(!!errors.subjectTimeSchedule)}
              />
            </FormField>

            <FormField label="Remarks" error={errors.remarks}>
              <input
                type="text"
                value={formData.remarks ?? ""}
                onChange={(e) =>
                  updateField("remarks", e.target.value || null)
                }
                placeholder="Remarks (optional)"
                className={inputClass(false)}
              />
            </FormField>
          </div>

          {/* Checking name spinner */}
          {isCheckingName && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking for existing active borrows…
            </div>
          )}

          {/* Duplicate guest name error */}
          {errors.duplicateName && !isCheckingName && (
            <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg">
              <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">Guest Already Borrowing</p>
                <p className="text-sm text-amber-700 mt-0.5">{errors.duplicateName}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={isCheckingName}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingName ? "Checking…" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 (borrow) / Step 3 (reserve): Schedule — reserve mode only */}
      {isReserve && step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Reservation Schedule
            </h2>
            <p className="text-sm text-gray-500">
              Set the date and time for the reservation. Reservations can only be made up to 7 days in advance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Reservation Date" required error={errors.reservedForDate}>
              <input
                type="date"
                value={formData.reservedForDate ?? ""}
                min={new Date().toISOString().split("T")[0]}
                max={(() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 7);
                  return d.toISOString().split("T")[0];
                })()}
                onChange={(e) => updateField("reservedForDate", e.target.value || null)}
                className={inputClass(!!errors.reservedForDate)}
              />
              <p className="text-xs text-gray-400 mt-1">Up to 7 days from today</p>
            </FormField>

            <FormField label="Reservation Time" required error={errors.reservedForTime}>
              <input
                type="time"
                value={formData.reservedForTime ?? "07:30"}
                min="07:30"
                max="20:30"
                onChange={(e) => updateField("reservedForTime", e.target.value || null)}
                className={inputClass(!!errors.reservedForTime)}
              />
              <p className="text-xs text-gray-400 mt-1">Between 7:30 AM and 8:30 PM</p>
            </FormField>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 (borrow) / Step 4 (reserve): Photo */}
      {((!isReserve && step === 3) || (isReserve && step === 4)) && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Guest Photo
            </h2>
            <p className="text-sm text-gray-500">
              A photo is required for guest identification.
            </p>
          </div>

          <WebcamCapture
            onCapture={handleCapture}
            capturedPreview={formData.guestImagePreview}
          />

          {/* Photo required error */}
          {errors.guestImage && (
            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-300 rounded-lg">
              <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm text-red-700">{errors.guestImage}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4 (borrow) / Step 5 (reserve): Review */}
      {((!isReserve && step === 4) || (isReserve && step === 5)) && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Review &amp; Submit
            </h2>
            <p className="text-sm text-gray-500">
              Review the details before submitting.
            </p>
          </div>

          <ReviewCountdown
            formData={formData}
            countdown={countdown}
            onManualSubmit={submit}
            onCancel={cancel}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};

// ── Helper components ──────────────────────────────────────────────────────

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
    hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-blue-500"
  }`;
}
