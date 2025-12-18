import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveItemApi } from "../../api/item_api";

export const useArchiveItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveItemApi,
    mutationKey: ["archive"],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      console.log(data.message);
    },
    onError: (error: any) => {
      if (error.response) console.log(error.response.data.Errors);
    },
  });
};
