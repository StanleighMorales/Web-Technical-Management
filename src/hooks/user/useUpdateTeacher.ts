import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherApi } from "../../api/user_api";

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherApi,
    mutationKey: ["profile"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
