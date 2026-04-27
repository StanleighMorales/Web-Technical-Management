import React, { Activity, useState, useEffect } from "react";
import type { TUserFormData, TUpdatedTeacher } from "../@types/types";
import CloseButton from "./CloseButton";
import { useRegisterUser, useUpdateStudent, useUpdateTeacher } from "../hooks/userHooks";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { showToast } from "./AppToast";
import { UserData } from "../utils/usersData/userData";

type AddUserProps = {
  onClose: () => void;
};

type AccountType = "SuperAdmin" | "Admin" | "Staff" | "Teacher" | "Student" | "";

const ACCOUNT_TYPE_STEP = { id: 0, title: "Account Type" };
const BASIC_STEPS = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Account Setup" },
] as const;
const TOTAL_BASIC_STEPS = BASIC_STEPS.length;

export const AddUsers = ({ onClose }: AddUserProps) => {
  const currentUser = UserData();
  const currentUserRole = currentUser.userRole;
  
  const [step, setStep] = useState<number>(0);
  const [accountType, setAccountType] = useState<AccountType>("");
  const [accountTypeError, setAccountTypeError] = useState<string>("");
  const [createdUserId, setCreatedUserId] = useState<string>("");
  const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Form errors
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [middlenameError, setMiddlenameError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Track which fields have been touched (interacted with)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  // Additional fields errors for Teacher
  const [departmentError, setDepartmentError] = useState<string>("");
  
  // Additional fields errors for Student
  const [studentIdError, setStudentIdError] = useState<string>("");
  const [courseError, setCourseError] = useState<string>("");
  const [sectionError, setSectionError] = useState<string>("");
  const [yearError, setYearError] = useState<string>("");
  const [streetError, setStreetError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [provinceError, setProvinceError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");
  
  // Basic registration form (same for all account types)
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
  
  // Additional data for Teacher
  const [teacherData, setTeacherData] = useState({
    department: "",
  });
  
  // Additional data for Student
  const [studentData, setStudentData] = useState({
    studentIdNumber: "",
    course: "",
    section: "",
    year: "",
    street: "",
    cityMunicipality: "",
    province: "",
    postalCode: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    
    // Mark field as touched when user interacts with it
    setTouchedFields((prev) => new Set(prev).add(name));
    
    // Check if this is a teacher-specific field
    if (name === "department") {
      setTeacherData((prev) => ({ ...prev, [name]: value }));
      setDepartmentError("");
      return;
    }
    
    // Check if this is a student-specific field
    if (["studentIdNumber", "course", "section", "year", "street", "cityMunicipality", "province", "postalCode"].includes(name)) {
      console.log(`Student field updated: ${name} = ${value}`);
      setStudentData((prev) => {
        const updated = { ...prev, [name]: value };
        console.log("Updated studentData:", updated);
        return updated;
      });
      if (name === "studentIdNumber") setStudentIdError("");
      if (name === "course") setCourseError("");
      if (name === "section") setSectionError("");
      if (name === "year") setYearError("");
      if (name === "street") setStreetError("");
      if (name === "cityMunicipality") setCityError("");
      if (name === "province") setProvinceError("");
      if (name === "postalCode") setPostalCodeError("");
      return;
    }
    
    // Special handling for phone number
    if (name === "phoneNumber") {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, "");
      // Limit to 11 digits
      const limitedValue = digitsOnly.slice(0, 11);
      setFormData((prev) => ({ ...prev, [name]: limitedValue }));
      setPhoneNumberError("");
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors for basic fields immediately on change
    if (name === "firstName") return setFirstnameError("");
    if (name === "lastName") return setLastnameError("");
    if (name === "middleName") return setMiddlenameError("");
    if (name === "username") return setUsernameError("");
    if (name === "email") return setEmailError("");
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    // Mark field as touched when user leaves it
    setTouchedFields((prev) => new Set(prev).add(name));
  };

  const { mutate: registerUser } = useRegisterUser();
  const { mutate: updateTeacher } = useUpdateTeacher();
  const { mutate: updateStudent } = useUpdateStudent();
  
  // Check if current user can create a specific account type
  const canCreateAccountType = (type: AccountType): boolean => {
    if (currentUserRole === "SuperAdmin") {
      return true; // SuperAdmin can create any account type
    }
    if (currentUserRole === "Admin") {
      // Admin cannot create SuperAdmin
      return type !== "SuperAdmin";
    }
    if (currentUserRole === "Staff") {
      // Staff cannot create Admin or SuperAdmin
      return type !== "Admin" && type !== "SuperAdmin";
    }
    return false; // Other roles cannot create users
  };
  
  // Clear password touched state whenever step 2 is entered (fresh start for password fields)
  useEffect(() => {
    if (step === 2) {
      // Always reset password touched-state on step entry so errors never pre-fire
      setTouchedFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete("password");
        newSet.delete("confirmPassword");
        return newSet;
      });
    }
  }, [step]);

  // Computed password errors
  const getPasswordError = () => {
    if (!formData.password) return "Password is required";
    if (formData.password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(formData.password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(formData.password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(formData.password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) return "Password must contain at least one special character";
    return "";
  };

  const getConfirmPasswordError = () => {
    if (!formData.confirmPassword) return "Confirm password is required";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    return "";
  };

  const computedPasswordError = getPasswordError();
  const computedConfirmPasswordError = getConfirmPasswordError();

  const inputError = (error: string, fieldName: string) => {
    // Only show error styling if the field has been touched
    const showError = error && touchedFields.has(fieldName);
    return showError ? "border-rose-400 bg-rose-50/50 focus:ring-rose-400" : "border-slate-200 focus:ring-slate-400";
  };
  
  const shouldShowError = (error: string, fieldName: string) => {
    // Only show error message if the field has been touched
    return error && touchedFields.has(fieldName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== TOTAL_BASIC_STEPS) return;
    submitUser();
  };

  // Validate account type selection
  const validateStep0 = (): boolean => {
    if (!accountType) {
      setAccountTypeError("Please select an account type");
      return false;
    }
    return true;
  };

  // Validate Step 1 - Basic Info
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
    if (!formData.username) {
      setUsernameError("Username is required");
      ok = false;
    }
    if (!formData.email) {
      setEmailError("Email is required");
      ok = false;
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setEmailError("Please enter a valid email address");
        ok = false;
      }
    }
    if (!formData.phoneNumber) {
      setPhoneNumberError("Phone number is required");
      ok = false;
    } else if (!formData.phoneNumber.startsWith("09")) {
      setPhoneNumberError("Phone number must start with 09");
      ok = false;
    } else if (formData.phoneNumber.length !== 11) {
      setPhoneNumberError("Phone number must be exactly 11 digits");
      ok = false;
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      setPhoneNumberError("Phone number must contain only digits");
      ok = false;
    }
    
    return ok;
  };

  // Validate Step 2 - Account Setup
  const validateStep2 = (): boolean => {
    let ok = true;
    
    if (computedPasswordError) {
      ok = false;
    }
    
    if (computedConfirmPasswordError) {
      ok = false;
    }
    
    return ok;
  };

  const goNext = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) {
      // Mark all Step 1 fields as touched so errors show
      setTouchedFields((prev) => {
        const newSet = new Set(prev);
        newSet.add("firstName");
        newSet.add("lastName");
        newSet.add("username");
        newSet.add("email");
        newSet.add("phoneNumber");
        return newSet;
      });
      return;
    }
    
    // For additional steps after account creation
    if (isAccountCreated) {
      if (accountType === "Teacher" && step === 3) {
        // Don't advance, submit will handle it
        return;
      }
      if (accountType === "Student" && step === 3) {
        // Validate academic info before going to address step
        submitStudentAcademicInfo();
        return;
      }
    }
    
    // Don't clear touched fields - keep them so validation state persists
    setStep((s) => Math.min(s + 1, TOTAL_BASIC_STEPS));
  };

  const goBack = () => {
    // Don't clear touched fields - keep them so validation state persists
    setStep((s) => Math.max(s - 1, 0));
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    if (checks.length) strength++;
    if (checks.uppercase) strength++;
    if (checks.lowercase) strength++;
    if (checks.number) strength++;
    if (checks.special) strength++;
    
    if (strength <= 2) return { strength, label: "Weak", color: "bg-rose-500" };
    if (strength <= 3) return { strength, label: "Fair", color: "bg-orange-500" };
    if (strength <= 4) return { strength, label: "Good", color: "bg-yellow-500" };
    return { strength, label: "Strong", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const submitUser = () => {
    // Mark password fields as touched when trying to submit
    setTouchedFields((prev) => {
      const newSet = new Set(prev);
      newSet.add("password");
      newSet.add("confirmPassword");
      return newSet;
    });
    
    if (!validateStep2()) return;
    
    // Prevent double submission
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Create basic user account with selected role
    const registrationData: TUserFormData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName || "", // Ensure it's not undefined
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: accountType, // Use the selected account type as role
    };
    
    console.log("Registering user with data:", registrationData);
    console.log("Account type:", accountType);
    
    registerUser(registrationData, {
      onSuccess: (response) => {
        console.log("Registration success:", response);
        
        // Extract user ID from response
        const userId = response.data?.id || response.id;
        setCreatedUserId(userId);
        setIsAccountCreated(true);
        setIsSubmitting(false);
        
        // Check if we need additional steps
        if (accountType === "Teacher") {
          showToast.success("Account Created", "Basic account created! Now let's add department information.");
          setStep(3); // Go to teacher additional info step
        } else if (accountType === "Student") {
          showToast.success("Account Created", "Basic account created! Now let's add academic information.");
          setStep(3); // Go to student additional info step
        } else {
          // Admin/Staff/SuperAdmin - no additional steps needed
          showToast.success("User Created", `${accountType} account created successfully!`);
          setTimeout(() => onClose(), 2000);
          resetForm();
        }
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        console.error("Registration error - Full error:", error);
        console.error("Error response:", error.response);
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        
        // Extract detailed error message
        let errorMessage = "Failed to create user";
        
        if (error.response?.data) {
          const data = error.response.data;
          
          // Check for validation errors
          if (data.errors) {
            const errorMessages = Object.entries(data.errors)
              .map(([field, messages]: [string, any]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(", ")}`;
                }
                return `${field}: ${messages}`;
              })
              .join("; ");
            errorMessage = errorMessages;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.title) {
            errorMessage = data.title;
          } else if (typeof data === "string") {
            errorMessage = data;
          }
        }
        
        showToast.error("Registration Failed", errorMessage);
      },
    });
  };
  
  const submitTeacherDetails = () => {
    // Validate teacher fields
    let ok = true;
    if (!teacherData.department) {
      setDepartmentError("Department is required");
      ok = false;
    }
    
    if (!ok) return;
    
    // Prevent double submission
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const updateData: TUpdatedTeacher = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName || "",
      department: teacherData.department,
    };
    
    console.log("Updating teacher with data:", updateData);
    
    updateTeacher(
      { id: createdUserId, data: updateData },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          showToast.success("Teacher Profile Complete", "Teacher account fully created with department information!");
          setTimeout(() => onClose(), 2000);
          resetForm();
        },
        onError: (error: any) => {
          setIsSubmitting(false);
          console.error("Teacher update error:", error);
          showToast.error("Update Failed", "Failed to update teacher details. You can edit them later from the user management page.");
          setTimeout(() => onClose(), 2000);
          resetForm();
        },
      }
    );
  };
  
  const submitStudentAcademicInfo = () => {
    // Validate student academic fields
    let ok = true;
    if (!studentData.studentIdNumber) {
      setStudentIdError("Student ID is required");
      ok = false;
    }
    if (!studentData.course) {
      setCourseError("Course is required");
      ok = false;
    }
    if (!studentData.section) {
      setSectionError("Section is required");
      ok = false;
    }
    if (!studentData.year) {
      setYearError("Year is required");
      ok = false;
    }
    
    if (!ok) {
      console.error("Academic info validation failed:", studentData);
      return;
    }
    
    console.log("Academic info validated successfully:", studentData);
    
    // Move to address step
    setStep(4);
  };
  
  const submitStudentAddressInfo = () => {
    console.log("=== SUBMIT STUDENT ADDRESS INFO ===");
    console.log("Current studentData state:", studentData);
    console.log("Current formData state:", formData);
    console.log("Created User ID:", createdUserId);
    
    // Validate student address fields
    let ok = true;
    if (!studentData.street) {
      setStreetError("Street is required");
      ok = false;
    }
    if (!studentData.cityMunicipality) {
      setCityError("City/Municipality is required");
      ok = false;
    }
    if (!studentData.province) {
      setProvinceError("Province is required");
      ok = false;
    }
    if (!studentData.postalCode) {
      setPostalCodeError("Postal Code is required");
      ok = false;
    }
    
    if (!ok) {
      console.error("Address validation failed");
      return;
    }
    
    // Prevent double submission
    if (isSubmitting) {
      console.warn("Already submitting, preventing double submission");
      return;
    }
    setIsSubmitting(true);
    
    // Prepare update data matching EditStudent format exactly
    const updateData = {
      frontStudentIdPicture: null,
      backStudentIdPicture: null,
      studentIdNumber: studentData.studentIdNumber,
      phoneNumber: formData.phoneNumber,
      course: studentData.course,
      section: studentData.section,
      year: studentData.year,
      profilePicture: null,
      street: studentData.street,
      cityMunicipality: studentData.cityMunicipality,
      province: studentData.province,
      postalCode: studentData.postalCode,
      id: createdUserId,
      username: formData.username,
      email: formData.email,
      userRole: "Student",
      status: "Active",
      lastName: formData.lastName,
      middleName: formData.middleName,
      firstName: formData.firstName,
    };
    
    console.log("=== SENDING UPDATE REQUEST ===");
    console.log("Update data being sent:", JSON.stringify(updateData, null, 2));
    console.log("Student ID from data:", updateData.studentIdNumber);
    console.log("Course from data:", updateData.course);
    console.log("Section from data:", updateData.section);
    console.log("Year from data:", updateData.year);
    
    updateStudent(
      { id: createdUserId, data: updateData as any },
      {
        onSuccess: (response) => {
          console.log("=== UPDATE SUCCESS ===");
          console.log("Student update success response:", response);
          console.log("Response data:", response?.data);
          console.log("Response message:", response?.message);
          setIsSubmitting(false);
          showToast.success("Student Profile Complete", "Student account fully created with all details!");
          
          // Wait a bit before closing to ensure query invalidation completes
          setTimeout(() => {
            console.log("Closing modal and resetting form");
            onClose();
            resetForm();
          }, 1500);
        },
        onError: (error: any) => {
          console.error("=== UPDATE ERROR ===");
          console.error("Student update error:", error);
          console.error("Error response:", error.response);
          console.error("Error data:", error.response?.data);
          console.error("Error status:", error.response?.status);
          console.error("Error message:", error.message);
          
          // Check if it's a validation error
          if (error.response?.data?.errors) {
            console.error("Validation errors:", error.response.data.errors);
          }
          
          setIsSubmitting(false);
          
          // Show more detailed error message
          let errorMessage = "Failed to update student details.";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.title) {
            errorMessage = error.response.data.title;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          showToast.error("Update Failed", errorMessage);
          
          // Don't close the modal on error so user can see what happened
          console.log("Update failed - keeping modal open for debugging");
        },
      }
    );
  };
  
  const resetForm = () => {
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
    setTeacherData({
      department: "",
    });
    setStudentData({
      studentIdNumber: "",
      course: "",
      section: "",
      year: "",
      street: "",
      cityMunicipality: "",
      province: "",
      postalCode: "",
    });
    setAccountType("");
    setStep(0);
    setIsAccountCreated(false);
    setCreatedUserId("");
    setTouchedFields(new Set());
    setIsSubmitting(false);
  };

  // Get current step title
  const getCurrentStepTitle = () => {
    if (step === 0) return ACCOUNT_TYPE_STEP.title;
    if (step <= TOTAL_BASIC_STEPS) return BASIC_STEPS[step - 1].title;
    
    // Additional steps after account creation
    if (accountType === "Teacher" && step === 3) return "Department";
    if (accountType === "Student" && step === 3) return "Academic Information";
    if (accountType === "Student" && step === 4) return "Address Information";
    
    return "";
  };
  
  // Get total steps for current account type
  const getTotalSteps = () => {
    if (!isAccountCreated) return TOTAL_BASIC_STEPS;
    if (accountType === "Teacher") return 3; // 0, 1, 2, 3
    if (accountType === "Student") return 4; // 0, 1, 2, 3, 4
    return TOTAL_BASIC_STEPS;
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center min-h-screen p-4 sm:p-6"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-3xl relative animate-fadeInUp my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                  New User {accountType && `- ${accountType}`}
                </h2>
                <CloseButton onClick={onClose} />
              </div>
              
              {step > 0 && (
                <>
                  <div className="flex items-center gap-2" aria-label={`Step ${step} of ${getTotalSteps()}`}>
                    {!isAccountCreated ? (
                      /* Show basic steps (1-2) before account creation */
                      <>
                        {BASIC_STEPS.map((s, i) => (
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
                            {i < BASIC_STEPS.length - 1 && (
                              <span className="mx-0.5 h-0.5 w-4 rounded-full bg-slate-200 sm:w-6" aria-hidden />
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    ) : accountType === "Teacher" ? (
                      /* Show teacher steps (1-3) after account creation */
                      <>
                        {[
                          { id: 1, title: "Basic Info" },
                          { id: 2, title: "Account Setup" },
                          { id: 3, title: "Department" }
                        ].map((s, i) => (
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
                            {i < 2 && (
                              <span className="mx-0.5 h-0.5 w-4 rounded-full bg-slate-200 sm:w-6" aria-hidden />
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    ) : accountType === "Student" ? (
                      /* Show student steps (1-4) after account creation */
                      <>
                        {[
                          { id: 1, title: "Basic Info" },
                          { id: 2, title: "Account Setup" },
                          { id: 3, title: "Academic Info" },
                          { id: 4, title: "Address" }
                        ].map((s, i) => (
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
                            {i < 3 && (
                              <span className="mx-0.5 h-0.5 w-4 rounded-full bg-slate-200 sm:w-6" aria-hidden />
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Step {step} of {getTotalSteps()}: {getCurrentStepTitle()}
                  </p>
                </>
              )}
              
              {step === 0 && (
                <p className="mt-1.5 text-xs text-slate-500">
                  Select the type of account you want to create
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5" method="post">
              {/* Step 0: Account Type Selection */}
              {step === 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Account Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Super Admin Card */}
                    <button
                      type="button"
                      onClick={() => {
                        if (canCreateAccountType("SuperAdmin")) {
                          setAccountType("SuperAdmin");
                          setAccountTypeError("");
                        }
                      }}
                      disabled={!canCreateAccountType("SuperAdmin")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        !canCreateAccountType("SuperAdmin")
                          ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                          : accountType === "SuperAdmin"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-3xl mb-3 ${
                          !canCreateAccountType("SuperAdmin")
                            ? "text-slate-300"
                            : accountType === "SuperAdmin" 
                            ? "text-blue-600" 
                            : "text-slate-400"
                        }`}>
                          👑
                        </div>
                        <h3 className={`font-semibold mb-1 ${
                          !canCreateAccountType("SuperAdmin") ? "text-slate-400" : "text-slate-800"
                        }`}>Super Admin</h3>
                        <p className="text-xs text-slate-500">Super administrator</p>
                      </div>
                    </button>

                    {/* Admin Card */}
                    <button
                      type="button"
                      onClick={() => {
                        if (canCreateAccountType("Admin")) {
                          setAccountType("Admin");
                          setAccountTypeError("");
                        }
                      }}
                      disabled={!canCreateAccountType("Admin")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        !canCreateAccountType("Admin")
                          ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                          : accountType === "Admin"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-3xl mb-3 ${
                          !canCreateAccountType("Admin")
                            ? "text-slate-300"
                            : accountType === "Admin" 
                            ? "text-blue-600" 
                            : "text-slate-400"
                        }`}>
                          🔑
                        </div>
                        <h3 className={`font-semibold mb-1 ${
                          !canCreateAccountType("Admin") ? "text-slate-400" : "text-slate-800"
                        }`}>Admin</h3>
                        <p className="text-xs text-slate-500">Administrator</p>
                      </div>
                    </button>

                    {/* Staff Card */}
                    <button
                      type="button"
                      onClick={() => {
                        if (canCreateAccountType("Staff")) {
                          setAccountType("Staff");
                          setAccountTypeError("");
                        }
                      }}
                      disabled={!canCreateAccountType("Staff")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        !canCreateAccountType("Staff")
                          ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                          : accountType === "Staff"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-3xl mb-3 ${
                          !canCreateAccountType("Staff")
                            ? "text-slate-300"
                            : accountType === "Staff" 
                            ? "text-blue-600" 
                            : "text-slate-400"
                        }`}>
                          👤
                        </div>
                        <h3 className={`font-semibold mb-1 ${
                          !canCreateAccountType("Staff") ? "text-slate-400" : "text-slate-800"
                        }`}>Staff</h3>
                        <p className="text-xs text-slate-500">Staff member</p>
                      </div>
                    </button>

                    {/* Teacher Card */}
                    <button
                      type="button"
                      onClick={() => {
                        if (canCreateAccountType("Teacher")) {
                          setAccountType("Teacher");
                          setAccountTypeError("");
                        }
                      }}
                      disabled={!canCreateAccountType("Teacher")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        !canCreateAccountType("Teacher")
                          ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                          : accountType === "Teacher"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-3xl mb-3 ${
                          !canCreateAccountType("Teacher")
                            ? "text-slate-300"
                            : accountType === "Teacher" 
                            ? "text-blue-600" 
                            : "text-slate-400"
                        }`}>
                          🎓
                        </div>
                        <h3 className={`font-semibold mb-1 ${
                          !canCreateAccountType("Teacher") ? "text-slate-400" : "text-slate-800"
                        }`}>Teacher</h3>
                        <p className="text-xs text-slate-500">Faculty member</p>
                      </div>
                    </button>

                    {/* Student Card */}
                    <button
                      type="button"
                      onClick={() => {
                        if (canCreateAccountType("Student")) {
                          setAccountType("Student");
                          setAccountTypeError("");
                        }
                      }}
                      disabled={!canCreateAccountType("Student")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        !canCreateAccountType("Student")
                          ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                          : accountType === "Student"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-3xl mb-3 ${
                          !canCreateAccountType("Student")
                            ? "text-slate-300"
                            : accountType === "Student" 
                            ? "text-blue-600" 
                            : "text-slate-400"
                        }`}>
                          📚
                        </div>
                        <h3 className={`font-semibold mb-1 ${
                          !canCreateAccountType("Student") ? "text-slate-400" : "text-slate-800"
                        }`}>Student</h3>
                        <p className="text-xs text-slate-500">Enrolled student</p>
                      </div>
                    </button>
                  </div>
                  <Activity mode={accountTypeError ? "visible" : "hidden"}>
                    <p className="text-rose-500 text-sm mt-2">{accountTypeError}</p>
                  </Activity>
                </div>
              )}

              {/* Step 1: Basic Info (same for all account types) */}
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
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(firstnameError, "firstName")}`}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Enter first name"
                      data-testid="firstName"
                    />
                    <Activity mode={shouldShowError(firstnameError, "firstName") ? "visible" : "hidden"}>
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
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(lastnameError, "lastName")}`}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Enter last name"
                      data-testid="lastName"
                    />
                    <Activity mode={shouldShowError(lastnameError, "lastName") ? "visible" : "hidden"}>
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
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(middlenameError, "middleName")}`}
                      value={formData.middleName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Enter middle name"
                      data-testid="middleName"
                    />
                    <Activity mode={shouldShowError(middlenameError, "middleName") ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{middlenameError}</p>
                    </Activity>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(usernameError, "username")}`}
                      value={formData.username}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Enter username"
                      data-testid="username"
                    />
                    <Activity mode={shouldShowError(usernameError, "username") ? "visible" : "hidden"}>
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
                      type="email"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(emailError, "email")}`}
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="example@example.com"
                      data-testid="email"
                    />
                    <Activity mode={shouldShowError(emailError, "email") ? "visible" : "hidden"}>
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
                      type="text"
                      maxLength={11}
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(phoneNumberError, "phoneNumber")}`}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="09XXXXXXXXX"
                      data-testid="phoneNumber"
                    />
                    <Activity mode={shouldShowError(phoneNumberError, "phoneNumber") ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{phoneNumberError}</p>
                    </Activity>
                    <p className="text-xs text-slate-500 mt-1">Must start with 09 (e.g., 09123456789)</p>
                  </div>
                </div>
              )}

              {/* Step 2: Account Setup (password) */}
              {step === 2 && (
                <>
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className={formData.password.length >= 8 ? "text-emerald-600" : "text-slate-400"}>
                          {formData.password.length >= 8 ? "✓" : "○"}
                        </span>
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={/[A-Z]/.test(formData.password) ? "text-emerald-600" : "text-slate-400"}>
                          {/[A-Z]/.test(formData.password) ? "✓" : "○"}
                        </span>
                        One uppercase letter (A-Z)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={/[a-z]/.test(formData.password) ? "text-emerald-600" : "text-slate-400"}>
                          {/[a-z]/.test(formData.password) ? "✓" : "○"}
                        </span>
                        One lowercase letter (a-z)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={/[0-9]/.test(formData.password) ? "text-emerald-600" : "text-slate-400"}>
                          {/[0-9]/.test(formData.password) ? "✓" : "○"}
                        </span>
                        One number (0-9)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "text-emerald-600" : "text-slate-400"}>
                          {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "✓" : "○"}
                        </span>
                        One special character (!@#$%^&*...)
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <label htmlFor="password" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(computedPasswordError, "password")}`}
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
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
                      
                      {/* Password Strength Indicator */}
                      {formData.password.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${
                              passwordStrength.strength <= 2 ? "text-rose-600" :
                              passwordStrength.strength <= 3 ? "text-orange-600" :
                              passwordStrength.strength <= 4 ? "text-yellow-600" :
                              "text-emerald-600"
                            }`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <Activity mode={shouldShowError(computedPasswordError, "password") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{computedPasswordError}</p>
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
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(computedConfirmPasswordError, "confirmPassword")}`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
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
                      
                      {/* Password Match Indicator */}
                      {formData.confirmPassword.length > 0 && formData.password.length > 0 && (
                        <div className="mt-2">
                          {formData.password === formData.confirmPassword ? (
                            <p className="text-xs text-emerald-600 flex items-center gap-1">
                              <span>✓</span> Passwords match
                            </p>
                          ) : (
                            <p className="text-xs text-rose-600 flex items-center gap-1">
                              <span>✗</span> Passwords do not match
                            </p>
                          )}
                        </div>
                      )}
                      
                      <Activity mode={shouldShowError(computedConfirmPasswordError, "confirmPassword") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{computedConfirmPasswordError}</p>
                      </Activity>
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Teacher - Department */}
              {step === 3 && accountType === "Teacher" && isAccountCreated && (
                <div className="space-y-5">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-800">
                      ✓ Basic account created! Now let's add department information.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                      Department <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(departmentError, "department")}`}
                      value={teacherData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                    />
                    <Activity mode={shouldShowError(departmentError, "department") ? "visible" : "hidden"}>
                      <p className="text-rose-500 text-xs mt-1">{departmentError}</p>
                    </Activity>
                  </div>
                </div>
              )}

              {/* Step 3: Student - Academic Information */}
              {step === 3 && accountType === "Student" && isAccountCreated && (
                <div className="space-y-5">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-800">
                      ✓ Basic account created! Now let's add academic information.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="studentIdNumber" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Student ID Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="studentIdNumber"
                        name="studentIdNumber"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(studentIdError, "studentIdNumber")}`}
                        value={studentData.studentIdNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., 2024-00001"
                      />
                      <Activity mode={shouldShowError(studentIdError, "studentIdNumber") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{studentIdError}</p>
                      </Activity>
                    </div>

                    <div>
                      <label htmlFor="course" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Course <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="course"
                        name="course"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(courseError, "course")}`}
                        value={studentData.course}
                        onChange={handleInputChange}
                        placeholder="e.g., BSCS"
                      />
                      <Activity mode={shouldShowError(courseError, "course") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{courseError}</p>
                      </Activity>
                    </div>

                    <div>
                      <label htmlFor="section" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Section <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="section"
                        name="section"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(sectionError, "section")}`}
                        value={studentData.section}
                        onChange={handleInputChange}
                        placeholder="e.g., A"
                      />
                      <Activity mode={shouldShowError(sectionError, "section") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{sectionError}</p>
                      </Activity>
                    </div>

                    <div>
                      <label htmlFor="year" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Year <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="year"
                        name="year"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(yearError, "year")}`}
                        value={studentData.year}
                        onChange={handleInputChange}
                      >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                      <Activity mode={shouldShowError(yearError, "year") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{yearError}</p>
                      </Activity>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Student - Address Information */}
              {step === 4 && accountType === "Student" && isAccountCreated && (
                <div className="space-y-5">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Almost done! Please provide address information.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label htmlFor="street" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Street Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(streetError, "street")}`}
                        value={studentData.street}
                        onChange={handleInputChange}
                        placeholder="e.g., 123 Main Street, Barangay Example"
                      />
                      <Activity mode={shouldShowError(streetError, "street") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{streetError}</p>
                      </Activity>
                    </div>

                    <div>
                      <label htmlFor="cityMunicipality" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        City/Municipality <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cityMunicipality"
                        name="cityMunicipality"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(cityError, "cityMunicipality")}`}
                        value={studentData.cityMunicipality}
                        onChange={handleInputChange}
                        placeholder="e.g., Manila"
                      />
                      <Activity mode={shouldShowError(cityError, "cityMunicipality") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{cityError}</p>
                      </Activity>
                    </div>

                    <div>
                      <label htmlFor="province" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Province <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(provinceError, "province")}`}
                        value={studentData.province}
                        onChange={handleInputChange}
                        placeholder="e.g., Metro Manila"
                      />
                      <Activity mode={shouldShowError(provinceError, "province") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{provinceError}</p>
                      </Activity>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                        Postal Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${inputError(postalCodeError, "postalCode")}`}
                        value={studentData.postalCode}
                        onChange={handleInputChange}
                        placeholder="e.g., 1000"
                      />
                      <Activity mode={shouldShowError(postalCodeError, "postalCode") ? "visible" : "hidden"}>
                        <p className="text-rose-500 text-xs mt-1">{postalCodeError}</p>
                      </Activity>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  {step > 0 ? (
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
                  {/* Show Next button for steps before account creation */}
                  {!isAccountCreated && step < TOTAL_BASIC_STEPS ? (
                    <button
                      key="next-btn"
                      type="button"
                      onClick={goNext}
                      className="px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors cursor-pointer"
                      data-testid="addUser-next"
                    >
                      Next
                    </button>
                  ) : !isAccountCreated && step === TOTAL_BASIC_STEPS ? (
                    /* Create User button at step 2 */
                    <button
                      key="submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors ${
                        isSubmitting 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-slate-700 cursor-pointer"
                      }`}
                      data-testid="button-user"
                    >
                      {isSubmitting ? "Creating..." : "Create User"}
                    </button>
                  ) : isAccountCreated && accountType === "Teacher" && step === 3 ? (
                    /* Complete Teacher Profile button */
                    <button
                      type="button"
                      onClick={submitTeacherDetails}
                      disabled={isSubmitting}
                      className={`px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors ${
                        isSubmitting 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-emerald-600 cursor-pointer"
                      }`}
                    >
                      {isSubmitting ? "Saving..." : "Complete Profile"}
                    </button>
                  ) : isAccountCreated && accountType === "Student" && step === 3 ? (
                    /* Next button for student academic info */
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={isSubmitting}
                      className={`px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors ${
                        isSubmitting 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-slate-700 cursor-pointer"
                      }`}
                    >
                      Next
                    </button>
                  ) : isAccountCreated && accountType === "Student" && step === 4 ? (
                    /* Complete Student Profile button */
                    <button
                      type="button"
                      onClick={submitStudentAddressInfo}
                      disabled={isSubmitting}
                      className={`px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors ${
                        isSubmitting 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-emerald-600 cursor-pointer"
                      }`}
                    >
                      {isSubmitting ? "Saving..." : "Complete Profile"}
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
