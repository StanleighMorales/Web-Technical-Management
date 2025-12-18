import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUserApi } from "../../api/user_api";

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUserApi,
    mutationKey: ["register"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      console.log(err.message);
    },
  });
};
