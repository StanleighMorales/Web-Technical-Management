import { MdVisibility } from "react-icons/md";
import { SlugStatus } from "./SlugStatus";
import type { FC } from "react";
import { FormattedDateTime } from "./FormatedDateTime";

type TRecentBorrowedItemsTableProps = {
  image: null;
  itemName: string;
  serialNumber: string;
  barcode?: null;
  barcodeImage?: null;
  borrowerFullName: string;
  room: string;
  teacherFullName: string;
  subjectTimeSchedule?: string;
  remarks: string | null;
  createdAt: string;
  onSetSelectedId?: (value: string) => void;
  onView?: (value: boolean) => void;
}
export const RecentBorrowedItemsTable: FC<TRecentBorrowedItemsTableProps> = ({
  image,
  itemName,
  serialNumber,
  borrowerFullName,
  room,
  teacherFullName,
  remarks,
  createdAt,
  onSetSelectedId,
  onView
}) => {

  const handleviewBorrowItemDetails = (id: string) => {
    if (onSetSelectedId && onView) {
      onSetSelectedId(id);
      onView(true);
    }
  }

  return (
    <>
      <td className="py-3 px-4">
        {serialNumber}
      </td>
      <td className="py-4 px-6">
        <img
          src={typeof image === "string" ? image : "-"}
          alt={itemName}
          className="w-10 h-10 rounded-xl"
        />
      </td>
      <td className="py-4 px-6">
        {itemName}
      </td>
      <td className="py-4 px-6">
        {borrowerFullName}
      </td>
      <td className="py-4 px-6">
        {teacherFullName || "-"}
      </td>
      <td className="py-4 px-6">
        {room || "-"}
      </td>
      <td className="py-4 px-6">
        {remarks}
      </td>
      <td className="py-4 px-6">
        {FormattedDateTime(createdAt)}
      </td>
      <td className="py-4 px-6 font-semibold text-center">
        <button onClick={() => handleviewBorrowItemDetails(serialNumber)}
          className="mr-2 text-2xl text-green-500"
          title="View more"
        >
          <MdVisibility />
        </button>
      </td>
    </>
  );
}
