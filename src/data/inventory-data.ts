import { useEffect, useMemo, useState } from "react";
import type { TItemList } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { useAllItems } from "../hooks/itemHooks";

export const useAllInventoryItems = () => {
    const [items, setItems] = useState<TItemList[]>([]);

    const { data, isPending, isError } = useQuery(useAllItems());

    useEffect(() => {
        if (!data) return;
        setItems(data);
    }, [data]);

    return { items, isPending, isError }
}

export const useFilteredItems = () => {
    const { items } = useAllInventoryItems()

    const [searchItem, setSearchItem] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedCondition, setSelectedCondition] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    // this func use a useMemo to filtered item either its itemName or the Category and also for the Matches Category and return items,searchItem and selectedCategory
    const filteredItems = useMemo(
        () =>
            items.filter((item) => {
                const matchesSearch =
                    item.itemName.toLowerCase().includes(searchItem.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchItem.toLowerCase()) ||
                    item.serialNumber.toLowerCase().includes(searchItem.toLowerCase());

                const matchesCategory =
                    selectedCategory === "" || item.category === selectedCategory;

                const matchesCondition =
                    selectedCondition === "" || item.condition === selectedCondition;

                const matchesStatus =
                    selectedStatus === "" || item.status === selectedStatus;

                return (
                    matchesSearch && matchesCategory && matchesCondition && matchesStatus
                );
            }),
        [items, searchItem, selectedCategory, selectedCondition, selectedStatus],
    );

    return { filteredItems, setSearchItem, selectedCategory, setSelectedCategory, selectedCondition, setSelectedCondition, selectedStatus, setSelectedStatus }
}
