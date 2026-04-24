import React, { useState } from "react";
import type { TUpdatedTeacher } from "../@types/types";
import { useUpdateTeacher } from "../hooks/userHooks";
import { X, Pencil, BookOpen, Loader2 } from "lucide-react";

type EditTeacherProps = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  department: string;
  onClose: () => void;
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 hover:bg-white focus:bg-white outline-none transition-all focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10";

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

export const EditTeacher = ({
  id,
  firstName,
  middleName,
  lastName,
  department,
  onClose,
}: EditTeacherProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useUpdateTeacher();

  const [formData, setFormData] = useState<TUpdatedTeacher>({
    firstName,
    middleName,
    lastName,
    department,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    mutate(
      { id, data: { firstName: formData.firstName, middleName: formData.middleName, lastName: formData.lastName, department: formData.department } },
      {
        onSuccess: (data) => {
          setIsSubmitting(false);
          setSuccessMessage(data.message);
          setTimeout(() => { setSuccessMessage(""); onClose(); }, 3500);
        },
        onError: (error) => {
          setIsSubmitting(false);
          setErrorMessage(error.message);
          setTimeout(() => { setErrorMessage(""); onClose(); }, 3500);
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
        className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Teacher</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Update teacher information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
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
              <label htmlFor="department" className={labelClass}>
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                placeholder="Enter department"
                value={formData.department ?? ""}
                onChange={handleInputChange}
                className={inputClass}
              />
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
};
