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
    onSetIsEditStudentOpen: (value: boolean) => void;
    onMutate: (value: string) => void;
};

type TStudentNewTypes = Pick<StudentTableProps, "id" | "studentIdNumber" | "userRole" | "lastName" | "phoneNumber" | "middleName" | "firstName" | "course" | "section" | "year" | "onSetIsEditStudentOpen" | "onSetEditUserId" | "onMutate">

export const StudentTable: FC<TStudentNewTypes> = (props) => {

    const data = UserData()

    const handleArchiveStudent = () => {
        props.onMutate(props.id);
    };

    const handleEditStudent = (id: string) => {
        props.onSetEditUserId(id);
        props.onSetIsEditStudentOpen(true);
    }

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
                onClick={(e) => { e.stopPropagation(); onHandleArchiveStudent() }}
                title="Archive student"
                className="text-2xl text-orange-600 transition-colors cursor-pointer hover:text-orange-700"
            >
                <IoArchive />
            </button>
        );
    };

    const getFullName = () => {
        const middleInitial = props.middleName ? `${props.middleName.charAt(0)}.` : "";
        return `${props.firstName} ${middleInitial} ${props.lastName}`.replace(/\s+/g, " ").trim();
    };

    return (
        <>
            <td className="py-3 px-6">{props.studentIdNumber}</td>
            <td className="py-3 px-6">{getFullName()}</td>
            <td className="py-3 px-6">{props.course}</td>
            <td className="py-3 px-6">{props.section}</td>
            <td className="py-3 px-6">{props.year}</td>
            <td className="py-3 px-6">{props.userRole}</td>
            <td className="flex flex-row py-3 px-6">
                <button
                    className="mr-2 text-2xl text-blue-500 transition-colors hover:text-blue-700"
                    onClick={(e) => { e.stopPropagation(); handleEditStudent(props.id) }}
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
