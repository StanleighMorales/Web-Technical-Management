import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const deleteItem = async (id: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/archiveitems`;

  const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (res.status === 401) {
    removeToken();
    return;
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete item");
  }

  return data;
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["archiveitems"],
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archives"] })
    }
  });
};
