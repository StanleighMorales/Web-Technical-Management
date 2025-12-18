import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemApi } from "../../api/item_api";

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItemApi,
    mutationKey: ["archiveitems"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archiveitems"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
