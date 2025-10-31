import { useMutation } from "@tanstack/react-query";
import type { TLoginUser } from "../../types/types";

const LoginUser = async (formData: TLoginUser) => {

  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/auth/login`;

    const userFormData = JSON.stringify(formData)
    const res = await fetch(`${BASE_URL}${END_POINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: userFormData,
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to login user");
    }
    return data;

  } catch (error) {
    console.log(error);
  }
};

export const usePostLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: LoginUser,
  });
};
