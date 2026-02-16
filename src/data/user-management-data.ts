import { useQuery } from "@tanstack/react-query";
import type { TUsers } from "../types/types";
import { useEffect, useMemo, useState } from "react";
import { useAllUsers } from "../hooks/userHooks";

type TNewUserTypes = Omit<TUsers, "course" | "section" | "year">;

export const useAllUsersManagement = () => {
    const [users, setUsers] = useState<TNewUserTypes[]>([]);
    const { data, isPending, isError } = useQuery(useAllUsers());

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setUsers(data);
        }
    }, [data]);

    return { users, isPending, isError }
}

export const useFilteredUser = () => {
    const { users } = useAllUsersManagement()

    const [searchUser, setSearchUser] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedRole, setSelectedRole] = useState<string>("all");

    const filteredUser = useMemo(
        () =>
            users.filter((user) => {
                const userStatus = user.status.toLowerCase();
                const userRole = user.userRole.toLowerCase();
                const searchValue = searchUser.toLowerCase();
                const selectedStatusFilter = selectedStatus.toLowerCase();
                const selectedRoleFilter = selectedRole.toLowerCase();

                const matchesStatus =
                    selectedStatusFilter === "all"
                        ? true
                        : userStatus === selectedStatusFilter;

                const matchesRole =
                    selectedRoleFilter === "all" ? true : userRole === selectedRoleFilter;

                if (selectedStatusFilter !== "all" || selectedRoleFilter !== "all") {
                    return (
                        matchesStatus &&
                        matchesRole &&
                        (user.username.toLowerCase().includes(searchValue) ||
                            user.userRole.toLowerCase().includes(searchValue) ||
                            userStatus.includes(searchValue))
                    );
                }

                return (
                    user.username.toLowerCase().includes(searchValue) ||
                    user.userRole.toLowerCase().includes(searchValue) ||
                    userStatus.includes(searchValue)
                );
            }),
        [searchUser, selectedStatus, selectedRole, users],
    )

    return { filteredUser, setSearchUser, setSelectedStatus, selectedRole, setSelectedRole }
}