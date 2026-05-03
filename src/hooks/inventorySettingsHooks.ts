import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategoriesApi,
  addCategoryApi,
  deleteCategoryApi,
  getAllConditionsApi,
  addConditionApi,
  deleteConditionApi,
} from "../api/inventory_settings_api";

// Query keys

export const CATEGORIES_KEY = ["categories"] as const;
export const CONDITIONS_KEY = ["conditions"] as const;

// Queries

export const useGetCategories = () =>
  queryOptions({
    queryKey: CATEGORIES_KEY,
    queryFn: getAllCategoriesApi,
    staleTime: 5 * 60 * 1000,
  });

export const useGetConditions = () =>
  queryOptions({
    queryKey: CONDITIONS_KEY,
    queryFn: getAllConditionsApi,
    staleTime: 5 * 60 * 1000,
  });

// Mutations Categories

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

// Mutations — Conditions 

export const useAddCondition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addConditionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONDITIONS_KEY });
    },
  });
};

export const useDeleteCondition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConditionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONDITIONS_KEY });
    },
  });
};
