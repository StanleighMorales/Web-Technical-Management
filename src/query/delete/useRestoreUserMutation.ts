import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

const restoreUser = async (id: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/archiveusers/restore`;

  const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to restore user");
  }

  return data;
};

export const useRestoreUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["restoreUser"],
    mutationFn: restoreUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ArchiveUsers"] });
    },
  });

}
