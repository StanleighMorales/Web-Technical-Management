import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const ArchiveUser = async (id: string) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/users/archive`;

    const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    });

    if (res.status === 401) {
      removeToken();
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.errors);

    return data;
  } catch(error) {
    if(error instanceof Error){
      console.log(error)
    }
  }
};

export const useArchiveUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["users"],
    mutationFn: ArchiveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  });
};
