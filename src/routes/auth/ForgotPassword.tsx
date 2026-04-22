import React, { useState } from "react";
import type { TForgotPasswordUser } from "../../@types/types";
import CloseButton from "../../components/CloseButton";

type ForgotPasswordProps = {
  onClose(): void;
};

export default function ForgotPassword({ onClose }: ForgotPasswordProps) {
  const forgot_password_api = import.meta.env.VITE_FORGOT_PASSWORD_API;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [isForgotPasswordFormOpen, setIsForgotPasswordFormOpen] = useState<boolean>(true)
  const [emailError, setEmailError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [submitForm, setSubmitForm] = useState<TForgotPasswordUser>({
    username: "",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubmitForm((prev) => ({ ...prev, [name]: value }));

    if (name === "username") setEmailError("");
  };

  // Validate email format
  // const validateEmail = (email: string): boolean => {
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     return emailRegex.test(email);
  // }

  // Handle Forgot Password
  const handleSubmitForgotPasswordForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    if (submitForm.username === "") {
      setEmailError("Email is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const submitUserData = {
        email: submitForm.username,
      };

      const response = await fetch(forgot_password_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitUserData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setEmailError("Email not found in our system");
        } else {
          setEmailError("Something went wrong. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      if (data) {
        setSuccessMessage(
          "Password reset instructions have been sent to your email.",
        );
        setSubmitForm({ username: "" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setEmailError(
          "Network error. Please check your connection and try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="animate-fadeIn bg-gray-800/60 fixed flex flex-row justify-center items-center p-[2rem] z-[1000] w-full h-full m-h-full top-0 left-0">
        <div className="forgot-password-container relative w-full max-w-[500px] bg-white rounded-2xl shadow-gray-600 mt-[2rem] p-[2.5rem] animate-fade-in">
          <form
            onSubmit={handleSubmitForgotPasswordForm}
            className="forgot-password-form flex flex-col gap-4 m-0"
            method="post"
          >
            <div className="close-container absolute top-[1rem] right-[1rem] z-[10]">
              <CloseButton onClick={onClose} />
            </div>
            <div className="forgot-password-title text-center mb-[2rem]">
              <h1 className="text-black text-3xl font-extrabold mb-2">
                Forgot Password
              </h1>
              <p className="text-gray-700 text-md font-[400]">
                Enter your username and we'll send you instructions to reset
                your password.
              </p>
            </div>

            {successMessage && (
              <div className="success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                {successMessage}
              </div>
            )}

            <input
              autoFocus
              className={`w-full h-[56px] outline-0 border-[1px] border-gray-400 rounded-lg pl-4 bg-white hover:border-gray-600 hover:bg-gray-50 focus:border-blue-600 ${emailError ? "border-red-700" : ""}`}
              type="text"
              name="username"
              value={submitForm.username}
              placeholder="Enter your username"
              onChange={handleChange}
            />
            {emailError && (
              <p
                style={{ marginTop: "-0.9rem", color: "red", fontSize: "16px" }}
              >
                {emailError}
              </p>
            )}

            <div className="forgot-password-container overflow-hidden relative w-full h-[56px] flex justify-center items-center outline-0 border-0 rounded-[12px] bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-400">
              <button
                className="cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex justify-center items-center">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-white animate-spin"></div>
                  </div>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </div>

            <div className="back-to-login text-center mt-4">
              <p className="text-gray-600 text-sm">
                Remember your password?
                <span
                  className="text-blue-600 cursor-pointer hover:underline ml-1"
                  onClick={onClose}
                >
                  Back to Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
