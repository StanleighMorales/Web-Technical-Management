import React, { useState } from "react";
import CloseButton from "./CloseButton";
import type { TUpdateUsers } from "../types/types";
import { useAllUsersQuery } from "../query/get/useAllUsersQuery";
import { useQuery } from "@tanstack/react-query";
import { usePatchUserMutation } from "../query/patch/usePatchUserMutation";

type PathUserCredentials = {
  username: string,
  email: string,
  phoneNumber: string,
  lastName: string,
  middleName: string,
  firstName: string,
  position: string
}

type EditItemProps = {
  onClose(): void;
  Id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  username: string,
  email: string,
  phoneNumber: string,
  position: string;
};

export default function EditUser({ onClose, Id, firstName, lastName, middleName, username, email, phoneNumber, position }: EditItemProps) {
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [middlenameError, setMiddlenameError] = useState<string>("");
  const [roleError, setPositionError] = useState<string>("");
  const { mutate } = usePatchUserMutation()

  const [formData, setFormData] = useState<TUpdateUsers>({
    id: Id,
    firstName,
    lastName,
    middleName,
    username,
    email,
    phoneNumber,
    position,
  });

  const { data } = useQuery(useAllUsersQuery());
  if (data) console.log(data)


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "firstName") return setFirstnameError("");
    if (name === "lastName") return setLastnameError("");
    if (name === "middleName") return setMiddlenameError("");
    if (name === "position") return setPositionError("");
  };

  const PathUserProps: PathUserCredentials = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    middleName: formData.middleName,
    username: formData.username,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    position: formData.position
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ id: formData.id, formData: PathUserProps }, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.log(error.message)
      }
    })
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center animate-fadeIn bg-gray-900/60">
      <div className="relative p-8 w-full max-w-3xl bg-white rounded-3xl shadow-2xl animate-fadeInUp">
        <button
          className="absolute top-4 right-4 text-2xl transition-colors text-[#64748b] hover:text-[#2563eb]"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseButton onClick={onClose} />
        </button>
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-[#1e293b]">
          Edit User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block mb-1 font-semibold text-[#2563eb]"
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
                <p className="mt-1 text-sm text-red-500">{firstnameError}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block mb-1 font-semibold text-[#2563eb]"
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
                <p className="mt-1 text-sm text-red-500">{lastnameError}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="middleName"
                className="block mb-1 font-semibold text-[#2563eb]"
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
                placeholder="Enter middle name"
              />
              {middlenameError && (
                <p className="mt-1 text-sm text-red-500">{middlenameError}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="username"
                className="block mb-1 font-semibold text-[#2563eb]"
              >
                Username <span className="text-gray-400/50">(Optional)</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`w-full px-4 py-3 rounded-xl border ${middlenameError ? "border-red-500" : "border-[#e0e7ef]"
                  } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
              {middlenameError && (
                <p className="mt-1 text-sm text-red-500">{middlenameError}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="username"
                className="block mb-1 font-semibold text-[#2563eb]"
              >
                Email <span className="text-gray-400/50">(Optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-4 py-3 rounded-xl border ${middlenameError ? "border-red-500" : "border-[#e0e7ef]"
                  } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
              />
              {middlenameError && (
                <p className="mt-1 text-sm text-red-500">{middlenameError}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="username"
                className="block mb-1 font-semibold text-[#2563eb]"
              >
                Phone Number <span className="text-gray-400/50">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className={`w-full px-4 py-3 rounded-xl border ${middlenameError ? "border-red-500" : "border-[#e0e7ef]"
                  } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="9XXXXXXXXX"
              />
              {middlenameError && (
                <p className="mt-1 text-sm text-red-500">{middlenameError}</p>
              )}
            </div>

          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="role"
                className="block mb-1 font-semibold text-[#2563eb]"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                className={`w-full px-4 py-3 rounded-xl border ${roleError ? "border-red-500" : "border-[#e0e7ef]"
                  } bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-lg`}
                value={formData.position}
                onChange={handleInputChange}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
              {roleError && (
                <p className="mt-1 text-sm text-red-500">{roleError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="py-3 px-8 font-bold text-white bg-gradient-to-r rounded-xl shadow-lg transition-all duration-150 cursor-pointer hover:shadow-2xl hover:scale-105 from-[#2563eb] to-[#38bdf8]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
