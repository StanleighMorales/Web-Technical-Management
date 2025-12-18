import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserApi } from "../../api/user_api";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserApi,
    mutationKey: ["archiveusers"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archiveusers"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};
