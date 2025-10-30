import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

const ArchiveItem = async (id: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/items/archive`;

  const res = await fetch(`${BASE_URL}${END_POINT}${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to delete item");
  return data;
};

export const useArchiveItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["Item"],
    mutationFn: ArchiveItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Item"] })
    }
  });
};
