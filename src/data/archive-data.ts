import { useEffect, useMemo, useState } from "react";
import type { TArchiveItem, TUsers } from "../@types/types";
import { useAllItemsArchive } from "../hooks/itemHooks";
import { useQuery } from "@tanstack/react-query";
import { useAllUsersArchive } from "../hooks/userHooks";

interface Props {
    searchItem: string
}

export const useAllItemInArchive = () => {
    const [archiveItems, setArchiveItems] = useState<TArchiveItem[]>([]);
    const { data, isPending, isError } = useQuery(useAllItemsArchive());

    useEffect(() => {
        if (data) setArchiveItems(data);
    }, [data]);

    return { archiveItems, isPending, isError }
}

export const useAllUsersInArchive = () => {
    const [archiveUsers, setArchiveUsers] = useState<TUsers[]>([]);

    const {
        data: usersData,
        isPending: isUsersPending,
        isError: isUsersError,
    } = useQuery(useAllUsersArchive());

    useEffect(() => {
        if (usersData) setArchiveUsers(usersData);
    }, [usersData]);

    return { archiveUsers, isUsersPending, isUsersError }
}

export const useFilteredItems = ({ searchItem }: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const { archiveItems } = useAllItemInArchive()

    const filteredItems = useMemo(
        () =>
            archiveItems.filter((item) => {
                const searchTerm = searchItem?.toLowerCase() || "";
                const matchesSearch =
                    (item.itemName?.toLowerCase() || "").includes(searchTerm) ||
                    (item.category?.toLowerCase() || "").includes(searchTerm) ||
                    (item.serialNumber?.toLowerCase() || "").includes(searchTerm) ||
                    (item.itemType?.toLowerCase() || "").includes(searchTerm) ||
                    (item.itemModel?.toLowerCase() || "").includes(searchTerm) ||
                    (item.itemMake?.toLowerCase() || "").includes(searchTerm);

                const matchesCategory =
                    selectedCategory === "" || item.category === selectedCategory;

                return matchesSearch && matchesCategory;
            }),
        [archiveItems, searchItem, selectedCategory],
    );

    return { filteredItems, searchItem, selectedCategory, setSelectedCategory }
}

export const useFilteredUsers = ({ searchItem }: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const { archiveUsers } = useAllUsersInArchive()
    const [activeFilter, setActiveFilter] = useState<
        "items" | "users" | "teachers" | "students"
    >("items");

    const filteredUsers = useMemo(
        () =>
            archiveUsers.filter((user) => {
                // Filter by active filter (users, teachers, students)
                let roleMatches = false;
                if (activeFilter === "users") {
                    // Show Admin and Staff users
                    roleMatches =
                        user.userRole?.toLowerCase() === "admin" ||
                        user.userRole?.toLowerCase() === "staff";
                } else if (activeFilter === "teachers") {
                    // Show only Teachers
                    roleMatches = user.userRole?.toLowerCase() === "teacher";
                } else if (activeFilter === "students") {
                    // Show only Students
                    roleMatches = user.userRole?.toLowerCase() === "student";
                }

                if (!roleMatches) return false;

                const searchTerm = searchItem?.toLowerCase() || "";
                const matchesSearch =
                    (user.firstName?.toLowerCase() || "").includes(searchTerm) ||
                    (user.lastName?.toLowerCase() || "").includes(searchTerm) ||
                    (user.middleName?.toLowerCase() || "").includes(searchTerm) ||
                    (user.username?.toLowerCase() || "").includes(searchTerm) ||
                    (user.email?.toLowerCase() || "").includes(searchTerm) ||
                    (user.phoneNumber?.toLowerCase() || "").includes(searchTerm) ||
                    (user.userRole?.toLowerCase() || "").includes(searchTerm);

                const matchesRole =
                    selectedCategory === "" || user.userRole === selectedCategory;

                return matchesSearch && matchesRole;
            }),
        [archiveUsers, searchItem, selectedCategory, activeFilter],
    )
    return { filteredUsers, setActiveFilter, activeFilter, setSelectedCategory }
}
