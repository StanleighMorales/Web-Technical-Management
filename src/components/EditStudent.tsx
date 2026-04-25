import React, { useState } from "react";
import type { TStudent } from "../@types/types";
import { useUpdateStudent } from "../hooks/userHooks";
import type { TUpdateStudent } from "../@types/types";
import { showToast } from "./AppToast";
import { X, Pencil, GraduationCap, Phone, MapPin } from "lucide-react";

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 hover:bg-white focus:bg-white outline-none transition-all focus:ring-4 ${
    hasError
      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
  }`;

const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

export const EditStudent = ({
  id,
  firstName,
  middleName,
  lastName,
  studentIdNumber,
  phoneNumber,
  course,
  section,
  year,
  street,
  cityMunicipality,
  province,
  postalCode,
  username,
  email,
  userRole,
  status,
  onClose,
}: TUpdateStudent) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate } = useUpdateStudent();

  const [formData, setFormData] = useState<TStudent>({
    frontStudentIdPicture: null,
    backStudentIdPicture: null,
    studentIdNumber,
    phoneNumber,
    course,
    section,
    year,
    profilePicture: null,
    street,
    cityMunicipality,
    province,
    postalCode,
    id,
    username,
    email,
    userRole,
    status,
    lastName,
    middleName,
    firstName,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        id: formData.id,
        data: {
          frontStudentIdPicture: formData.frontStudentIdPicture,
          backStudentIdPicture: formData.backStudentIdPicture,
          studentIdNumber: formData.studentIdNumber,
          phoneNumber: formData.phoneNumber,
          course: formData.course,
          section: formData.section,
          year: formData.year,
          profilePicture: formData.profilePicture,
          street: formData.street,
          cityMunicipality: formData.cityMunicipality,
          province: formData.province,
          postalCode: formData.postalCode,
          id: formData.id,
          username: formData.username,
          email: formData.email,
          userRole: formData.userRole,
          status: formData.status,
          lastName: formData.lastName,
          middleName: formData.middleName,
          firstName: formData.firstName,
        },
      },
      {
        onSuccess: () => {
          showToast.success("Student Updated", "Student updated successfully!");
          setTimeout(() => onClose(), 1000);
        },
        onError: (error) => console.log(error.message),
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Student</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Update student information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            <FormSection title="Personal Information" icon={<GraduationCap className="h-4 w-4 text-emerald-500" />}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="firstName" className={labelClass}>
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.firstName)}
                  />
                  {errors.firstName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.firstName}</p>}
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
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.lastName)}
                  />
                  {errors.lastName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.lastName}</p>}
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
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.middleName)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="studentIdNumber" className={labelClass}>
                    Student ID Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="studentIdNumber"
                    name="studentIdNumber"
                    placeholder="Enter student ID"
                    value={formData.studentIdNumber}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.studentIdNumber)}
                  />
                  {errors.studentIdNumber && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.studentIdNumber}</p>}
                </div>
                <div>
                  <label htmlFor="course" className={labelClass}>
                    Course <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    placeholder="Enter course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.course)}
                  />
                  {errors.course && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.course}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="section" className={labelClass}>
                    Section <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    placeholder="Enter section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.section)}
                  />
                  {errors.section && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.section}</p>}
                </div>
                <div>
                  <label htmlFor="year" className={labelClass}>
                    Year Level <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    placeholder="Enter year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.year)}
                  />
                  {errors.year && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.year}</p>}
                </div>
              </div>
            </FormSection>

            <FormSection title="Contact Information" icon={<Phone className="h-4 w-4 text-blue-500" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber" className={labelClass}>
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="9XXXXXXXXX"
                    value={formData.phoneNumber}
                    maxLength={10}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.phoneNumber)}
                  />
                  {errors.phoneNumber && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="username" className={labelClass}>
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={inputClass(!!errors.username)}
                />
                {errors.username && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.username}</p>}
              </div>
            </FormSection>

            <FormSection title="Address Information" icon={<MapPin className="h-4 w-4 text-violet-500" />}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="street" className={labelClass}>
                    Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    placeholder="Enter street address"
                    value={formData.street}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.street)}
                  />
                  {errors.street && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.street}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label htmlFor="cityMunicipality" className={labelClass}>
                    City / Municipality <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cityMunicipality"
                    name="cityMunicipality"
                    placeholder="Enter city"
                    value={formData.cityMunicipality}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.cityMunicipality)}
                  />
                  {errors.cityMunicipality && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.cityMunicipality}</p>}
                </div>
                <div>
                  <label htmlFor="province" className={labelClass}>
                    Province <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    placeholder="Enter province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.province)}
                  />
                  {errors.province && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.province}</p>}
                </div>
                <div>
                  <label htmlFor="postalCode" className={labelClass}>
                    Postal Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    placeholder="Enter postal code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={inputClass(!!errors.postalCode)}
                  />
                  {errors.postalCode && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.postalCode}</p>}
                </div>
              </div>
            </FormSection>

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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm shadow-blue-200"
              >
                <Pencil className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/60">
        {icon}
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
