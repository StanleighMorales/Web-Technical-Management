import React, { Activity, useEffect, useState } from "react";
import type { TItemForm, TRfidSession } from "../@types/types";
import CloseButton from "./CloseButton";
import { useAddItem, useCancelRfidSession, useCreateRfidSession } from "../hooks/itemHooks";
import { showToast } from "./AppToast";
import { getRfidSessionApi } from "../api/item_api";
import { Loader2, Wifi, CheckCircle2, XCircle } from "lucide-react";

const CATEGORIES = ["Electronics", "Keys", "MediaEquipment", "Tools", "Miscellaneous"] as const;
const CONDITIONS = ["New", "Good", "Defective", "Refurbished", "NeedRepair"] as const;
const ITEM_TYPES = ["Mouse", "Keyboard", "Extension", "Cable"] as const;

type AddItemFormProps = {
  onClose: () => void;
};

const STEPS = [
  { id: 1, title: "Basics" },
  { id: 2, title: "Details" },
  { id: 3, title: "Image" },
  { id: 4, title: "RFID" },
] as const;
const TOTAL_STEPS = STEPS.length;

const EMPTY_FORM: TItemForm = {
  serialNumber: "",
  image: null,
  itemName: "",
  itemType: "Mouse",
  itemModel: "",
  itemMake: "",
  description: "",
  category: "Electronics",
  condition: "New",
  preview: null,
};

