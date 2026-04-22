import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import CloseButton from "./CloseButton";
import type { TItemForm, TItemList } from "../@types/types";
import { useQuery } from "@tanstack/react-query";
import { useGetItemInfo } from "../hooks/itemHooks";
import { SuccessAlert } from "./SuccessAlert";
import { ErrorAlert } from "./ErrorAlert";
import { useUpdateItem } from "../hooks/itemHooks";

type EditItemFormProps = {
  onClose: () => void;
  id: string;
};

export const EditItemForm = ({ onClose, id }: EditItemFormProps) => {
  const { data, isLoading, error } = useQuery(useGetItemInfo(id));
  const [originalData, setOriginalData] = useState<TItemForm | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showAlertFailed, setShowAlertFailed] = useState<boolean>(false);
  const [itemNameError, setItemNameError] = useState<string>("");
  const [itemTypeError, setItemTypeError] = useState<string>("");
  const [itemModelError, setItemModelError] = useState<string>("");
  const [itemMakeError, setItemMakeError] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string>("");
  const [conditionError, setConditionError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);

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
        setImageError("");
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));

        if (name === "itemName") setItemNameError("");
        if (name === "itemType") setItemTypeError("");
        if (name === "itemMake") setItemMakeError("");
        if (name === "itemModel") setItemModelError("");
        if (name === "category") setCategoryError("");
        if (name === "condition") setConditionError("");
        if (name === "description") setDescriptionError("");
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.itemName) {
      setItemNameError("Item Name is required");
      return;
    }

    if (!formData.itemType) {
      setItemTypeError("Item Type is required");
      return;
    }

    if (!formData.itemMake) {
      setItemMakeError("Item Make is required");
      return;
    }

    if (!formData.itemModel) {
      setItemModelError("Item Model is required");
      return;
    }

    if (!formData.category) {
      setCategoryError("Category is required");
      return;
    }

    if (!formData.condition) {
      setConditionError("Condition is required");
      return;
    }

    if (!formData.description) {
      setDescriptionError("Description is required");
      return;
    }

    const updateItem = {
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

    mutate(
      { id, data: updateItem },
      {
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
          setShowAlertFailed(true);
          setTimeout(() => {
            setShowAlertFailed(false);
          }, 3500);
        },
      },
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        {showAlert && <SuccessAlert message={"Item Updated Successfully"} />}
        {showAlertFailed && <ErrorAlert message={"Update Failed"} />}
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative animate-fadeInUp">
          <button
            className="absolute top-4 right-4 text-2xl text-[#64748b] hover:text-[#2563eb] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseButton onClick={onClose} />
          </button>
          <h2 className="text-3xl font-extrabold text-[#1e293b] mb-6 text-center tracking-tight">
            Edit Item
          </h2>

          {isLoading ? (
            <div className="py-16 text-center text-slate-500">Loading...</div>
          ) : error ? (
            <div className="py-16 text-center text-red-500">
              Failed to load item.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              encType="multipart/form-data"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="itemName"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${itemNameError ? "border-red-500" : ""}`}
                    type="text"
                    id="itemName"
                    name="itemName"
                    placeholder="Enter item name"
                    value={formData.itemName}
                    onChange={handleChange}
                    data-testid="edit-itemName"
                  />
                  {itemNameError && (
                    <p className="text-red-500 text-sm mt-1">{itemNameError}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="serialNumber"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg"
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    placeholder="Enter serial number"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    data-testid="edit-serialNumber"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="category"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${categoryError ? "border-red-500" : ""}`}
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    data-testid="edit-category"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Keys">Keys</option>
                    <option value="MediaEquipment">Media Equipment</option>
                    <option value="Tools">Tools</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                  {categoryError && (
                    <p className="text-red-500 text-sm mt-1">{categoryError}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="condition"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${conditionError ? "border-red-500" : ""}`}
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    data-testid="edit-condition"
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Defective">Defective</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="NeedRepair">Need Repair</option>
                  </select>
                  {conditionError && (
                    <p className="text-red-500 text-sm mt-1">
                      {conditionError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="itemType"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Item Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${itemTypeError ? "border-red-500" : ""}`}
                    type="text"
                    id="itemType"
                    name="itemType"
                    placeholder="Enter item type"
                    value={formData.itemType}
                    onChange={handleChange}
                    data-testid="edit-itemType"
                  />
                  {itemTypeError && (
                    <p className="text-red-500 text-sm mt-1">{itemTypeError}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="itemModel"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Item Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${itemModelError ? "border-red-500" : ""}`}
                    type="text"
                    id="itemModel"
                    name="itemModel"
                    placeholder="Enter item model"
                    value={formData.itemModel}
                    onChange={handleChange}
                    data-testid="edit-itemModel"
                  />
                  {itemModelError && (
                    <p className="text-red-500 text-sm mt-1">
                      {itemModelError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="itemMake"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Item Make <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${itemMakeError ? "border-red-500" : ""}`}
                    type="text"
                    id="itemMake"
                    name="itemMake"
                    placeholder="Enter item make"
                    value={formData.itemMake}
                    onChange={handleChange}
                    data-testid="edit-itemMake"
                  />
                  {itemMakeError && (
                    <p className="text-red-500 text-sm mt-1">{itemMakeError}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="description"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${descriptionError ? "border-red-500" : ""}`}
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    data-testid="edit-description"
                  />
                  {descriptionError && (
                    <p className="text-red-500 text-sm mt-1">
                      {descriptionError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="image"
                    className="block text-[#2563eb] font-semibold mb-1"
                  >
                    Item Image (optional)
                  </label>
                  <input
                    className={`w-full px-4 py-2 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-base ${imageError ? "border-red-500" : ""}`}
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    data-testid="edit-image"
                  />
                  {imageError && (
                    <p className="text-red-500 text-sm mt-1">{imageError}</p>
                  )}
                  {formData.preview && (
                    <div className="mt-2 flex justify-center">
                      <img
                        src={formData.preview}
                        alt="Preview"
                        className="h-24 rounded-xl shadow"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className={`px-8 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-150 flex items-center gap-2 cursor-pointer ${!hasChanges ? "hover:cursor-not-allowed" : ""}`}
                  data-testid="editItem-button"
                  disabled={!hasChanges}
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
