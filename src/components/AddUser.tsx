import React, { Activity, useState } from "react";
import type { TUserFormData } from "../types/types";
import CloseButton from "./CloseButton";
import { useRegisterUser } from "../hooks/userHooks";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { SuccessAlert } from "./SuccessAlert";

type AddUserProps = {
  onClose: () => void;
};

const STEPS = [
  { id: 1, title: "Profile" },
  { id: 2, title: "Contact" },
  { id: 3, title: "Account" },
] as const;
const TOTAL_STEPS = STEPS.length;

export const AddUsers = ({ onClose }: AddUserProps) => {
  const [step, setStep] = useState<number>(1);
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [middlenameError, setMiddlenameError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [roleError, setRoleError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [formData, setFormData] = useState<TUserFormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "firstName") return setFirstnameError("");
    if (name === "lastName") return setLastnameError("");
    if (name === "middleName") return setMiddlenameError("");
    if (name === "username") return setUsernameError("");
    if (name === "email") return setEmailError("");
    if (name === "phoneNumber") return setPhoneNumberError("");
    if (name === "password") return setPasswordError("");
    if (name === "confirmPassword") return setConfirmPasswordError("");
    if (name === "role") return setRoleError("");
  };

  const { mutate } = useRegisterUser();

  const inputError = (error: string) =>
    error ? "border-rose-400 bg-rose-50/50 focus:ring-rose-400" : "border-slate-200 focus:ring-slate-400";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== TOTAL_STEPS) return;
    submitUser();
  };

  const validateStep1 = (): boolean => {
    let ok = true;
    if (!formData.firstName) {
      setFirstnameError("First name is required");
      ok = false;
    }
    if (!formData.lastName) {
      setLastnameError("Last name is required");
      ok = false;
    }
    return ok;
  };

  const validateStep2 = (): boolean => {
    let ok = true;
    if (!formData.username) {
      setUsernameError("Username is required");
      ok = false;
    }
    if (!formData.email) {
      setEmailError("Email is required");
      ok = false;
    }
    if (!formData.phoneNumber) {
      setPhoneNumberError("Phone number is required");
      ok = false;
    }
    return ok;
  };

  const validateStep3 = (): boolean => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let ok = true;
    if (!formData.role) {
      setRoleError("Role is required");
      ok = false;
    }
    if (!formData.password) {
      setPasswordError("Password is required");
      ok = false;
    } else if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Password must include: uppercase, lowercase, number, special character and be at least 8 characters long.",
      );
      ok = false;
    }
    if (!formData.confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      ok = false;
    } else if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Password does not match");
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

  const submitUser = () => {
    if (!validateStep3()) return;
    mutate(formData, {
      onSuccess: () => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          onClose();
        }, 1000);
        setFormData({
          firstName: "",
          lastName: "",
          middleName: "",
          username: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center min-h-screen p-4 sm:p-6">
        <Activity mode={showAlert ? "visible" : "hidden"}>
          <SuccessAlert message="User Created Successfully" />
        </Activity>

        <div className="w-full max-w-3xl relative animate-fadeInUp my-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                  New User
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

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(firstnameError)}`}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      data-testid="firstName"
                    />
                    <Activity mode={firstnameError ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{firstnameError}</p>
                    </Activity>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(lastnameError)}`}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      data-testid="lastName"
                    />
                    <Activity mode={lastnameError ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{lastnameError}</p>
                    </Activity>
                  </div>

                  <div>
                    <label htmlFor="middleName" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Middle Name <span className="text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(middlenameError)}`}
                      value={formData.middleName}
                      onChange={handleInputChange}
                      placeholder="Enter middle name"
                      data-testid="middleName"
                    />
                    <Activity mode={middlenameError ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{middlenameError}</p>
                    </Activity>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div>
                    <label htmlFor="username" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(usernameError)}`}
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                      data-testid="username"
                    />
                    <Activity mode={usernameError ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{usernameError}</p>
                    </Activity>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(emailError)}`}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@example.com"
                      data-testid="email"
                    />
                    <Activity mode={emailError ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{emailError}</p>
                    </Activity>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      maxLength={11}
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(phoneNumberError)}`}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="9XXXXXXXXX"
                      data-testid="phoneNumber"
                    />
                    <Activity mode={phoneNumberError ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{phoneNumberError}</p>
                    </Activity>
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <label htmlFor="password" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(passwordError)}`}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        data-testid="password"
                      />
                      {formData.password.length > 0 &&
                        (showPassword ? (
                          <FaEye
                            onClick={() => setShowPassword(false)}
                            className="absolute top-9 right-3 text-lg text-slate-400 cursor-pointer"
                            aria-label="Hide password"
                          />
                        ) : (
                          <FaEyeSlash
                            onClick={() => setShowPassword(true)}
                            className="absolute top-9 right-3 text-lg text-slate-400 cursor-pointer"
                            aria-label="Show password"
                          />
                        ))}
                      <Activity mode={passwordError ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{passwordError}</p>
                      </Activity>
                    </div>

                    <div className="relative">
                      <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(confirmPasswordError)}`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        data-testid="confirmPassword"
                      />
                      {formData.confirmPassword.length > 0 &&
                        (showConfirmPassword ? (
                          <FaEye
                            onClick={() => setShowConfirmPassword(false)}
                            className="absolute top-9 right-3 text-lg text-slate-400 cursor-pointer"
                            aria-label="Hide password"
                          />
                        ) : (
                          <FaEyeSlash
                            onClick={() => setShowConfirmPassword(true)}
                            className="absolute top-9 right-3 text-lg text-slate-400 cursor-pointer"
                            aria-label="Show password"
                          />
                        ))}
                      <Activity mode={confirmPasswordError ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{confirmPasswordError}</p>
                      </Activity>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="role" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Role <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="role"
                        name="role"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(roleError)}`}
                        value={formData.role}
                        onChange={handleInputChange}
                        data-testid="role"
                      >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                      </select>
                      <Activity mode={roleError ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{roleError}</p>
                      </Activity>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="px-4 py-2.5 text-slate-600 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors cursor-pointer"
                      data-testid="addUser-back"
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
                      data-testid="addUser-next"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors cursor-pointer"
                      data-testid="button-user"
                    >
                      Save User
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
