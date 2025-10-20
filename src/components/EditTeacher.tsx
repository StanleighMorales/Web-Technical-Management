import React, { useState } from "react";
import CloseButton from "./CloseButton";
import type { TUpdatedTeacher } from "../types/types";
import { usePatchTeacherMutation } from "../query/patch/usePatchTeacherMutation";
import { SuccessAlert } from "./SuccessAlert";

type EditTeacherProps = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  department: string;
  onClose: () => void;
};

export const EditTeacher = ({
  id,
  firstName,
  middleName,
  lastName,
  department,
  onClose
}: EditTeacherProps) => {
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [middlenameError, setMiddlenameError] = useState<string>("");
  const [departmentError, setDepartmentError] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { mutate } = usePatchTeacherMutation();

  const [formData, setFormData] = useState<TUpdatedTeacher>({
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    department: department
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "firstName") return setFirstnameError("");
    if (name === "lastName") return setLastnameError("");
    if (name === "middleName") return setMiddlenameError("");
    if (name === "department") return setDepartmentError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTeacher = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      department: formData.department
    }

    mutate({ id, formData: updatedTeacher }, {
      onSuccess: () => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          onClose();
        }, 1500);
      },
      onError: (error) => {
        console.log(error.message);
      }
    });
  };

  return (
    <div className="fixed animate-fadeIn inset-0 z-50 flex items-center justify-center bg-gray-900/60">
      {showAlert && <SuccessAlert message="Teacher updated successfully!" />}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl relative animate-fadeInUp">
        <button
          className="absolute top-4 right-4 text-2xl text-[#64748b] hover:text-[#2563eb] transition-colors"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseButton onClick={onClose} />
        </button>
        <h2 className="text-3xl font-extrabold text-[#1e293b] mb-6 text-center tracking-tight">
          Edit Teacher
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block text-[#2563eb] font-semibold mb-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`w-full px-4 py-3 rounded-xl border ${firstnameError ? "border-red-500" : "border-[#e0e7ef]"
                  } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
              {firstnameError && (
                <p className="text-red-500 text-sm mt-1">{firstnameError}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block text-[#2563eb] font-semibold mb-1"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`w-full px-4 py-3 rounded-xl border ${lastnameError ? "border-red-500" : "border-[#e0e7ef]"
                  } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
              {lastnameError && (
                <p className="text-red-500 text-sm mt-1">{lastnameError}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="middleName"
                className="block text-[#2563eb] font-semibold mb-1"
              >
                Middle Name <span className="text-gray-400/50">(Optional)</span>
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                className={`w-full px-4 py-3 rounded-xl border ${middlenameError ? "border-red-500" : "border-[#e0e7ef]"
                  } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="Enter Middle Initial"
              />
              {middlenameError && (
                <p className="text-red-500 text-sm mt-1">{middlenameError}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="department"
                className="block text-[#2563eb] font-semibold mb-1"
              >
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="department"
                name="department"
                className={`w-full px-4 py-3 rounded-xl border ${departmentError ? "border-red-500" : "border-[#e0e7ef]"
                  } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter department"
              />
              {departmentError && (
                <p className="text-red-500 text-sm mt-1">{departmentError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-150 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
