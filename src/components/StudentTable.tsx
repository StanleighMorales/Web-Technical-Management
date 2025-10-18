import { MdVisibility } from "react-icons/md";
import { IoArchive } from "react-icons/io5";
import type { FC } from "react";
import { CiEdit } from "react-icons/ci";
import { UserData } from "../utils/usersData/userData";

type StudentTableProps = {
    frontStudentIdPicture?: null,
    backStudentIdPicture?: null,
    studentIdNumber: string,
    phoneNumber: string,
    course: string,
    section: string,
    year: string,
    profilePicture?: null,
    street: string,
    cityMunicipality: string,
    province: string,
    postalCode: string,
    id: string,
    username: string,
    email: string,
    userRole: string,
    status: string,
    lastName: string,
    middleName: string,
    firstName: string
    onSetEditUserId: (value: string) => void,
    onSetIsEditStudentrOpen: (value: boolean) => void;
    onSetViewStudentId: (value: string) => void;
    onSetIsViewStudentOpen: (value: boolean) => void;
    onMutate: (value: string) => void;
};

export default function StudentTable({
    id,
    studentIdNumber,
    userRole,
    lastName,
    middleName,
    firstName,
    course,
    section,
    year,
    onSetIsEditStudentrOpen,
    onSetEditUserId,
    onSetViewStudentId,
    onSetIsViewStudentOpen,
    onMutate,
}: StudentTableProps) {

    const data = UserData()

    const handleArchiveStudent = () => {
        onMutate(id);
    };

    const handleEditStudent = (id: string) => {
        onSetEditUserId(id);
        onSetIsEditStudentrOpen(true);
    }
    const handleViewStudent = (id: string) => {
        onSetViewStudentId(id);
        onSetIsViewStudentOpen(true);
    };

    type ShowButtonIfUserAdminProps = {
        userRole?: string;
        onHandleArchiveStudent: () => void;
    };

    const ShowButtonIfUserAdmin: FC<ShowButtonIfUserAdminProps> = ({
        userRole,
        onHandleArchiveStudent,
    }) => {
        if (userRole !== "Admin") return null;
        return (
            <button
                onClick={onHandleArchiveStudent}
                title="Archive student"
                className="text-orange-600 text-2xl cursor-pointer hover:text-orange-700 transition-colors"
            >
                <IoArchive />
            </button>
        );
    };

    const getFullName = () => {
        const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
        return `${firstName} ${middleInitial} ${lastName}`.replace(/\s+/g, " ").trim();
    };

    return (
        <>
            <td className="py-3 px-6">{studentIdNumber}</td>
            <td className="py-3 px-6">{getFullName()}</td>
            <td className="py-3 px-6">{course }</td>
            <td className="py-3 px-6">{section}</td>
            <td className="py-3 px-6">{year}</td>
            <td className="py-3 px-6">{userRole}</td>
            <td className="py-3 px-6 flex flex-row">
                <button
                    className="mr-2 text-green-500 text-2xl hover:text-green-700 transition-colors"
                    onClick={() => handleViewStudent(id)}
                    title="View student credentials"
                >
                    <MdVisibility />
                </button>
                <button
                    className="mr-2 text-blue-500 text-2xl hover:text-blue-700 transition-colors"
                    onClick={() => handleEditStudent(id)}
                    title="Edit user"
                >
                    <CiEdit />
                </button>
                <ShowButtonIfUserAdmin
                    userRole={data.userRole}
                    onHandleArchiveStudent={handleArchiveStudent}
                />
            </td>
        </>
    );
}
