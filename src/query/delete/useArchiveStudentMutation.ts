import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const archiveStudent = async (studentId: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/users/archive`;

  const res = await fetch(`${BASE_URL}${END_POINT}/${studentId}`, {
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
  if (!res.ok) throw new Error(data.message || "Error archiving student");

  return data;
};

export const useArchiveStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
