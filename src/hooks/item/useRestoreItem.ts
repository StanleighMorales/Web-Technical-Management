import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreItemApi } from "../../api/item_api";

export const useRestoreItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreItemApi,
    mutationKey: ["restore"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archiveitems"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
