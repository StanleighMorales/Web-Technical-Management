import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import logo from "../assets/img/aclcLogo.webp";
import type { TLoginUser } from "../types/types";
import { usePostLoginMutation } from "../query/post/userPostLoginMutation";

export default function Login() {
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [isForgotPasswordFormOpen, setIsForgotPasswordFormOpen] =
        useState<boolean>(false);
    const [usernameError, setUsernameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [submitForm, setSubmitForm] = useState<TLoginUser>({
        identifier: "",
        password: "",
    });

    const { mutate, isPending, error, isError } = usePostLoginMutation();

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
                navigate("/home/dashboard");
            },
            onError: (err: Error) => {
                console.error("Registration failed:", err.message);
            },
        });
    };

    return (
        <>
            <div className="relative w-full h-screen bg-[rgb(46,111,251)] max-lg:h-auto max-lg:min-h-screen max-lg:py-4">
                <div className="w-full  mb-0  flex justify-center lg:justify-start ">
                    <a href="https://www.facebook.com/aclcmandaueph" className="ml-[4%] mt-[2%]" target="_blank" title="Go to ACLC Page">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-24 lg:w-30 bg-orange-500 rounded-full cursor-pointer"
                        />
                    </a>
                </div>
                <div className="animate-fadeIn max-w-[1000px] mx-[4%] mt-[7%] mb-[4%] animate-fade-in max-lg:mx-[2%] max-lg:mt-[4%] max-lg:mb-[2%] max-lg:max-w-full max-sm:mx-[1%] max-sm:mt-[2%] max-sm:mb-[1%] max-sm:p-0">
                    <div className="max-w-[650px] max-sm:max-w-full max-sm:text-center">
                        <h1 className="m-0 mb-4 font-bold text-white text-[65px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] leading-[4.2rem] animate-fade-in max-sm:text-[2.2rem] max-sm:leading-[2.7rem]">
                            Technical Assets Management
                        </h1>
                    </div>
                    <p className="lg:text-lg max-sm:text-center text-white/75">
                        Managing hardware, software, and digital resources, while tracking
                        items, borrowers, and usage. Ensures optimized performance, cost
                        efficiency, security, and smooth lifecycle management.
                    </p>
                </div>
                <div className="animate-fadeIn absolute top-0 right-0 w-[35%] h-screen bg-white flex flex-col justify-center items-center animate-fade-in max-lg:w-full max-lg:ml-0 max-lg:relative max-lg:min-h-[60vh] max-sm:w-full max-sm:ml-0 max-sm:relative max-sm:min-h-[60vh] max-sm:py-4 max-sm:px-2">
                    <div className="my-4 mb-10 text-center max-sm:-mt-80">
                        <h1 className="m-0 text-black text-[2.4rem] mb-[-0.3rem] max-sm:text-[1.5rem]">
                            Welcome Admin.
                        </h1>
                        <p className="mb-1.5 text-center text-black/62">
                            Enter your credentials to log in.
                        </p>
                        {isError && error instanceof Error && (
                            <div className="mt-2 text-red-500 text-md">{error.message}</div>
                        )}
                    </div>
                    <form
                        className="flex flex-col justify-center items-center"
                        onSubmit={handleSubmitLoginForm}
                        method="post"
                        data-testid="login-form"
                    >
                        <div className="flex relative flex-col">
                            <input
                                className={`w-[400px] h-[55px] rounded-md outline-none border mb-8 border-black/34 bg-white/78 pl-4 text-base hover:bg-white/93 focus:bg-white/93 max-lg:w-[90vw] max-lg:max-w-[98%] max-lg:min-w-[220px] max-sm:w-[98vw] max-sm:max-w-full max-sm:min-w-[120px] max-sm:text-base ${usernameError ? "border-2 border-red-500" : ""
                                    } ${Error && error instanceof Error && "border-2 border-red-500"}`}
                                autoFocus
                                type="text"
                                name="identifier"
                                placeholder="Username"
                                value={submitForm.identifier}
                                onChange={handleChange}
                                data-testid="identifier"
                                disabled={isPending}
                            />
                            {usernameError && (
                                <p className="absolute mt-14 text-base text-red-500">
                                    {usernameError}
                                </p>
                            )}
                        </div>
                        <div className="flex relative flex-col">
                            <input
                                className={`w-[400px] h-[55px] rounded-md outline-none border border-black/34 bg-white/78 pl-4 pr-12 text-base hover:bg-white/93 focus:bg-white/93 
      max-lg:w-[90vw] max-lg:max-w-[98%] max-lg:min-w-[220px] 
      max-sm:w-[98vw] max-sm:max-w-full max-sm:min-w-[120px] max-sm:text-base
      ${passwordError ? "border-2 border-red-500" : ""} 
      ${Error && error instanceof Error && "border-2 border-red-500"}
    `}
                                type={isShowPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={submitForm.password}
                                onChange={handleChange}
                                data-testid="password"
                                disabled={isPending}
                            />

                            {passwordError && (
                                <p className="relative text-base text-red-500">
                                    {passwordError}
                                </p>
                            )}

                            {/* FIXED ICON POSITION */}
                            {submitForm.password.length > 0 && (
                                <div
                                    className="absolute right-3 top-[14px] text-gray-400 cursor-pointer"
                                    onClick={() => setIsShowPassword((prev) => !prev)}
                                >
                                    {isShowPassword ? (
                                        <FaEye className="text-[1.6rem]" />
                                    ) : (
                                        <FaEyeSlash className="text-[1.6rem]" />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-20 max-sm:mt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-[420px] h-[55px] outline-none border-0 rounded-md text-lg font-medium text-white bg-[rgb(46,111,251)] cursor-pointer hover:bg-[rgb(54,117,253)] disabled:opacity-50 max-lg:w-[90vw] max-lg:max-w-[98%] max-lg:min-w-[220px] max-sm:w-[98vw] max-sm:max-w-full max-sm:min-w-[120px] max-sm:text-base"
                                data-testid="login-button"
                            >
                                {isPending ? (
                                    <div className="flex justify-center items-center">
                                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 animate-spin border-t-white"></div>
                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isForgotPasswordFormOpen ? (
                <ForgotPassword onClose={() => setIsForgotPasswordFormOpen(false)} />
            ) : (
                ""
            )}
        </>
    );
}
