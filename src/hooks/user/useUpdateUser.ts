import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi } from "../../api/user_api";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserApi,
    mutationKey: ["admin-or-staff"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
