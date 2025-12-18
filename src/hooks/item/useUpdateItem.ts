import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItemApi } from "../../api/item_api";

export const useUpdateItem = () => {
  const querClient = useQueryClient();

  return useMutation({
    mutationFn: updateItemApi,
    mutationKey: ["items"],
    onSuccess: () => {
      querClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};
