import type { FC } from "react";
import { useState } from "react";
import { IoArchive } from "react-icons/io5";
import logo from "../assets/img/aclcLogo.webp";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugCondition } from "./SlugCondition";
import { SlugStatus } from "./SlugStatus";
import { UserData } from "../utils/usersData/userData";
import PopUpModal from "./PopUpModal";
import { useNavigate } from "react-router-dom";

type checkIfUserAdminProps = {
    userRole?: string;
    onHandleArchiveItem: () => void;
};

type InventoryTableProps = {
    id?: string;
    createdAt: string;
    ItemName: string;
    SerialNumber: string;
    Image: string | File;
    ItemType: string;
    Category: string;
    Condition: string;
    Status: string;
    onMutate: (value: string) => void;
};

export const InventoryTable: FC<Required<InventoryTableProps>> = (props) => {
    const navigate = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const data = UserData();
    const userRole = data.userRole;

    const handleArchiveItem = () => {
        setIsConfirmOpen(true);
    };

    const handleConfirmArchive = () => {
        props.onMutate(props.id!);
    };

    const handleCancelArchive = () => {
        setIsConfirmOpen(false);
    };

    const ShowButtonIfUserAdmin: FC<checkIfUserAdminProps> = ({
        userRole,
        onHandleArchiveItem,
    }) => {
        if (userRole !== "Admin") return null;
        return (
            <button
                onClick={(e) => { e.stopPropagation(); onHandleArchiveItem() }}
                title="Archive item"
                className="text-2xl text-orange-600 transition-colors cursor-pointer hover:text-orange-700"
            >
                <IoArchive />
            </button>
        );
    };

    return (
        <>
            <tr onClick={() => navigate(`/item/${props.id}`)}
                className="transition-colors cursor-pointer odd:bg-white even:bg-[#f9fbff] hover:bg-[#f8fafc]">
                <td className="py-3 px-4">{props.SerialNumber}</td>
                <td className="py-3 px-4">
                    <img
                        src={typeof props.Image === "string" ? props.Image : logo}
                        alt={props.ItemName}
                        className="w-10 h-10 rounded-xl"
                    />
                </td>
                <td className="py-3 px-4">{props.ItemName}</td>
                <td className="py-3 px-4">{props.Category}</td>
                <td className="py-3 px-4">
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${SlugCondition(props.Condition)}`}
                    >
                        {props.Condition}
                    </span>
                </td>
                <td className="py-3 px-4">{FormattedDateTime(props.createdAt)}</td>
                <td className="py-3 px-4">
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${SlugStatus(props.Status)}`}
                    >
                        {props.Status}
                    </span>
                </td>
                <td onClick={(e) => e.stopPropagation()} className="flex flex-row py-3 px-4">
                    <ShowButtonIfUserAdmin
                        userRole={userRole}
                        onHandleArchiveItem={handleArchiveItem}
                    />
                </td>
            </tr>
            {
                isConfirmOpen && (
                    <PopUpModal
                        title={"Archive Item"}
                        label={"archive"}
                        noun={"item"}
                        destination={"archive"}
                        onHandleCancelAction={handleCancelArchive}
                        onHandleConfirmAction={handleConfirmArchive}
                    />
                )
            }
        </>
    );
};
