import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentApi } from "../../api/user_api";

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentApi,
    mutationKey: ["profile"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
