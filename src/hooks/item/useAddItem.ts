import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addItemApi } from "../../api/item_api";

export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addItemApi,
    mutationKey: ["items"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
