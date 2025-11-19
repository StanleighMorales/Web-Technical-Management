import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const useDeleteUser = async (id: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/archiveusers/permanent-delete`;

  const res = await fetch(`${BASE_URL}${END_POINT}${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (res.status === 401) {
    removeToken();
    return;
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Delete User Failed");

  return data;
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["permanent-delete"],
    mutationFn: useDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ArchiveUsers"] })
    }
  })
}
