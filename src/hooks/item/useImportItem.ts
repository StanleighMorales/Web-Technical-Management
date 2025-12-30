import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importItem } from "../../api/item_api";

export const useImportItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importItem,
    mutationKey: ["import"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"]
      })
    },
    onError: (error) => {
      console.log(error)
    }
  })
}
