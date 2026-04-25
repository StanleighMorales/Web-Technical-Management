import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import type { TItemForm, TItemList } from "../@types/types";
import { useQuery } from "@tanstack/react-query";
import { useGetItemInfo, useUpdateItem } from "../hooks/itemHooks";
import { showToast } from "./AppToast";
import {
  X,
  Pencil,
  Upload,
  Loader2,
  ImageIcon,
} from "lucide-react";

type EditItemFormProps = {
  onClose: () => void;
  id: string;
};

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 hover:bg-white focus:bg-white outline-none transition-all focus:ring-4 disabled:opacity-50 ${
    hasError
      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
  }`;

const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

export const EditItemForm = ({ onClose, id }: EditItemFormProps) => {
  const { data, isLoading, error } = useQuery(useGetItemInfo(id));
  const [originalData, setOriginalData] = useState<TItemForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate } = useUpdateItem();

  const [formData, setFormData] = useState<TItemForm>({
    serialNumber: "",
    image: null,
    itemName: "",
    itemType: "",
    itemModel: "",
    itemMake: "",
    description: "",
    category: "Electronics",
    condition: "New",
    preview: "",
  });

  useEffect(() => {
    if (data) {
      const item = data as TItemList;
      const itemData: TItemForm = {
        serialNumber: item.serialNumber || "",
        itemName: item.itemName || "",
        itemType: item.itemType || "",
        itemModel: item.itemModel || "",
        itemMake: item.itemMake || "",
        description: item.description || "",
        category: item.category || "Electronics",
        condition: item.condition || "New",
        image: null,
        preview: typeof item.image === "string" ? item.image : "",
      };
      setFormData(itemData);
      setOriginalData(itemData);
    }
  }, [data]);

  const handleChange = useMemo(
    () => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, files } = e.target as HTMLInputElement;
      if (files && files[0]) {
        setFormData((prev) => ({
          ...prev,
          image: files[0],
          preview: URL.createObjectURL(files[0]),
        }));
        setErrors((prev) => ({ ...prev, image: "" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [],
  );

  const hasChanges = useMemo(() => {
    if (!originalData) return false;
    return (
      formData.serialNumber !== originalData.serialNumber ||
      formData.itemName !== originalData.itemName ||
      formData.itemType !== originalData.itemType ||
      formData.itemModel !== originalData.itemModel ||
      formData.itemMake !== originalData.itemMake ||
      formData.description !== originalData.description ||
      formData.category !== originalData.category ||
      formData.condition !== originalData.condition ||
      formData.image !== originalData.image
    );
  }, [formData, originalData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.itemName) newErrors.itemName = "Item Name is required";
    if (!formData.itemType) newErrors.itemType = "Item Type is required";
    if (!formData.itemMake) newErrors.itemMake = "Item Make is required";
    if (!formData.itemModel) newErrors.itemModel = "Item Model is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.condition) newErrors.condition = "Condition is required";
    if (!formData.description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutate(
      {
        id,
        data: {
          serialNumber: formData.serialNumber,
          image: formData.image,
          itemName: formData.itemName,
          itemType: formData.itemType,
          itemModel: formData.itemModel,
          itemMake: formData.itemMake,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
        },
      },
      {
        onSuccess: () => {
          showToast.success("Item Updated", "Item updated successfully!");
          setTimeout(() => onClose(), 1000);
          setFormData({
            serialNumber: "",
            image: null,
            itemName: "",
            itemType: "",
            itemModel: "",
            itemMake: "",
            description: "",
            category: "",
            condition: "",
            preview: null,
          });
        },
        onError: () => {
          showToast.error("Update Failed", "Failed to update item. Please try again.");
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Item</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Update item information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-48 gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span className="text-sm font-medium text-slate-500">Loading item...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm font-medium text-rose-500">Failed to load item.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="itemName" className={labelClass}>
                    Item Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="itemName"
                    name="itemName"
                    type="text"
                    placeholder="Enter item name"
                    value={formData.itemName}
                    onChange={handleChange}
                    data-testid="edit-itemName"
                    className={inputClass(!!errors.itemName)}
                  />
                  {errors.itemName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.itemName}</p>}
                </div>

                <div>
                  <label htmlFor="serialNumber" className={labelClass}>
                    Serial Number
                  </label>
                  <input
                    id="serialNumber"
                    name="serialNumber"
                    type="text"
                    placeholder="Serial number"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    data-testid="edit-serialNumber"
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className={labelClass}>
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    data-testid="edit-category"
                    className={inputClass(!!errors.category)}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Keys">Keys</option>
                    <option value="MediaEquipment">Media Equipment</option>
                    <option value="Tools">Tools</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                  {errors.category && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="condition" className={labelClass}>
                    Condition <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    data-testid="edit-condition"
                    className={inputClass(!!errors.condition)}
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Defective">Defective</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="NeedRepair">Need Repair</option>
                  </select>
                  {errors.condition && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.condition}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="itemType" className={labelClass}>
                    Item Type <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="itemType"
                    name="itemType"
                    type="text"
                    placeholder="Enter item type"
                    value={formData.itemType}
                    onChange={handleChange}
                    data-testid="edit-itemType"
                    className={inputClass(!!errors.itemType)}
                  />
                  {errors.itemType && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.itemType}</p>}
                </div>

                <div>
                  <label htmlFor="itemModel" className={labelClass}>
                    Item Model <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="itemModel"
                    name="itemModel"
                    type="text"
                    placeholder="Enter item model"
                    value={formData.itemModel}
                    onChange={handleChange}
                    data-testid="edit-itemModel"
                    className={inputClass(!!errors.itemModel)}
                  />
                  {errors.itemModel && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.itemModel}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="itemMake" className={labelClass}>
                    Item Make <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="itemMake"
                    name="itemMake"
                    type="text"
                    placeholder="Enter item make"
                    value={formData.itemMake}
                    onChange={handleChange}
                    data-testid="edit-itemMake"
                    className={inputClass(!!errors.itemMake)}
                  />
                  {errors.itemMake && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.itemMake}</p>}
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    data-testid="edit-description"
                    className={inputClass(!!errors.description)}
                  />
                  {errors.description && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.description}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="image" className={labelClass}>
                  Item Image <span className="text-slate-300 text-[10px]">(Optional)</span>
                </label>
                <label
                  htmlFor="image"
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-dashed cursor-pointer transition-all ${
                    errors.image
                      ? "border-rose-300 bg-rose-50"
                      : "border-slate-300 bg-slate-50 hover:bg-white hover:border-blue-400"
                  }`}
                >
                  <Upload className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-400 truncate">
                    {formData.image instanceof File ? formData.image.name : "Click to upload image"}
                  </span>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    data-testid="edit-image"
                    className="hidden"
                  />
                </label>
                {errors.image && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.image}</p>}

                {formData.preview && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <img
                      src={formData.preview}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-xl shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700">Image Preview</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {formData.image instanceof File ? formData.image.name : "Current image"}
                      </p>
                    </div>
                    <ImageIcon className="h-4 w-4 text-slate-300 ml-auto flex-shrink-0" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!hasChanges}
                  data-testid="editItem-button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
