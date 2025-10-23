import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

type ItemData = {
  serialNumber: string;
  image: File | null;
  itemName: string;
  itemType: string;
  itemModel: string;
  itemMake: string;
  description: string;
  category: string;
  condition: string;
};

const PostItem = async (formData: ItemData) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const END_POINT = "/api/v1/items";

  const body = new FormData();
  body.append("SerialNumber", formData.serialNumber);
  body.append("ItemName", formData.itemName);
  body.append("ItemType", formData.itemType);
  body.append("ItemModel", formData.itemModel);
  body.append("ItemMake", formData.itemMake);
  body.append("Description", formData.description);
  body.append("Category", formData.category);
  body.append("Condition", formData.condition);

  if (formData.image) {
    body.append("Image", formData.image);
  }

  const res = await fetch(`${BASE_URL}${END_POINT}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: body,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.errors || "Item Id already exist");
  return data.data;
};

export const usePostItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["items"],
    mutationFn: PostItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Item"] })
    }
  });
};
