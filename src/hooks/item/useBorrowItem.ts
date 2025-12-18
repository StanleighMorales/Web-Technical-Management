import { useMutation } from "@tanstack/react-query";
import { borrowItem } from "../../api/item_api";

export const useBorrowItem = () => {
  return useMutation({
    mutationFn: borrowItem,
    mutationKey: ["lentitems"],
  });
};
