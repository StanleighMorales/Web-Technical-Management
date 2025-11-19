import { useMutation } from "@tanstack/react-query";
import type { TRegisterUser } from "../../types/types";
import { removeToken } from "../../utils/token";

const RegisterUser = async (formData: TRegisterUser) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/auth/register`;

    const newUserData = JSON.stringify(formData)
    const res = await fetch(`${BASE_URL}${END_POINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: newUserData,
    });

    if (res.status === 401) {
      removeToken();
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to register user");
    }

    return data;

  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }


};

export const usePostRegisterMutation = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: RegisterUser,
  });
};
