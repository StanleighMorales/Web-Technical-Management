import { useMutation } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";
import type { TBorrowItemForm } from "../../types/types";

type LentItemsProps = {
  formData: TBorrowItemForm;
};
const LentItems = async ({ formData }: LentItemsProps) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/lentItems/guests`;

    const lentItemForm = JSON.stringify(formData);
    const res = await fetch(`${BASE_URL}${END_POINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: lentItemForm,
    });

    if (res.status === 401) {
      removeToken();
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Submission failed");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const usePostLentItemsMutation = () => {
  return useMutation({
    mutationKey: ["lentItems"],
    mutationFn: LentItems,
  });
};
