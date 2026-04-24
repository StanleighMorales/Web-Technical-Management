import type { TGuestBorrowFormData } from "../@types/types";

interface ReviewCountdownProps {
  formData: TGuestBorrowFormData;
  countdown: number;
  onManualSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ReviewCountdown = ({
  formData,
  countdown,
  onManualSubmit,
  onCancel,
  isSubmitting,
}: ReviewCountdownProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Countdown / action bar */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <span className="text-blue-700 font-medium text-sm">
          {isSubmitting || countdown === 0
            ? "Submitting..."
            : `Auto-submitting in ${countdown}s...`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onManualSubmit}
            disabled={isSubmitting}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Now"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Review summary */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900 text-sm">Borrow Summary</h3>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <SummaryRow label="Tag UID" value={formData.tagUid} />
          <SummaryRow
            label="Guest Name"
            value={`${formData.borrowerFirstName} ${formData.borrowerLastName}`}
          />
          {formData.organization && (
            <SummaryRow label="Organization" value={formData.organization} />
          )}
          {formData.contactNumber && (
            <SummaryRow label="Contact" value={formData.contactNumber} />
          )}
          {formData.purpose && (
            <SummaryRow label="Purpose" value={formData.purpose} />
          )}
          {formData.supervisorName && (
            <SummaryRow label="Supervisor" value={formData.supervisorName} />
          )}
          <SummaryRow label="Room" value={formData.room} />
          <SummaryRow label="Schedule" value={formData.subjectTimeSchedule} />
          <SummaryRow label="Status" value={formData.status} />
          {formData.reservedFor && (
            <SummaryRow
              label="Reserved For"
              value={new Date(formData.reservedFor).toLocaleString()}
            />
          )}
          {formData.remarks && (
            <SummaryRow label="Remarks" value={formData.remarks} />
          )}
        </div>

        {/* Guest photo thumbnail */}
        {formData.guestImagePreview ? (
          <div className="border-t border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Guest Photo</p>
            <img
              src={formData.guestImagePreview}
              alt="Guest"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
        ) : (
          <div className="border-t border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Guest Photo</p>
            <p className="text-xs text-gray-400 italic">No photo captured</p>
          </div>
        )}
      </div>
    </div>
  );
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}
