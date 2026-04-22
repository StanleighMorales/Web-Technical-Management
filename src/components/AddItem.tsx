import React, { Activity, useState } from "react";
import type { TItemForm } from "../@types/types";
import CloseButton from "./CloseButton";
import { useAddItem } from "../hooks/itemHooks";
import { SuccessAlert } from "./SuccessAlert";

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
] as const;
const TOTAL_STEPS = STEPS.length;

const AddItemForm = ({ onClose }: AddItemFormProps) => {
  const [step, setStep] = useState<number>(1);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [itemNameError, setItemNameError] = useState<string>("");
  const [itemModelError, setItemModelError] = useState<string>("");
  const [serialNumberError, setSerialNumberError] = useState<string>("");
  const [itemMakeError, setItemMakeError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [formData, setFormData] = useState<TItemForm>({
    serialNumber: "",
    image: null,
    itemName: "",
    itemType: "Mouse",
    itemModel: "",
    itemMake: "",
    description: "",
    category: "Electronics",
    condition: "New",
    preview: "",
  });

  const { mutate } = useAddItem();

  const inputError = (error: string) =>
    error ? "border-rose-400 bg-rose-50/50 focus:ring-rose-400" : "border-slate-200 focus:ring-slate-400";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        preview: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "itemName") setItemNameError("");
      if (name === "serialNumber") setSerialNumberError("");
      if (name === "itemMake") setItemMakeError("");
      if (name === "itemModel") setItemModelError("");
      if (name === "description") setDescriptionError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== TOTAL_STEPS) return;

    let hasError = false;

    if (!formData.itemName) {
      setItemNameError("Item Name is required");
      hasError = true;
    }

    if (!formData.serialNumber) {
      setSerialNumberError("Serial Num is required");
      hasError = true;
    }

    if (!formData.itemMake) {
      setItemMakeError("Item Make is required");
      hasError = true;
    }

    if (!formData.itemModel) {
      setItemModelError("Item Model is required");
      hasError = true;
    }

    if (!formData.description) {
      setDescriptionError("Description is required");
      hasError = true;
    }

    if (hasError) return;

    submitItem();
  };

  const validateStep1 = (): boolean => {
    let ok = true;
    if (!formData.itemName) {
      setItemNameError("Item Name is required");
      ok = false;
    }
    if (!formData.serialNumber) {
      setSerialNumberError("Serial Num is required");
      ok = false;
    }
    return ok;
  };

  const validateStep2 = (): boolean => {
    let ok = true;
    if (!formData.itemModel) {
      setItemModelError("Item Model is required");
      ok = false;
    }
    if (!formData.itemMake) {
      setItemMakeError("Item Make is required");
      ok = false;
    }
    if (!formData.description) {
      setDescriptionError("Description is required");
      ok = false;
    }
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

    mutate(newItem, {
      onSuccess: () => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          onClose();
        }, 3500);
        setFormData({
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
        });
      },
      onError: (error: Error) => {
        setSerialNumberError(error.message);
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center min-h-screen p-4 sm:p-6">
        <Activity mode={showAlert ? "visible" : "hidden"}>
          <SuccessAlert message="Item Created Successfully" />
        </Activity>

        <div className="w-full max-w-3xl relative animate-fadeInUp my-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
            {/* Header + Step indicator */}
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                  New Item
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <CloseButton onClick={onClose} />
                </button>
              </div>
              {/* Step indicator */}
              <div className="flex items-center gap-2" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
                {STEPS.map((s, i) => (
                  <React.Fragment key={s.id}>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${step >= s.id
                          ? "bg-blue-800 text-white"
                          : "bg-blue-200 text-blue-500"
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
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
                      type="text"
                      id="itemName"
                      name="itemName"
                      placeholder="e.g. Wireless Mouse"
                      value={formData.itemName}
                      onChange={handleChange}
                      data-testid="itemName"
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
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      placeholder="e.g. SN-12345"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      data-testid="serialNumber"
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
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      data-testid="category"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="condition" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Condition <span className="text-rose-500">*</span>
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 transition-colors"
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      data-testid="condition"
                    >
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
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
                      id="itemType"
                      name="itemType"
                      value={formData.itemType}
                      onChange={handleChange}
                      data-testid="itemType"
                    >
                      {ITEM_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="itemModel" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Item Model <span className="text-rose-500">*</span>
                    </label>
                    <input
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(itemModelError)}`}
                      type="text"
                      id="itemModel"
                      name="itemModel"
                      placeholder="e.g. MX Master 3"
                      value={formData.itemModel}
                      onChange={handleChange}
                      data-testid="itemModel"
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
                      type="text"
                      id="itemMake"
                      name="itemMake"
                      placeholder="e.g. Logitech"
                      value={formData.itemMake}
                      onChange={handleChange}
                      data-testid="itemMake"
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
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Short description"
                      value={formData.description}
                      onChange={handleChange}
                      data-testid="description"
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
                    Item Image <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <input
                      className={`flex-1 w-full px-3 py-2 rounded-lg border bg-white text-slate-700 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors`}
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      data-testid="image"
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

              {/* Footer: Back / Next or Save */}
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
                  {step < TOTAL_STEPS ? (
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddItemForm;