const AddItemForm = ({ onClose }: AddItemFormProps) => {
  const [step, setStep] = useState<number>(1);
  const [itemNameError, setItemNameError] = useState<string>("");
  const [itemModelError, setItemModelError] = useState<string>("");
  const [serialNumberError, setSerialNumberError] = useState<string>("");
  const [itemMakeError, setItemMakeError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [formData, setFormData] = useState<TItemForm>(EMPTY_FORM);

  // RFID session state
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [rfidSession, setRfidSession] = useState<TRfidSession | null>(null);
  const [rfidStatus, setRfidStatus] = useState<"idle" | "starting" | "waiting" | "completed" | "expired" | "error">("idle");
  const [pollIntervalId, setPollIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  const { mutate: addItem } = useAddItem();
  const { mutate: createSession } = useCreateRfidSession();
  const { mutate: cancelSession } = useCancelRfidSession();

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalId) clearInterval(pollIntervalId);
    };
  }, [pollIntervalId]);

  const stopPolling = () => {
    if (pollIntervalId) {
      clearInterval(pollIntervalId);
      setPollIntervalId(null);
    }
  };

  const startPolling = (sessionId: string) => {
    const id = setInterval(async () => {
      try {
        const session: TRfidSession = await getRfidSessionApi(sessionId);
        setRfidSession(session);
        if (session.status === "Completed") {
          clearInterval(id);
          setPollIntervalId(null);
          setRfidStatus("completed");
          showToast.success("RFID Registered", `RFID tag assigned to "${session.itemName}" successfully!`);
        } else if (session.status === "Expired") {
          clearInterval(id);
          setPollIntervalId(null);
          setRfidStatus("expired");
        }
      } catch {
        clearInterval(id);
        setPollIntervalId(null);
        setRfidStatus("error");
      }
    }, 2000);
    setPollIntervalId(id);
  };

  const handleStartRfidSession = () => {
    console.log("🚀 Start RFID clicked, createdItemId:", createdItemId);
    if (!createdItemId) {
      setRfidStatus("error");
      return;
    }
    setRfidStatus("starting");
    createSession(createdItemId, {
      onSuccess: (session: TRfidSession) => {
        setRfidSession(session);
        setRfidStatus("waiting");
        startPolling(session.id);
      },
      onError: () => {
        setRfidStatus("error");
      },
    });
  };

  const handleCancelRfidSession = () => {
    stopPolling();
    if (rfidSession?.id) {
      cancelSession(rfidSession.id);
    }
    setRfidStatus("idle");
    setRfidSession(null);
  };

  const handleSkipRfid = () => {
    stopPolling();
    if (rfidSession?.id && rfidStatus === "waiting") {
      cancelSession(rfidSession.id);
    }
    showToast.success("Item Created", "Item created successfully! RFID can be assigned later.");
    setTimeout(() => onClose(), 800);
  };

  const inputError = (error: string) =>
    error ? "border-rose-400 bg-rose-50/50 focus:ring-rose-400" : "border-slate-200 focus:ring-slate-400";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        preview: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "itemName") setItemNameError("");
      if (name === "serialNumber") setSerialNumberError("");
      if (name === "itemMake") setItemMakeError("");
      if (name === "itemModel") setItemModelError("");
      if (name === "description") setDescriptionError("");
    }
  };

  const validateStep1 = (): boolean => {
    let ok = true;
    if (!formData.itemName) { setItemNameError("Item Name is required"); ok = false; }
    if (!formData.serialNumber) { setSerialNumberError("Serial Num is required"); ok = false; }
    return ok;
  };

  const validateStep2 = (): boolean => {
    let ok = true;
    if (!formData.itemModel) { setItemModelError("Item Model is required"); ok = false; }
    if (!formData.itemMake) { setItemMakeError("Item Make is required"); ok = false; }
    if (!formData.description) { setDescriptionError("Description is required"); ok = false; }
    return ok;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const submitItem = () => {
    const newItem = {
      serialNumber: formData.serialNumber,
      image: formData.image,
      itemName: formData.itemName,
      itemType: formData.itemType,
      itemModel: formData.itemModel,
      itemMake: formData.itemMake,
      description: formData.description,
      category: formData.category,
      condition: formData.condition,
    };

    addItem(newItem, {
      onSuccess: (created) => {
        console.log("✅ Item created response:", created);
        const id = created?.item?.id ?? created?.id ?? created?.data?.id ?? null;
        console.log("📦 Extracted item ID:", id);
        setCreatedItemId(id);

        // Backend already created a pending RFID session — use it directly
        if (created?.rfidSession) {
          setRfidSession(created.rfidSession);
          setRfidStatus("waiting");
          startPolling(created.rfidSession.id);
        }

        setFormData(EMPTY_FORM);
        setStep(4);
      },
      onError: (error: Error) => {
        setSerialNumberError(error.message);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;

    let hasError = false;
    if (!formData.itemName) { setItemNameError("Item Name is required"); hasError = true; }
    if (!formData.serialNumber) { setSerialNumberError("Serial Num is required"); hasError = true; }
    if (!formData.itemMake) { setItemMakeError("Item Make is required"); hasError = true; }
    if (!formData.itemModel) { setItemModelError("Item Model is required"); hasError = true; }
    if (!formData.description) { setDescriptionError("Description is required"); hasError = true; }
    if (hasError) return;

    submitItem();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center min-h-screen p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl relative animate-fadeInUp my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header + Step indicator */}
          <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">New Item</h2>
              <CloseButton onClick={onClose} />
            </div>
            <div className="flex items-center gap-2" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
              {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        step >= s.id ? "bg-blue-800 text-white" : "bg-blue-200 text-blue-500"
                      }`}
                    >
                      {s.id}
                    </span>
                    <span className={`hidden text-sm font-medium sm:inline ${step >= s.id ? "text-blue-800" : "text-slate-400"}`}>
                      {s.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span className="mx-0.5 h-0.5 w-4 rounded-full bg-slate-200 sm:w-6" aria-hidden />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Step {step} of {TOTAL_STEPS}: {STEPS[step - 1].title}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
            className="p-6 space-y-5"
            encType="multipart/form-data"
          >
            {/* Step 1: Basics */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="itemName" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Item Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(itemNameError)}`}
                    type="text" id="itemName" name="itemName"
                    placeholder="e.g. Wireless Mouse"
                    value={formData.itemName} onChange={handleChange} data-testid="itemName"
                  />
                  <Activity mode={itemNameError ? "visible" : "hidden"}>
                    <p className="text-rose-500 text-xs mt-1">{itemNameError}</p>
                  </Activity>
                </div>
                <div>
                  <label htmlFor="serialNumber" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Serial Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(serialNumberError)}`}
                    type="text" id="serialNumber" name="serialNumber"
                    placeholder="e.g. SN-12345"
                    value={formData.serialNumber} onChange={handleChange} data-testid="serialNumber"
                  />
                  <Activity mode={serialNumberError ? "visible" : "hidden"}>
                    <p className="text-rose-500 text-xs mt-1">{serialNumberError}</p>
                  </Activity>
                </div>
                <div>
                  <label htmlFor="category" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 transition-colors"
                    id="category" name="category" value={formData.category} onChange={handleChange} data-testid="category"
                  >
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="condition" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Condition <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 transition-colors"
                    id="condition" name="condition" value={formData.condition} onChange={handleChange} data-testid="condition"
                  >
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="itemType" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Item Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 transition-colors"
                    id="itemType" name="itemType" value={formData.itemType} onChange={handleChange} data-testid="itemType"
                  >
                    {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="itemModel" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Item Model <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(itemModelError)}`}
                    type="text" id="itemModel" name="itemModel"
                    placeholder="e.g. MX Master 3"
                    value={formData.itemModel} onChange={handleChange} data-testid="itemModel"
                  />
                  <Activity mode={itemModelError ? "visible" : "hidden"}>
                    <p className="text-rose-500 text-xs mt-1">{itemModelError}</p>
                  </Activity>
                </div>
                <div>
                  <label htmlFor="itemMake" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Item Make <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(itemMakeError)}`}
                    type="text" id="itemMake" name="itemMake"
                    placeholder="e.g. Logitech"
                    value={formData.itemMake} onChange={handleChange} data-testid="itemMake"
                  />
                  <Activity mode={itemMakeError ? "visible" : "hidden"}>
                    <p className="text-rose-500 text-xs mt-1">{itemMakeError}</p>
                  </Activity>
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(descriptionError)}`}
                    type="text" id="description" name="description"
                    placeholder="Short description"
                    value={formData.description} onChange={handleChange} data-testid="description"
                  />
                  <Activity mode={descriptionError ? "visible" : "hidden"}>
                    <p className="text-rose-500 text-xs mt-1">{descriptionError}</p>
                  </Activity>
                </div>
              </div>
            )}

            {/* Step 3: Image */}
            {step === 3 && (
              <div>
                <label htmlFor="image" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Item Image
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <input
                    className="flex-1 w-full px-3 py-2 rounded-lg border bg-white text-slate-700 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors"
                    type="file" id="image" name="image" accept="image/*"
                    onChange={handleChange} data-testid="image"
                  />
                  {formData.preview && (
                    <Activity mode="visible">
                      <div className="shrink-0 w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                        <img src={formData.preview} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    </Activity>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: RFID Registration */}
            {step === 4 && (
              <div className="flex flex-col items-center gap-5 py-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    rfidStatus === "completed" ? "bg-green-100" :
                    rfidStatus === "expired" || rfidStatus === "error" ? "bg-rose-100" :
                    rfidStatus === "waiting" ? "bg-blue-100" : "bg-slate-100"
                  }`}>
                    {rfidStatus === "completed" ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    ) : rfidStatus === "expired" || rfidStatus === "error" ? (
                      <XCircle className="h-8 w-8 text-rose-500" />
                    ) : rfidStatus === "waiting" || rfidStatus === "starting" ? (
                      <Wifi className="h-8 w-8 text-blue-600 animate-pulse" />
                    ) : (
                      <Wifi className="h-8 w-8 text-slate-400" />
                    )}
                  </div>

                  {rfidStatus === "idle" && (
                    <>
                      <p className="text-sm font-semibold text-slate-700">Item created successfully!</p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Optionally assign an RFID tag now. Place the tag on the reader after starting the session.
                      </p>
                    </>
                  )}
                  {rfidStatus === "starting" && (
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Starting session…
                    </p>
                  )}
                  {rfidStatus === "waiting" && rfidSession && (
                    <>
                      <p className="text-sm font-semibold text-slate-700">Waiting for RFID scan…</p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Place the RFID tag on the reader. Session expires at{" "}
                        <span className="font-medium text-slate-700">
                          {new Date(rfidSession.expiresAt).toLocaleTimeString()}
                        </span>.
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                        <span className="text-xs text-blue-600">Polling for scan…</span>
                      </div>
                    </>
                  )}
                  {rfidStatus === "completed" && (
                    <>
                      <p className="text-sm font-semibold text-green-700">RFID registered!</p>
                      <p className="text-xs text-slate-500">The tag has been assigned to this item.</p>
                    </>
                  )}
                  {rfidStatus === "expired" && (
                    <>
                      <p className="text-sm font-semibold text-rose-600">Session expired</p>
                      <p className="text-xs text-slate-500">The 5-minute window passed. Start a new session or skip.</p>
                    </>
                  )}
                  {rfidStatus === "error" && (
                    <>
                      <p className="text-sm font-semibold text-rose-600">Something went wrong</p>
                      <p className="text-xs text-slate-500">
                        {!createdItemId
                          ? "Item ID was not returned by the server. Check the console for details."
                          : "Could not start the RFID session. You can try again or skip."}
                      </p>
                    </>
                  )}
                </div>

                {/* Action buttons for RFID step */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {(rfidStatus === "idle" || rfidStatus === "expired" || rfidStatus === "error") && (
                    <button
                      type="button"
                      onClick={handleStartRfidSession}
                      className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      {rfidStatus === "idle" ? "Start RFID Session" : "Retry"}
                    </button>
                  )}
                  {rfidStatus === "waiting" && (
                    <button
                      type="button"
                      onClick={handleCancelRfidSession}
                      className="px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 text-sm font-medium rounded-lg hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      Cancel Session
                    </button>
                  )}
                  {rfidStatus !== "completed" && (
                    <button
                      type="button"
                      onClick={handleSkipRfid}
                      className="px-5 py-2.5 text-slate-600 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      Skip for Now
                    </button>
                  )}
                  {rfidStatus === "completed" && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Footer: Back / Next / Save — hidden on step 4 */}
            {step < 4 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="px-4 py-2.5 text-slate-600 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors cursor-pointer"
                      data-testid="addItem-back"
                    >
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
                <div>
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors cursor-pointer"
                      data-testid="addItem-next"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e as any)}
                      className="px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors cursor-pointer"
                      data-testid="addItem-button"
                    >
                      Save Item
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;
