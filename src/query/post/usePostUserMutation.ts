import { useMutation } from "@tanstack/react-query";
import type { TUserFormData } from "../../types/types";
import { getToken } from "../../utils/token";

const PostUser = async (formData: TUserFormData) => {

  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/auth/register`;

    const newUserData = JSON.stringify(formData)
    const res = await fetch(`${BASE_URL}${END_POINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      },
      body: newUserData,
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data.message;

  } catch (error) {
    console.log(error)
  }
};

export const usePostUserMutation = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: PostUser,
  });
};
