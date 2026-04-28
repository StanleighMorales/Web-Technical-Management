import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import {
  addItemApi,
  allItemsApi,
  allItemsArchiveApi,
  archiveItemApi,
  borrowItem,
  cancelRfidSessionApi,
  createRfidSessionApi,
  deleteItemApi,
  getArchiveItemInfo,
  getItemApi,
  getRfidSessionApi,
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
    staleTime: 5 * 60 * 1000
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
  });
};
export const useAllItemsArchive = () => {
  return queryOptions({
    queryFn: allItemsArchiveApi,
    queryKey: ["archiveitems"],
    staleTime: 5 * 60 * 1000
  });
};

export const useArchiveItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveItemApi,
    mutationKey: ["archive"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["archiveitems"] });
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
      queryClient.invalidateQueries({ queryKey: ["items"] });
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
      queryClient.invalidateQueries({ queryKey: ["archiveitems"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
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
    refetchInterval: 2000, // poll every 2s like the ESP32 spec
  });
};

export const useCancelRfidSession = () => {
  return useMutation({
    mutationFn: cancelRfidSessionApi,
    mutationKey: ["rfidSession"],
  });
};
