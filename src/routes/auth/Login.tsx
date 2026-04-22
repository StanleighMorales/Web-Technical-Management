import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import logo from "../../assets/aclcLogo.webp";
import type { TLoginUser } from "../../@types/types";
import { useLogin } from "../../hooks/authHooks";

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [submitForm, setSubmitForm] = useState<TLoginUser>({
    identifier: "",
    password: "",
  });

  const { mutate, isPending } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubmitForm((prev) => ({ ...prev, [name]: value }));

    if (name === "identifier") setUsernameError("");
    if (name === "password") setPasswordError("");
  };

  const handleSubmitLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!submitForm.identifier && !submitForm.password) {
      setUsernameError("Username is required");
      setPasswordError("Password is required");
      hasError = true;
    }

    if (!submitForm.identifier) {
      setUsernameError("Username is required");
      hasError = true;
    }

    if (!submitForm.password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    mutate(submitForm, {
      onSuccess: () => {
        navigate({ to: "/home/dashboard" });
      },
      onError: () => {
        setErrorMessage("Invalid username or password.")
      },
    });
  };

  const hasInputError = (field: "identifier" | "password") => {
    if (field === "identifier") return !!usernameError || errorMessage
    return !!passwordError || errorMessage
  };

  const inputClass = (field: "identifier" | "password") =>
    `w-[400px] h-[55px] rounded-md border-2 bg-white/78 pl-4 pr-12 text-base outline-none transition placeholder:text-black/40 hover:bg-white/93 focus:bg-white max-lg:w-[90vw] max-lg:max-w-[98%] max-lg:min-w-[220px] max-sm:w-[98vw] max-sm:min-w-[120px] ${hasInputError(field) ? "border-red-500" : "border-black/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    }`;

  return (
    <div className="relative w-full min-h-screen bg-blue-600 lg:py-4">
      {/* Left: logo */}
      <div className="animate-fadeIn flex w-full justify-center lg:justify-start">
        <a
          href="https://www.facebook.com/aclcmandaueph"
          className="ml-[4%] mt-[2%]"
          target="_blank"
          rel="noreferrer"
          title="Go to ACLC Page"
        >
          <img
            src={logo}
            alt="Logo"
            className="w-24 rounded-full cursor-pointer lg:w-30"
          />
        </a>
      </div>

      {/* Left: title + subtitle */}
      <div className="animate-fadeIn max-w-[1000px] mx-[4%] mt-[7%] mb-[4%] max-lg:mx-[2%] max-lg:mt-[4%] max-lg:mb-[2%] max-lg:max-w-full max-sm:mx-[1%] max-sm:mt-[2%] max-sm:mb-[1%] max-sm:p-0">
        <div className="flex max-w-4xl w-full justify-center items-center">
          <h1 className="m-0 mb-4 font-bold text-center lg:text-left text-white text-[65px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] leading-[4.2rem] max-sm:text-[2.2rem] max-sm:leading-[2.7rem]">
            Technical Equipment Borrowing System
          </h1>
        </div>
        <p className="text-lg text-center lg:text-left text-white/75">
          Managing resources, while tracking items and borrowers. Ensures
          smooth lifecycle management.
        </p>
      </div>

      {/* Right: login panel */}
      <div className="animate-fadeIn absolute top-0 right-0 w-[35%] h-screen bg-white flex flex-col justify-center items-center max-lg:w-full max-lg:relative max-lg:min-h-[60vh] max-sm:min-h-[60vh] max-sm:py-4 max-sm:px-2">
        <div className="my-4 mb-10 text-center max-sm:-mt-80">
          <h1 className="m-0 text-black text-[2.4rem] mb-[-0.3rem] max-sm:text-[1.5rem]">
            Welcome Back
          </h1>
          <p className="mb-1.5 text-center text-black/62">
            Enter your credentials to log in.
          </p>
          <div className="mt-2 text-red-500 text-md" role="alert">
            {errorMessage}
          </div>
        </div>

        <form
          className="flex flex-col justify-center items-center"
          onSubmit={handleSubmitLoginForm}
          method="post"
          data-testid="login-form"
        >
          <div className="flex relative flex-col mb-6">
            <input
              id="identifier"
              className={`${inputClass("identifier")} pr-4 mb-1`}
              autoFocus
              type="text"
              name="identifier"
              placeholder="Username"
              value={submitForm.identifier}
              onChange={handleChange}
              data-testid="identifier"
              disabled={isPending}
              aria-invalid={!!usernameError}
              aria-describedby={usernameError ? "identifier-err" : undefined}
            />
            {usernameError && (
              <p id="identifier-err" className="absolute mt-14 text-base text-red-500" role="alert">
                {usernameError}
              </p>
            )}
          </div>

          <div className="flex relative flex-col">
            <div className="relative">
              <input
                id="password"
                className={inputClass("password")}
                type={isShowPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={submitForm.password}
                onChange={handleChange}
                data-testid="password"
                disabled={isPending}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-err" : undefined}
              />
              {submitForm.password.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer rounded p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                  aria-label={isShowPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {isShowPassword ? (
                    <FaEye className="text-[1.6rem]" />
                  ) : (
                    <FaEyeSlash className="text-[1.6rem]" />
                  )}
                </button>
              )}
            </div>
            {passwordError && (
              <p id="password-err" className="text-base text-red-500 mt-1" role="alert">
                {passwordError}
              </p>
            )}
          </div>

          <div className="mt-20 max-sm:mt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-[400px] h-[55px] rounded-md border-0 bg-blue-500 text-lg font-medium text-white cursor-pointer outline-none transition hover:bg-[rgb(54,117,253)] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 max-lg:w-[90vw] max-lg:max-w-[98%] max-lg:min-w-[220px] max-sm:w-[98vw] max-sm:min-w-[120px]"
              data-testid="login-button"
            >
              {isPending ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 animate-spin border-t-white" />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
