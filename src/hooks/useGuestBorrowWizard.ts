import { useState, useCallback, useRef, useEffect } from "react";
import { borrowGuestItem, getItemByRfid } from "../api/item_api";
import type { TGuestBorrowFormData, TItemList } from "../@types/types";
import { api } from "../api/axios";

type WizardErrors = Partial<Record<keyof TGuestBorrowFormData | "rfid" | "duplicateName", string>>;

interface UseGuestBorrowWizardReturn {
  step: 1 | 2 | 3 | 4 | 5;
  formData: TGuestBorrowFormData;
  errors: WizardErrors;
  isSubmitting: boolean;
  isCheckingRfid: boolean;
  isCheckingName: boolean;
  scannedItem: TItemList | null;
  submitError: string | null;
  submitSuccess: boolean;
  countdown: number;
  updateField: <K extends keyof TGuestBorrowFormData>(
    key: K,
    value: TGuestBorrowFormData[K]
  ) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  submit: () => Promise<void>;
  /** Wipes all form data and returns to step 1 (used after a successful submission). */
  reset: () => void;
  /** Returns to step 1 but keeps all form data intact (used when the user cancels mid-review). */
  cancel: () => void;
}

const makeInitialFormData = (mode: "borrow" | "reserve"): TGuestBorrowFormData => ({
  tagUid: "",
  borrowerFirstName: "",
  borrowerLastName: "",
  organization: null,
  contactNumber: null,
  purpose: null,
  supervisorName: null,
  room: "",
  subjectTimeSchedule: "",
  remarks: null,
  reservedFor: null,
  reservedForDate: null,
  reservedForTime: "07:30",
  status: mode === "reserve" ? "Pending" : "Borrowed",
  guestImage: null,
  guestImagePreview: null,
});

