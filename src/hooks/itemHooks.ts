import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import {
  addItemApi,
  allItemsApi,
  allItemsArchiveApi,
  archiveItemApi,
  borrowItem,
  cancelBorrowSessionApi,
  cancelItemScanSessionApi,
  cancelRfidSessionApi,
  cancelReturnSessionApi,
  createBorrowSessionApi,
  createItemScanSessionApi,
  createRfidSessionApi,
  createReturnSessionApi,
  deleteItemApi,
  getArchiveItemInfo,
  getBorrowSessionApi,
  getItemApi,
  getReturnSessionApi,
  getRfidSessionApi,
  importItem,
  recentlyBorrowItems,
  restoreItemApi,
  returnItem,
  updateItemApi,
  summaryData,
} from "../api/item_api";

export const ITEMS_KEY = ["items"] as const;
export const ARCHIVE_ITEMS_KEY = ["archiveitems"] as const;
export const LENT_ITEMS_KEY = ["lentitems"] as const;

export const useAllItems = () => {
  return queryOptions({
    queryFn: allItemsApi,
    queryKey: ITEMS_KEY,
    staleTime: 5 * 60 * 1000
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addItemApi,
    mutationKey: ITEMS_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
};

export const useUpdateItem = () => {
  const querClient = useQueryClient();

  return useMutation({
    mutationFn: updateItemApi,
    mutationKey: ITEMS_KEY,
    onSuccess: () => {
      querClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
};
export const useAllItemsArchive = () => {
  return queryOptions({
    queryFn: allItemsArchiveApi,
    queryKey: ARCHIVE_ITEMS_KEY,
    staleTime: 5 * 60 * 1000
  });
};

export const useArchiveItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveItemApi,
    mutationKey: ["archive"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
      queryClient.invalidateQueries({ queryKey: ARCHIVE_ITEMS_KEY });
    },
  });
};

export const useBorrowItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: borrowItem,
    mutationKey: LENT_ITEMS_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LENT_ITEMS_KEY })
    }
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItemApi,
    mutationKey: ARCHIVE_ITEMS_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARCHIVE_ITEMS_KEY });
    },
  });
};

export const useGetArchiveItemInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getArchiveItemInfo(id),
    queryKey: ["archiveitems", id],
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetItemInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getItemApi(id),
    queryKey: ["items", id],
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useImportItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importItem,
    mutationKey: ["import"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
};

export const useRecentlyBorrowItems = (id?: string) => {
  return queryOptions({
    queryFn: () => recentlyBorrowItems(id),
    queryKey: ["lentItems", id],
    staleTime: 5 * 60 * 1000,
  });
};

export const useRestoreItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreItemApi,
    mutationKey: ["restore"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARCHIVE_ITEMS_KEY });
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
};

export const useReturnItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnItem,
    mutationKey: ["returnItem"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
      queryClient.invalidateQueries({ queryKey: LENT_ITEMS_KEY });
    },
  });
};

export const useSummaryData = () => {
  return queryOptions({
    queryFn: summaryData,
    queryKey: ["summary"],
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRfidSession = () => {
  return useMutation({
    mutationFn: createRfidSessionApi,
    mutationKey: ["rfidSession"],
  });
};

export const useGetRfidSession = (sessionId: string) => {
  return queryOptions({
    queryFn: () => getRfidSessionApi(sessionId),
    queryKey: ["rfidSession", sessionId],
    enabled: !!sessionId,
    staleTime: 0,
    refetchInterval: 2000,
  });
};

export const useCancelRfidSession = () => {
  return useMutation({
    mutationFn: cancelRfidSessionApi,
    mutationKey: ["rfidSession"],
  });
};

export const useCreateBorrowSession = () => {
  return useMutation({
    mutationFn: createBorrowSessionApi,
    mutationKey: ["borrowSession"],
  });
};

export const useGetBorrowSession = (sessionId: string) => {
  return queryOptions({
    queryFn: () => getBorrowSessionApi(sessionId),
    queryKey: ["borrowSession", sessionId],
    enabled: !!sessionId,
    staleTime: 0,
    refetchInterval: 2000,
  });
};

export const useCancelBorrowSession = () => {
  return useMutation({
    mutationFn: cancelBorrowSessionApi,
    mutationKey: ["borrowSession"],
  });
};

export const useCreateReturnSession = () => {
  return useMutation({
    mutationFn: createReturnSessionApi,
    mutationKey: ["returnSession"],
  });
};

export const useGetReturnSession = (sessionId: string) => {
  return queryOptions({
    queryFn: () => getReturnSessionApi(sessionId),
    queryKey: ["returnSession", sessionId],
    enabled: !!sessionId,
    staleTime: 0,
    refetchInterval: 2000,
  });
};

export const useCancelReturnSession = () => {
  return useMutation({
    mutationFn: cancelReturnSessionApi,
    mutationKey: ["returnSession"],
  });
};

export const useCreateItemScanSession = () => {
  return useMutation({
    mutationFn: createItemScanSessionApi,
    mutationKey: ["itemScanSession"],
  });
};

export const useCancelItemScanSession = () => {
  return useMutation({
    mutationFn: cancelItemScanSessionApi,
    mutationKey: ["itemScanSession"],
  });
};
