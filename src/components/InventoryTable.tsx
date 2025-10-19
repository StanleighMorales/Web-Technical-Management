import type { FC } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoArchive } from "react-icons/io5";
import logo from "../assets/img/aclcLogo.webp";
import { FormattedDateTime } from "./FormatedDateTime";
import { SlugCondition } from "./SlugCondition";
import { MdOutlineGridView } from "react-icons/md";
import { UserData } from "../utils/usersData/userData";
import PopUpModal from "./PopUpModal";

type checkIfUserAdminProps = {
  userRole?: string,
  onHandleArchiveItem: () => void
}

type InventoryTableProps = {
  id?: string;
  createdAt: string;
  ItemName: string;
  SerialNumber: string;
  Image: string | File;
  ItemType: string;
  Category: string;
  Condition: string;
  onMutate: (value: string) => void;
};

export default function InventoryTable({
  id,
  createdAt,
  ItemName,
  SerialNumber,
  Image,
  Category,
  Condition,
  onMutate,
}: InventoryTableProps) {

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const data = UserData()
  const userRole = data.userRole

  const handleArchiveItem = () => {
    setIsConfirmOpen(true)
  }

  const handleConfirmArchive = () => {
    onMutate(id!);
  }

  const handleCancelArchive = () => {
    setIsConfirmOpen(false)
  }

  const ShowButtonIfUserAdmin: FC<checkIfUserAdminProps> = ({
    userRole,
    onHandleArchiveItem,
  }) => {
    if (userRole !== "Admin") return null;
    return (
      <button
        onClick={onHandleArchiveItem}
        title="Archive item"
        className="text-orange-600 text-2xl cursor-pointer hover:text-orange-700 transition-colors"
      >
        <IoArchive />
      </button>
    );
  };

  return (
    <>
      <td className="py-3 px-4 font-semibold">{SerialNumber}</td>
      <td className="py-3 px-4">
        <img
          src={typeof Image === "string" ? Image : logo}
          alt={ItemName}
          className="w-10 h-10 rounded-xl"
        />
      </td>
      <td className="py-3 px-4">{ItemName}</td>
      <td className="py-3 px-4">{Category}</td>
      <td className="py-3 px-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${SlugCondition(Condition)}`}
        >
          {Condition}
        </span>
      </td>
      <td className="py-3 px-4">{FormattedDateTime(createdAt)}</td>
      <td className="py-3 px-4 flex flex-row ">
        <Link
          to={`/item/${id}`}
          title="View more"
          className="mr-2 text-blue-500 text-2xl"
        >
          <MdOutlineGridView />
        </Link>
        <ShowButtonIfUserAdmin
          userRole={userRole}
          onHandleArchiveItem={handleArchiveItem}
        />
      </td>
      {isConfirmOpen && (
        <PopUpModal
          label={"archive"}
          destination={"archive"}
          onHandleCancleAction={handleCancelArchive}
          onHandleConfirmAction={handleConfirmArchive}
        />
      )}
    </>
  );
}
