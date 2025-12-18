import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveUserApi } from "../../api/user_api";

export const useArchiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveUserApi,
    mutationKey: ["archive"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
