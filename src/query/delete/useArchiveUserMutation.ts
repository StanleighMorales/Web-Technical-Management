import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

const ArchiveUser = async (id: string) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const END_POINT = "/api/v1/users/archive";

    const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Failed to delete item");
    }
    console.log(data);

    return data;
  } catch {
    return null;
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
