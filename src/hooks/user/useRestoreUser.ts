import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreUserApi } from "../../api/user_api";

export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreUserApi,
    mutationKey: ["restore"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archiveusers"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};
