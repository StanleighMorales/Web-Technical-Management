import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const archiveTeacher = async (teacherId: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/users/archive`;

  const res = await fetch(`${BASE_URL}${END_POINT}/${teacherId}`, {
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
  if (!res.ok) throw new Error(data.message || "Error archiving teacher");

  return data;
};

export const useArchiveTeacherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
