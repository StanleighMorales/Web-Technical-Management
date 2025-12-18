import { useState } from "react";
import { FaClock } from "react-icons/fa6";
import { BsCalendar2Date } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
type TReservationConfirmModal = {
  setShowReservationModal: (value: boolean) => void;
  handleReservationSubmit: () => void;
  borrowItemMutation: boolean;
  getreservationTimeError: string;
  getreservationDateError: string;
};

export const ReservationConfirmModal = ({
  setShowReservationModal,
  handleReservationSubmit,
  borrowItemMutation,
  getreservationTimeError,
  getreservationDateError,
}: TReservationConfirmModal) => {
  const [reservationTime, setReservationTime] = useState<string>("");
  const [reservationTimeError, setReservationTimeError] = useState<string>(
    getreservationTimeError,
  );
  const [reservationDate, setReservationDate] = useState<string>("");
  const [reservationDateError, setReservationDateError] = useState<string>(
    getreservationDateError,
  );
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowReservationModal(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            Select Reservation Date & Time
          </h2>
          <button
            onClick={() => setShowReservationModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Choose when you'd like to pick up the reserved item. Sundays are not
            available.
          </p>

          {/* Date Picker */}
          <div>
            <label
              htmlFor="reservationDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <BsCalendar2Date className="inline mr-2" />
              Reservation Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="reservationDate"
              value={reservationDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                // Check if Sunday (0 = Sunday)
                if (selectedDate.getDay() === 0) {
                  setReservationDateError(
                    "Sundays are not available for reservations",
                  );
                  setReservationDate("");
                } else {
                  setReservationDate(e.target.value);
                  setReservationDateError("");
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${reservationDateError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {reservationDateError && (
              <p className="text-red-500 text-sm mt-2">
                {reservationDateError}
              </p>
            )}
          </div>

          {/* Time Picker */}
          <div>
            <label
              htmlFor="reservationTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <FaClock className="inline mr-2" />
              Reservation Time <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">
                (7:30 AM - 8:30 PM)
              </span>
            </label>
            <input
              type="time"
              id="reservationTime"
              value={reservationTime}
              min="07:30"
              max="20:30"
              onChange={(e) => {
                setReservationTime(e.target.value);
                setReservationTimeError("");
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${reservationTimeError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {reservationTimeError && (
              <p className="text-red-500 text-sm mt-2">
                {reservationTimeError}
              </p>
            )}
          </div>

          {/* Preview */}
          {reservationDate && reservationTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Reservation:</strong>{" "}
                {new Date(reservationDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(`2000-01-01T${reservationTime}`).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  },
                )}
              </p>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowReservationModal(false);
                setReservationDate("");
                setReservationTime("07:30");
                setReservationDateError("");
                setReservationTimeError("");
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReservationSubmit}
              disabled={borrowItemMutation}
              className={`flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors ${borrowItemMutation ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {borrowItemMutation ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
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
  );
};
