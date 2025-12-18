import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetPasswordUser } from "../../api/user_api";

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPasswordUser,
    mutationKey: ["change-password"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};
