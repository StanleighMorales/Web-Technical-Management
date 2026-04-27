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
        if (userRole !== "Admin" && userRole !== "SuperAdmin" && userRole !== "Staff") return null;
        return (
            <button
                onClick={(e) => { e.stopPropagation(); onHandleArchiveStudent() }}
                title="Archive student"
                className="inline-flex items-center px-2.5 gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <IoArchive /> Archive
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
            <td className="flex flex-row py-3 px-6 gap-2">
                <button
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => { e.stopPropagation(); handleEditStudent(props.id) }}
                    title="Edit user"
                >
                    <CiEdit /> Edit
                </button>
                <ShowButtonIfUserAdmin
                    userRole={data.userRole}
                    onHandleArchiveStudent={handleArchiveStudent}
                />
            </td>
        </>
    );
}