function validateStep(
  step: 1 | 2 | 3 | 4 | 5,
  formData: TGuestBorrowFormData,
  mode: "borrow" | "reserve"
): { errors: WizardErrors; isValid: boolean } {
  const errors: WizardErrors = {};

  if (step === 1) {
    if (!formData.tagUid.trim()) {
      errors.tagUid = "RFID tag UID is required";
    }
  } else if (step === 2) {
    if (!formData.borrowerFirstName.trim()) {
      errors.borrowerFirstName = "First name is required";
    }
    if (!formData.borrowerLastName.trim()) {
      errors.borrowerLastName = "Last name is required";
    }
    if (!formData.room.trim()) {
      errors.room = "Room is required";
    }
    if (!formData.subjectTimeSchedule.trim()) {
      errors.subjectTimeSchedule = "Subject/Time/Schedule is required";
    }
  } else if (mode === "reserve" && step === 3) {
    // Schedule step — reserve mode only
    if (!formData.reservedForDate) {
      errors.reservedForDate = "Please select a date";
    }
    if (!formData.reservedForTime) {
      errors.reservedForTime = "Please select a time";
    } else {
      const [hours, minutes] = formData.reservedForTime.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      if (timeInMinutes < 7 * 60 + 30 || timeInMinutes > 20 * 60 + 30) {
        errors.reservedForTime = "Time must be between 7:30 AM and 8:30 PM";
      }
    }
  } else if ((!mode || mode === "borrow") && step === 3) {
    // Photo step — borrow mode
    if (!formData.guestImage) {
      errors.guestImage = "A photo is required. Please capture a photo before proceeding.";
    }
  } else if (mode === "reserve" && step === 4) {
    // Photo step — reserve mode
    if (!formData.guestImage) {
      errors.guestImage = "A photo is required. Please capture a photo before proceeding.";
    }
  }
  // Last step: review — no additional validation

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export function useGuestBorrowWizard(mode: "borrow" | "reserve" = "borrow"): UseGuestBorrowWizardReturn {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [formData, setFormData] = useState<TGuestBorrowFormData>(() => makeInitialFormData(mode));
  const [errors, setErrors] = useState<WizardErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingRfid, setIsCheckingRfid] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [scannedItem, setScannedItem] = useState<TItemList | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // Guard against concurrent / duplicate submissions
  const isSubmittingRef = useRef(false);

  // Max step depends on mode: borrow = 4, reserve = 5
  const maxStep = mode === "reserve" ? 5 : 4;

  // ── Auto-submit countdown (lives in the hook, not the component) ──────────
  const COUNTDOWN_SECONDS = 10;
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  // Stable ref so the interval closure always calls the latest submit
  const submitRef = useRef<(() => Promise<void>) | undefined>(undefined);

  // Reset countdown whenever the user reaches the review step
  useEffect(() => {
    if (step === maxStep) {
      setCountdown(COUNTDOWN_SECONDS);
    }
  }, [step, maxStep]);

  // Run the interval only while on the review step and not yet submitting
  useEffect(() => {
    if (step !== maxStep || isSubmitting) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isSubmitting]);

  const updateField = <K extends keyof TGuestBorrowFormData>(
    key: K,
    value: TGuestBorrowFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for the field being updated
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Step 1 "Next" triggers an async RFID lookup before advancing.
  // Step 2 "Next" checks if the guest already has an active borrow.
  // All other steps use synchronous validation only.
  const nextStep = (): boolean => {
    const { errors: stepErrors, isValid } = validateStep(step, formData, mode);
    if (!isValid) {
      setErrors(stepErrors);
      return false;
    }

    if (step === 1) {
      setErrors({});
      setIsCheckingRfid(true);
      getItemByRfid(formData.tagUid)
        .then((item) => {
          setScannedItem(item);
          const status = item.status?.toLowerCase();
          if (status !== "available") {
            setErrors({
              rfid: `Item is not available for ${mode === "reserve" ? "reservation" : "borrowing"}. Current status: ${item.status}.`,
            });
          } else {
            setErrors({});
            setStep((prev) => (prev < maxStep ? ((prev + 1) as 1 | 2 | 3 | 4 | 5) : prev));
          }
        })
        .catch(() => {
          setScannedItem(null);
          setErrors({ rfid: "No item registered to this RFID tag. Please check the UID and try again." });
        })
        .finally(() => setIsCheckingRfid(false));
      return true;
    }

    if (step === 2) {
      setErrors({});
      setIsCheckingName(true);
      const firstName = formData.borrowerFirstName.trim().toLowerCase();
      const lastName = formData.borrowerLastName.trim().toLowerCase();

      api.get("/lentItems")
        .then((res) => {
          const allItems: any[] = res.data?.data ?? [];
          // Active = Borrowed or Pending status, no userId (guest records have no userId)
          const activeBorrows = allItems.filter((item) => {
            const status = item.status?.toLowerCase();
            const isActive = status === "borrowed" || status === "pending" || status === "approved";
            const isGuest = !item.userId && !item.borrowerUserId;
            const nameMatch =
              item.borrowerFullName?.toLowerCase().includes(firstName) &&
              item.borrowerFullName?.toLowerCase().includes(lastName);
            return isActive && isGuest && nameMatch;
          });

          if (activeBorrows.length > 0) {
            const existing = activeBorrows[0];
            setErrors({
              duplicateName: `${formData.borrowerFirstName} ${formData.borrowerLastName} already has an active borrow (${existing.itemName ?? "item"} — ${existing.status}).`,
            });
          } else {
            setErrors({});
            setStep((prev) => (prev < maxStep ? ((prev + 1) as 1 | 2 | 3 | 4 | 5) : prev));
          }
        })
        .catch(() => {
          // If the check fails, allow proceeding — don't block on a network error
          setErrors({});
          setStep((prev) => (prev < maxStep ? ((prev + 1) as 1 | 2 | 3 | 4 | 5) : prev));
        })
        .finally(() => setIsCheckingName(false));
      return true;
    }

    setErrors({});
    setStep((prev) => (prev < maxStep ? ((prev + 1) as 1 | 2 | 3 | 4 | 5) : prev));
    return true;
  };

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4 | 5) : prev));
  };

  const reset = () => {
    if (formData.guestImagePreview) {
      URL.revokeObjectURL(formData.guestImagePreview);
    }
    setStep(1);
    setFormData(makeInitialFormData(mode));
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setScannedItem(null);
    setIsCheckingName(false);
  };

  /**
   * Cancel the current transaction — returns to step 1 but preserves all
   * form data so the user doesn't have to re-enter everything.
   */
  const cancel = () => {
    setStep(1);
    setErrors({});
    setSubmitError(null);
    setIsCheckingName(false);
  };

  const submit = useCallback(async () => {
    // Prevent duplicate / simultaneous submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // For reserve mode, combine date + time into reservedFor ISO string
      const submitData: TGuestBorrowFormData = { ...formData };
      if (mode === "reserve" && formData.reservedForDate && formData.reservedForTime) {
        submitData.reservedFor = `${formData.reservedForDate}T${formData.reservedForTime}:00`;
      }
      await borrowGuestItem(submitData);
      // Set success FIRST — the component watches this to show the modal.
      // Do NOT call reset() here; the component calls it after the user
      // dismisses the success dialog so the state is still readable.
      setSubmitSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, mode]);

  // Keep the ref current so the interval closure always calls the latest version
  submitRef.current = submit;

  return {
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
  };
}
