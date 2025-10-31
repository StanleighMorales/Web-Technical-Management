import { useMutation } from "@tanstack/react-query";
import { getToken } from "../../utils/token";
import type { TUpdatePassword } from "../../types/types";

type UpdateUserPasswordProps = {
  id?: string
  formData: TUpdatePassword
}

const UpdateUserPassword = async ({ id, formData }: UpdateUserPasswordProps) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/auth/change-password`;

  const newPaswword = JSON.stringify(formData);
  const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: newPaswword
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Submission failed");
}

export const usePatchUserPasswordMutation = () => {
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: UpdateUserPassword
  })
}
