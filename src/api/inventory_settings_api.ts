import { api } from "./axios";

const CATEGORIES_ENDPOINT = "/categories";
const CONDITIONS_ENDPOINT = "/conditions";

// Categories

export const getAllCategoriesApi = async (): Promise<string[]> => {
  const response = await api.get(CATEGORIES_ENDPOINT);
  return response.data.data;
};

export const addCategoryApi = async (name: string): Promise<{ message: string }> => {
  const response = await api.post(CATEGORIES_ENDPOINT, { name });
  return response.data;
};

export const deleteCategoryApi = async (name: string): Promise<{ message: string }> => {
  const response = await api.delete(`${CATEGORIES_ENDPOINT}/${encodeURIComponent(name)}`);
  return response.data;
};

// Conditions

export const getAllConditionsApi = async (): Promise<string[]> => {
  const response = await api.get(CONDITIONS_ENDPOINT);
  return response.data.data;
};

export const addConditionApi = async (name: string): Promise<{ message: string }> => {
  const response = await api.post(CONDITIONS_ENDPOINT, { name });
  return response.data;
};

export const deleteConditionApi = async (name: string): Promise<{ message: string }> => {
  const response = await api.delete(`${CONDITIONS_ENDPOINT}/${encodeURIComponent(name)}`);
  return response.data;
};
