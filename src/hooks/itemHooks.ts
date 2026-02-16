import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import {
  addItemApi,
  allItemsApi,
  allItemsArchiveApi,
  archiveItemApi,
  borrowItem,
  deleteItemApi,
  getArchiveItemInfo,
  getItemApi,
  importItem,
  recentlyBorrowItems,
  restoreItemApi,
  returnItem,
  updateItemApi,
  summaryData,
} from "../api/item_api";

export const useAllItems = () => {
  return queryOptions({
    queryFn: allItemsApi,
    queryKey: ["items"],
    staleTime: 1000 * 60
  });
};

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
export const useAllItemsArchive = () => {
  return queryOptions({
    queryFn: allItemsArchiveApi,
    queryKey: ["archiveitems"],
  });
};

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

export const useBorrowItem = () => {
  return useMutation({
    mutationFn: borrowItem,
    mutationKey: ["lentitems"],
  });
};

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

export const useGetArchiveItemInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getArchiveItemInfo(id),
    queryKey: ["archiveitems", id],
    staleTime: 1000 * 60
  });
};

export const useGetItemInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getItemApi(id),
    queryKey: ["items"],
    staleTime: 1000 * 60
  });
};

export const useImportItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importItem,
    mutationKey: ["import"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["item"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useRecentlyBorrowItems = (id?: string) => {
  return queryOptions({
    queryFn: () => recentlyBorrowItems(id),
    queryKey: ["lentItems", id],
    staleTime: 1000 * 60
  });
};

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

export const useReturnItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnItem,
    mutationKey: ["returnItem"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["lentItems"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useSummaryData = () => {
  return queryOptions({
    queryFn: summaryData,
    queryKey: ["summary"],
    staleTime: 1000 * 60
  });
};
