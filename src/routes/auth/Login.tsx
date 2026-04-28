import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "../../assets/aclcLogo.webp";
import type { TLoginUser } from "../../@types/types";
import { useLogin } from "../../hooks/authHooks";

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isBlockedError, setIsBlockedError] = useState<boolean>(false);
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
    if (name === "identifier") { setUsernameError(""); setErrorMessage(""); setIsBlockedError(false); }
    if (name === "password") { setPasswordError(""); setErrorMessage(""); setIsBlockedError(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!submitForm.identifier) { setUsernameError("Username is required"); hasError = true; }
    if (!submitForm.password) { setPasswordError("Password is required"); hasError = true; }
    if (hasError) return;

    mutate(submitForm, {
      onSuccess: () => navigate({ to: "/home/dashboard" }),
      onError: (error: any) => {
        // Check if it's a blocked user error (403 Forbidden)
        if (error?.response?.status === 403) {
          // Extract the block message from the API response
          const blockMessage = error?.response?.data?.message || "Your account has been blocked.";
          setErrorMessage(blockMessage);
          setIsBlockedError(true);
        } else {
          // For all other errors (401, 500, etc.), show generic message
          setErrorMessage("Invalid username or password.");
          setIsBlockedError(false);
        }
      },
    });
  };

  const hasError = (field: "identifier" | "password") =>
    field === "identifier"
      ? !!usernameError || !!errorMessage
      : !!passwordError || !!errorMessage;

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">

      <div className="relative hidden lg:flex lg:flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 px-14 py-5">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-900/30 translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full border border-white/5" />
        </div>

        {/* Logo */}
        <a
          href="https://www.facebook.com/aclcmandaueph"
          target="_blank"
          rel="noreferrer"
          title="Go to ACLC Page"
          className="relative z-10 w-fit"
        >
          <img
            src={logo}
            alt="ACLC Logo"
            className="w-30 h-30 rounded-full object-cover hover:ring-white/40 transition-all duration-300"
          />
        </a>

        {/* Hero copy */}
        <div className="relative z-10 max-w-2xl -mt-30">
          <h1 className="text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            Technical Equipment<br />Borrowing System
          </h1>
          <p className="text-xl text-blue-100/75 font-medium leading-relaxed">
            Managing resources, tracking items and borrowers. Ensures smooth lifecycle management.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["Inventory", "Borrow Logs", "User Roles", "Activity Logs"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/30 text-xs font-medium">
          © {new Date().getFullYear()} ACLC College of Mandaue
        </p>
      </div>

      <div className="flex w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 flex-col items-center justify-center bg-white px-10 py-14">

        {/* Mobile logo */}
        <div className="-mt-20 mb-30 lg:hidden">
          <img src={logo} alt="ACLC Logo" className="w-25 h-25 rounded-full mx-auto" />
        </div>

        <div className="w-full max-w-xl space-y-8">

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Sign in to your account to continue.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
                isBlockedError
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-rose-200 bg-rose-50 text-rose-600"
              }`}
            >
              <span className={`h-2 w-2 flex-shrink-0 rounded-full mt-1.5 ${
                isBlockedError ? "bg-amber-500" : "bg-rose-500"
              }`} />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            method="post"
            data-testid="login-form"
            className="space-y-5"
          >
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-xs font-bold uppercase tracking-widest text-slate-500"
              >
                Username
              </label>
              <input
                id="identifier"
                type="text"
                name="identifier"
                placeholder="Enter your username"
                value={submitForm.identifier}
                onChange={handleChange}
                autoFocus
                disabled={isPending}
                data-testid="identifier"
                aria-invalid={hasError("identifier")}
                aria-describedby={usernameError ? "identifier-err" : undefined}
                className={`w-full h-12 rounded-2xl border px-4 text-sm text-slate-900 placeholder:text-slate-300 bg-slate-50 outline-none transition-all duration-200 hover:bg-white focus:bg-white focus:ring-4 disabled:opacity-50 ${
                  hasError("identifier")
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                }`}
              />
              {usernameError && (
                <p id="identifier-err" className="text-xs font-medium text-rose-500" role="alert">
                  {usernameError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-widest text-slate-500"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={submitForm.password}
                  onChange={handleChange}
                  disabled={isPending}
                  data-testid="password"
                  aria-invalid={hasError("password")}
                  aria-describedby={passwordError ? "password-err" : undefined}
                  className={`w-full h-12 rounded-2xl border px-4 pr-12 text-sm text-slate-900 placeholder:text-slate-300 bg-slate-50 outline-none transition-all duration-200 hover:bg-white focus:bg-white focus:ring-4 disabled:opacity-50 ${
                    hasError("password")
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                />
                {submitForm.password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsShowPassword((p) => !p)}
                    aria-label={isShowPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {isShowPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />
                    }
                  </button>
                )}
              </div>
              {passwordError && (
                <p id="password-err" className="text-xs font-medium text-rose-500" role="alert">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              data-testid="login-button"
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold tracking-wide shadow-md shadow-blue-200 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : "Sign In"
              }
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-300 font-medium">
            © {new Date().getFullYear()} ACLC College of Mandaue
          </p>
        </div>
      </div>
    </div>
  );
}
