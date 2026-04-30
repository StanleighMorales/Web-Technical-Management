import React, { useState } from "react";
import type { TUpdateUsers } from "../@types/types";
import { useUpdateUser } from "../hooks/userHooks";
import { showToast } from "./AppToast";
import { X, Pencil, Users, Loader2 } from "lucide-react";

type TPathUserTypes = Omit<TUpdateUsers, "id">;

type EditItemProps = {
  onClose(): void;
  user: TUpdateUsers;
};

type FormData = {
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  email: string;
  phoneNumber: string;
  position: string;
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 hover:bg-white focus:bg-white outline-none transition-all focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10";

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

const positions = ["Intern", "Full-Time", "Part-Time", "Head-Staff"];

export default function EditUser({ user, onClose }: EditItemProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useUpdateUser();

  const [formData, setFormData] = useState<FormData>({
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    position: user.position,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: TPathUserTypes = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      position: formData.position,
    };

    mutate(
      { id: user.id, data: payload },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          setSuccessMessage("User profile updated.");
          showToast.success("User Updated", "User profile updated successfully.");
          setTimeout(() => {
            setSuccessMessage("");
            onClose();
          }, 1500);
        },
        onError: () => {
          setIsSubmitting(false);
          setErrorMessage("You don't have permission to update this user.");
          showToast.error("Update Failed", "You don't have permission to update this user.");
          setTimeout(() => {
            setErrorMessage("");
            onClose();
          }, 1500);
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >

      <div
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit User</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Update user profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName ?? ""}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName ?? ""}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="middleName" className={labelClass}>
                Middle Name <span className="text-slate-300 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                placeholder="Enter middle name"
                value={formData.middleName ?? ""}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="username" className={labelClass}>
                Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                value={formData.username ?? ""}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={formData.email ?? ""}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className={labelClass}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="9XXXXXXXXX"
                value={formData.phoneNumber ?? ""}
                onChange={handleInputChange}
                maxLength={10}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="position" className={labelClass}>
                Position <span className="text-rose-500">*</span>
              </label>
              <select
                id="position"
                name="position"
                value={formData.position ?? ""}
                onChange={handleInputChange}
                required
                className={inputClass}
              >
                {positions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-rose-500 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
              {successMessage}
            </div>
          )}

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
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Pencil className="h-3.5 w-3.5" />
              )}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
