import { SlugStatus } from "./SlugStatus";
import no_image_svg from "../assets/no-image-svgrepo-com.svg";
import type { FC } from "react";
import { FormattedDateTime } from "./FormattedDateTime";

type TRecentBorrowedItemsTableProps = {
    id: string;
    image: string | null;
    itemName: string;
    serialNumber: string;
    borrowerFullName: string;
    room: string;
    teacherFullName: string;
    remarks: string | null;
    createdAt: string;
    status: string;
};

export const RecentBorrowedItemsTable: FC<TRecentBorrowedItemsTableProps> = (props) => {

    return (
        <>
            <td className="py-3 px-4">{props.serialNumber}</td>
            <td className="py-4 px-6">
                <img
                    src={typeof props.image === "string" ? props.image : no_image_svg}
                    alt={props.itemName}
                    className="object-cover w-10 h-10 rounded"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                />
            </td>
            <td className="py-4 px-6">{props.itemName}</td>
            <td className="py-4 px-6">{props.borrowerFullName}</td>
            <td className="py-4 px-6">{props.teacherFullName || "-"}</td>
            <td className="py-4 px-6">{props.room || "-"}</td>
            <td className="py-4 px-6">{props.remarks || "-"}</td>
            <td className="py-4 px-6">{FormattedDateTime(props.createdAt)}</td>
            <td className="py-4 px-6">
                <span className={`px-3 py-1 rounded-full text-sm ${SlugStatus(props.status)}`}>
                    {props.status}
                </span>
            </td>
        </>
    );
};
