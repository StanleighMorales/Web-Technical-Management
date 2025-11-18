import React, { useState } from "react";
import type { TItemForm } from "../types/types";
import CloseButton from "./CloseButton";
import { usePostItemMutation } from "../query/post/usePostItemMutation";
import { SuccessAlert } from "./SuccessAlert";
type AddItemFormProps = {
  onClose: () => void;
};

const AddItemForm = ({ onClose }: AddItemFormProps) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [itemNameError, setItemNameError] = useState<string>("");
  const [itemModelError, setItemModelError] = useState<string>("");
  const [serialNumberError, setSerialNumberError] = useState<string>("");
  const [itemMakeError, setItemMakeError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
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

  const { mutate } = usePostItemMutation();

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
      if (name === "Image") setImageError("");
      if (name === "itemMake") setItemMakeError("");
      if (name === "itemModel") setItemModelError("");
      if (name === "description") setDescriptionError("");
      if (name === "image") setImageError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (
      !formData.itemName &&
      !formData.serialNumber &&
      !formData.itemType &&
      !formData.itemModel &&
      !formData.itemMake &&
      !formData.description &&
      formData.image == null
    ) {
      setItemNameError("Item Name is required");
      setSerialNumberError("Serial Num is required");
      setImageError("Image is required");
      setItemMakeError("Item Make is required");
      setItemModelError("Item Model is required");
      setDescriptionError("Description is required");
      hasError = true;
    }

    if (!formData.itemName) {
      setItemNameError("Item Name is required");
      hasError = true;
    }

    if (!formData.serialNumber) {
      setSerialNumberError("Serial Num is required");
      hasError = true;
    }

    if (!formData.image) {
      setImageError("Image is required");
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        {showAlert && <SuccessAlert message={"Item Created Successfully"} />}
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative animate-fadeInUp">
          <button
            className="absolute top-4 right-4 text-2xl text-[#64748b] hover:text-[#2563eb] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseButton onClick={onClose} />
          </button>
          <h2 className="text-3xl font-extrabold text-[#1e293b] mb-6 text-center tracking-tight">
            New Item
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            {" "}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="itemName"
                  className="block text-[#2563eb] font-semibold mb-1"
                >
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${
                    formData.itemName === "" && itemNameError
                      ? "border-red-500"
                      : itemNameError
                        ? "border-red-500"
                        : ""
                  }`}
                  type="text"
                  id="itemName"
                  name="itemName"
                  placeholder="Enter item name"
                  value={formData.itemName}
                  onChange={handleChange}
                  data-testid="itemName"
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
                  className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg" ${
                    formData.serialNumber === "" && serialNumberError
                      ? "border-red-500"
                      : serialNumberError
                        ? "border-red-500"
                        : ""
                  }`}
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  placeholder="Enter serial number"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  data-testid="serialNumber"
                />
                {serialNumberError && (
                  <p className="text-red-500 text-sm mt-1">
                    {serialNumberError}
                  </p>
                )}
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
                  className={
                    "w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg"
                  }
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  data-testid="category"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Keys">Keys</option>
                  <option value="MediaEquipment">Media Equipment</option>
                  <option value="Tools">Tools</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="condition"
                  className="block text-[#2563eb] font-semibold mb-1"
                >
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  className={
                    "w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg"
                  }
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  data-testid="condition"
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Defective">Defective</option>
                  <option value="Refurbished">Refurbished</option>
                  <option value="NeedRepair">Need Repair</option>
                </select>
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
                <select
                  className="w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg"
                  id="itemType"
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleChange}
                  data-testid="itemType"
                >
                  <option value="Mouse">Mouse</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Extension">Extension</option>
                  <option value="Cable">Cable</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="itemModel"
                  className="block text-[#2563eb] font-semibold mb-1"
                >
                  Item Model <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${
                    formData.itemModel === "" && itemModelError
                      ? "border-red-500"
                      : itemModelError
                        ? "border-red-500"
                        : ""
                  }`}
                  type="text"
                  id="itemModel"
                  name="itemModel"
                  placeholder="Enter item model"
                  value={formData.itemModel}
                  onChange={handleChange}
                  data-testid="itemModel"
                />
                {itemModelError && (
                  <p className="text-red-500 text-sm mt-1">{itemModelError}</p>
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
                  className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${
                    formData.itemMake === "" && itemMakeError
                      ? "border-red-500"
                      : itemMakeError
                        ? "border-red-500"
                        : ""
                  }`}
                  type="text"
                  id="itemMake"
                  name="itemMake"
                  placeholder="Enter item make"
                  value={formData.itemMake}
                  onChange={handleChange}
                  data-testid="itemMake"
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
                  className={`w-full px-4 py-3 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg ${
                    formData.description === "" && descriptionError
                      ? "border-red-500"
                      : descriptionError
                        ? "border-red-500"
                        : ""
                  }`}
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  data-testid="description"
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
                  Item Image
                </label>
                <input
                  className={`w-full px-4 py-2 rounded-xl border border-[#e0e7ef] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-base ${
                    formData.image === null && imageError
                      ? "border-red-500"
                      : imageError
                        ? "border-red-500"
                        : ""
                  }`}
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  data-testid="image"
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
                className="px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-150 flex items-center gap-2 cursor-pointer"
                data-testid="addItem-button"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddItemForm;
