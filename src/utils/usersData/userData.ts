import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUserQuery } from "../../query/get/useUserQuery";
import type { TUsers } from "../../types/types";

export const UserData = () => {
    type TUserRequired = Pick<TUsers, "id" | "username" | "lastName" | "middleName" | "firstName" | "email" | "phoneNumber" | "userRole" | "status">

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
    })

    const { data } = useSuspenseQuery(useUserQuery())

    useEffect(() => {
        if (!data) console.log("User not found")
        setUserData(data)
    }, [data])

    return userData
}


