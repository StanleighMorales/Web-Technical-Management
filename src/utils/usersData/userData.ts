import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLoggedInUser } from "../../hooks/userHooks";
import type { TUsers } from "../../types/types";

export const UserData = () => {
    type TUserRequired = Pick<
        TUsers,
        | "id"
        | "username"
        | "lastName"
        | "middleName"
        | "firstName"
        | "email"
        | "phoneNumber"
        | "userRole"
        | "status"
    >;

    const [userData, setUserData] = useState<TUserRequired>({
        id: "",
        username: "",
        lastName: "",
        middleName: "",
        firstName: "",
        email: "",
        phoneNumber: "",
        userRole: "",
        status: "",
    });

    const { data } = useSuspenseQuery(useLoggedInUser());

    useEffect(() => {
        if (!data) console.log("User not found");
        setUserData(data);
    }, [data]);

    return userData;
};
