import { useState, useMemo, useEffect, useCallback } from "react";
import { AddTeacher } from "./AddTeacher";
import { AddStudent } from "./AddStudent";
import { EditTeacher } from "./EditTeacher";
import { EditStudent } from "./EditStudent";
import SearchBar from "./SearchBar";
import type { TStudent, TTeacher } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { useAllStudentsQuery } from "../query/get/useAllStudentsQuery";
import { useAllTeachersQuery } from "../query/get/useAllTeachersQuery";
import { useArchiveStudentMutation } from "../query/delete/useArchiveStudentMutation";
import { useArchiveTeacherMutation } from "../query/delete/useArchiveTeacherMutation";
import { StudentTable } from "./StudentTable";
import TeacherTable from "./TeacherTable";
import ViewStudentCredentials from "./ViewStudentCredentials";
import ViewTeacherCredentials from "./ViewTeacherCredentials";
import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import PopUpModal from "./PopUpModal";
import ErrorTable from "./ErrorTables.tsx";
import { SuccessAlert } from "./SuccessAlert.tsx";
import ExcelImportUserButton from "./ExcelImportUserButton.tsx";

export default function RegistrationModule() {
    const [ShowAlert, setShowAlert] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<string>("");
    const [isAddTeacherOpen, setIsAddTeacherOpen] = useState<boolean>(false);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
    const [isEditTeacherOpen, setIsEditTeacherOpen] = useState<boolean>(false);
    const [isEditStudentOpen, setIsEditStudentOpen] = useState<boolean>(false);
    const [isViewStudentOpen, setIsViewStudentOpen] = useState<boolean>(false);
    const [isViewTeacherOpen, setIsViewTeacherOpen] = useState<boolean>(false);
    const [isArchiveStudentOpen, setIsArchiveStudentOpen] =
        useState<boolean>(false);
    const [isArchiveTeacherOpen, setIsArchiveTeacherOpen] =
        useState<boolean>(false);
    const [archiveStudentId, setArchiveStudentId] = useState<string | null>(null);
    const [archiveTeacherId, setArchiveTeacherId] = useState<string | null>(null);
    const [searchUser, setSearchUser] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("Teacher");
    const [editTeacherId, setEditTeacherId] = useState<string>("");
    const [editStudentId, setEditStudentId] = useState<string>("");
    const [viewStudentId, setViewStudentId] = useState<string>("");
    const [viewTeacherId, setViewTeacherId] = useState<string>("");
    const [students, setStudents] = useState<TStudent[]>([]);
    const [teachers, setTeachers] = useState<TTeacher[]>([]);

    const handleViewTeacherCredentials = (id: string) => {
        setViewTeacherId(id);
        setIsViewTeacherOpen(true);
    }
    const handleViewStudentCredentials = (id: string) => {
        setViewStudentId(id);
        setIsViewStudentOpen(true);
    }
    const { data: studentsData, isError: isStudentStudentIsError } = useQuery(
        useAllStudentsQuery()
    );
    const { data: teachersData, isError: isTeacherDataIsError } = useQuery(
        useAllTeachersQuery()
    );
    const { mutate: archiveStudent } = useArchiveStudentMutation();
    const { mutate: archiveTeacher } = useArchiveTeacherMutation();

    const selectedViewStudent = useMemo(() => {
        return students.find((s) => s.id === viewStudentId);
    }, [students, viewStudentId]);

    const selectedViewTeacher = useMemo(() => {
        return teachers.find((t) => t.id === viewTeacherId);
    }, [teachers, viewTeacherId]);

    const selectedEditTeacher = useMemo(() => {
        return teachers.find((t) => t.id === editTeacherId);
    }, [teachers, editTeacherId]);

    const selectedEditStudent = useMemo(() => {
        return students.find((s) => s.id === editStudentId);
    }, [students, editStudentId]);

    useEffect(() => {
        if (studentsData && Array.isArray(studentsData)) {
            setStudents(studentsData);
        }
    }, [studentsData]);

    useEffect(() => {
        if (teachersData && Array.isArray(teachersData)) {
            setTeachers(teachersData);
        }
    }, [teachersData]);

    const filteredStudents = useMemo(() => {
        let filtered = students;
        // Filter by search term
        if (searchUser) {
            if (selectedRole === "Student") {
                filtered = filtered.filter(
                    (student) =>
                        String(student.studentIdNumber || "")
                            .toLowerCase()
                            .includes(searchUser.toLowerCase()) ||
                        student.firstName
                            .toLowerCase()
                            .includes(searchUser.toLowerCase()) ||
                        student.lastName.toLowerCase().includes(searchUser.toLowerCase()) ||
                        String(student.course || "")
                            .toLowerCase()
                            .includes(searchUser.toLowerCase()) ||
                        String(student.section || "")
                            .toLowerCase()
                            .includes(searchUser.toLowerCase()) ||
                        String(student.year || "")
                            .toLowerCase()
                            .includes(searchUser.toLowerCase())
                );
            }
        }
        return filtered;
    }, [students, searchUser, selectedRole]);

    const filteredTeachers = useMemo(() => {
        let filtered = teachers;

        // Filter by search term
        if (searchUser) {
            if (selectedRole === "Teacher") {
                filtered = filtered.filter(
                    (teacher) =>
                        teacher.firstName
                            .toLowerCase()
                            .includes(searchUser.toLowerCase()) ||
                        teacher.lastName.toLowerCase().includes(searchUser.toLowerCase()) ||
                        String(teacher.department || "")
                            .toLowerCase()
                            .includes(searchUser.toLowerCase())
                );
            }
        }
        return filtered;
    }, [teachers, searchUser, selectedRole]);

    const handleRestoreStudent = (id: string) => {
        setArchiveStudentId(id);
        setIsArchiveStudentOpen(true);
    };

    const handleCancelArchiveStudent = () => {
        setIsArchiveStudentOpen(false);
        setArchiveStudentId("");
    };

    const handleConfirmArchiveStudent = useCallback(() => {
        if (archiveStudentId) {
            archiveStudent(archiveStudentId, {
                onSuccess: (data) => {
                    setIsArchiveStudentOpen(false);
                    setArchiveStudentId(null);
                    setShowAlert(true);
                    setShowMessage(data.message);
                    setTimeout(() => {
                        setShowAlert(false);
                        setShowMessage("");
                    }, 3500);
                },
            });
        }
    }, [archiveStudentId, archiveStudent]);

    const handleConfirmArchiveTeacher = useCallback(() => {
        if (archiveTeacherId) {
            archiveTeacher(archiveTeacherId, {
                onSuccess: (data) => {
                    setIsArchiveTeacherOpen(false);
                    setArchiveTeacherId(null);
                    setShowAlert(true);
                    setShowMessage(data.message);
                    setTimeout(() => {
                        setShowAlert(false);
                        setShowMessage("");
                    }, 3500);
                },
            });
        }
    }, [archiveTeacherId, archiveTeacher]);

    const handleArchiveTeacher = (id: string) => {
        setArchiveTeacherId(id);
        setIsArchiveTeacherOpen(true);
    };

    const handleCancelArchiveTeacher = () => {
        setIsArchiveTeacherOpen(false);
        setArchiveTeacherId("");
    };

    return (
        <div className="p-6 w-full min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]">
            {ShowAlert && <SuccessAlert message={showMessage} />}
            <div className="mx-auto w-full max-w-8xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-5xl mt-10 lg:mt-0 md:mt-0 font-extrabold tracking-tight text-[#1e293b] drop-shadow-lg">
                        Registered Module
                    </h1>
                    <p className="text-lg text-[#64748b]">
                        Manage teachers and students registration
                    </p>
                </div>

                {/* Filters */}
                <div className="p-6 mb-6 bg-white rounded-2xl shadow-lg">
                    <div className="flex flex-col gap-4 items-start md:flex-row lg:flex-row lg:items-center">
                        {/* Role Filter Buttons */}
                        <div className="flex lg:flex-wrap gap-2">
                            <span className="mr-2 hidden lg:block font-semibold text-[#64748b]">
                                Filter by Role:
                            </span>
                            <button
                                onClick={() => setSelectedRole("Teacher")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${selectedRole === "Teacher"
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-[#f1f5f9] text-gray-500 border-2 border-white/30 hover:border-[#2563eb] hover:text-[#2563eb]"
                                    }`}
                            >
                                Teachers
                            </button>
                            <button
                                onClick={() => setSelectedRole("Student")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${selectedRole === "Student"
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-[#f1f5f9] text-gray-500 border-2 border-white/30 hover:border-[#2563eb] hover:text-[#2563eb]"
                                    }`}
                            >
                                Students
                            </button>
                        </div>

                        {/* Search */}
                        <div className="flex flex-col gap-4 ml-auto lg:flex-row">
                            <div className="mt-1">
                                {selectedRole === "Student" && <ExcelImportUserButton />}
                            </div>
                            <div>
                                <SearchBar
                                    onChangeValue={setSearchUser}
                                    placeholder={selectedRole === "Student" ? "Search by name, ID, course, section, or year" : "Search by name or department"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                    <div className="p-4 bg-white rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-[#059669]/10">
                                <FaChalkboardTeacher className="text-2xl text-[#059669]" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-[#64748b]">Teachers</p>
                                <p className="text-2xl font-bold text-[#1e293b]">
                                    {teachers.filter((t) => t.userRole === "Teacher").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-[#7c3aed]/10">
                                <FaGraduationCap className="text-2xl text-[#7c3aed]" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-[#64748b]">Students</p>
                                <p className="text-2xl font-bold text-[#1e293b]">
                                    {students.filter((s) => s.userRole === "Student").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users/Students Table */}
                <div className="overflow-hidden bg-white rounded-2xl shadow-lg">
                    <div className="p-6 border-b border-[#e2e8f0]">
                        <h2 className="text-2xl font-bold text-[#1e293b]">
                            {selectedRole === "Student" ? "Students" : "Teachers"}
                            <span className="ml-2 font-normal text-[#64748b]">
                                (
                                {selectedRole === "Student"
                                    ? filteredStudents.filter(
                                        (student) => student.userRole === "Student"
                                    ).length
                                    : filteredTeachers.filter(
                                        (teacher) => teacher.userRole === "Teacher"
                                    ).length}{" "}
                                {selectedRole === "Student"
                                    ? filteredStudents.length === 1
                                        ? "student"
                                        : "students"
                                    : filteredTeachers.length === 1
                                        ? "teacher"
                                        : "teachers"}
                                )
                            </span>
                        </h2>
                    </div>

                    {selectedRole === "Student" ? (
                        filteredStudents.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mb-4 text-6xl text-[#cbd5e1]">
                                    <div className="flex justify-center items-center">
                                        <FaGraduationCap className="text-center" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-[#64748b]">
                                    No students found
                                </h3>
                                <p className="text-[#94a3b8]">
                                    {searchUser
                                        ? "Try adjusting your search criteria"
                                        : "No students match the current filters"}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto h-[22rem]">
                                {isStudentStudentIsError ? <ErrorTable /> : (
                                    <table className="w-full">
                                        <thead className="bg-[#f8fafc]">
                                            <tr>
                                                <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                    Student ID
                                                </th>
                                                <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                    Full Name
                                                </th>
                                                <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                    Course
                                                </th>
                                                <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                    Section
                                                </th>
                                                <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                    Year
                                                </th>
                                                <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                    Role
                                                </th>
                                                <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents
                                                .filter((student) => student.userRole === "Student")
                                                .map((student) => (
                                                    <tr
                                                        key={student.id}
                                                        onClick={() => handleViewStudentCredentials(student.id)}
                                                        className="transition-colors odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                                                    >
                                                        <StudentTable
                                                            id={student.id}
                                                            phoneNumber={student.phoneNumber}
                                                            userRole={student.userRole}
                                                            firstName={student.firstName}
                                                            middleName={student.middleName}
                                                            lastName={student.lastName}
                                                            studentIdNumber={student.studentIdNumber}
                                                            course={student.course}
                                                            section={student.section}
                                                            year={student.year}
                                                            onSetIsEditStudentOpen={() =>
                                                                setIsEditStudentOpen(true)
                                                            }
                                                            onSetEditUserId={() => setEditStudentId(student.id)}
                                                            onMutate={() => handleRestoreStudent(student.id)}
                                                        />
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )
                    ) : filteredTeachers.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mb-4 text-6xl text-[#cbd5e1]">
                                <div className="flex justify-center items-center">
                                    <FaChalkboardTeacher className="text-center" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-[#64748b]">
                                No teachers found
                            </h3>
                            <p className="text-[#94a3b8]">
                                {searchUser
                                    ? "Try adjusting your search criteria"
                                    : "No teachers match the current filters"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto h-[22rem]">
                            {isTeacherDataIsError ? (
                                <ErrorTable />
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-[#f8fafc]">
                                        <tr>
                                            <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                Full Name
                                            </th>
                                            <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                Username
                                            </th>
                                            <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                Role
                                            </th>
                                            <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                Department
                                            </th>
                                            <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                Status
                                            </th>
                                            <th className="py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeachers
                                            .filter((teacher) => teacher.userRole === "Teacher")
                                            .map((teacher) => (
                                                <tr
                                                    key={teacher.id}
                                                    onClick={() => handleViewTeacherCredentials(teacher.id)}
                                                    className="transition-colors odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                                                >
                                                    <TeacherTable
                                                        id={teacher.id}
                                                        firstName={teacher.firstName}
                                                        lastName={teacher.lastName}
                                                        middleName={teacher.middleName}
                                                        username={teacher.username}
                                                        email={teacher.email}
                                                        userRole={teacher.userRole}
                                                        department={teacher.department}
                                                        status={teacher.status}
                                                        onSetEditUserId={() => setEditTeacherId(teacher.id)}
                                                        onSetIsEditUserOpen={() =>
                                                            setIsEditTeacherOpen(true)
                                                        }
                                                        onMutate={() => handleArchiveTeacher(teacher.id)}
                                                    />
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="mt-6 text-sm text-center text-[#64748b]">
                    <span className="font-semibold">Tip:</span> Use filters and search to
                    quickly locate users by role.
                </p>
            </div>

            {/* Modals */}
            {isArchiveStudentOpen && (
                <PopUpModal
                    title={"Restore Student"}
                    label={"restore"}
                    noun={"student"}
                    destination={"archive"}
                    onHandleCancelAction={handleCancelArchiveStudent}
                    onHandleConfirmAction={handleConfirmArchiveStudent}
                />
            )}
            {isArchiveTeacherOpen && (
                <PopUpModal
                    title={"Archive Teacher"}
                    label={"archive"}
                    noun={"teacher"}
                    destination={"archive"}
                    onHandleCancelAction={handleCancelArchiveTeacher}
                    onHandleConfirmAction={handleConfirmArchiveTeacher}
                />
            )}
            {isAddTeacherOpen && (
                <AddTeacher onClose={() => setIsAddTeacherOpen(false)} />
            )}
            {isAddStudentOpen && (
                <AddStudent onClose={() => setIsAddStudentOpen(false)} />
            )}
            {isViewStudentOpen && selectedViewStudent && (
                <ViewStudentCredentials
                    student={selectedViewStudent}
                    isOpen={isViewStudentOpen}
                    onClose={() => setIsViewStudentOpen(false)}
                />
            )}
            {isViewTeacherOpen && selectedViewTeacher && (
                <ViewTeacherCredentials
                    teacher={selectedViewTeacher}
                    isOpen={isViewTeacherOpen}
                    onClose={() => setIsViewTeacherOpen(false)}
                />
            )}
            {isEditTeacherOpen && selectedEditTeacher && (
                <EditTeacher
                    id={selectedEditTeacher.id}
                    firstName={selectedEditTeacher.firstName}
                    middleName={selectedEditTeacher.middleName}
                    lastName={selectedEditTeacher.lastName}
                    department={selectedEditTeacher.department}
                    onClose={() => setIsEditTeacherOpen(false)}
                />
            )}
            {isEditStudentOpen && selectedEditStudent && (
                <EditStudent
                    id={selectedEditStudent.id}
                    firstName={selectedEditStudent.firstName}
                    middleName={selectedEditStudent.middleName}
                    lastName={selectedEditStudent.lastName}
                    frontStudentIdPicture={selectedEditStudent.frontStudentIdPicture}
                    backStudentIdPicture={selectedEditStudent.backStudentIdPicture}
                    studentIdNumber={selectedEditStudent.studentIdNumber}
                    phoneNumber={selectedEditStudent.phoneNumber}
                    course={selectedEditStudent.course}
                    section={selectedEditStudent.section}
                    year={selectedEditStudent.year}
                    profilePicture={selectedEditStudent.profilePicture}
                    street={selectedEditStudent.street}
                    cityMunicipality={selectedEditStudent.cityMunicipality}
                    province={selectedEditStudent.province}
                    postalCode={selectedEditStudent.postalCode}
                    username={selectedEditStudent.username}
                    email={selectedEditStudent.email}
                    userRole={selectedEditStudent.userRole}
                    status={selectedEditStudent.status}
                    onClose={() => setIsEditStudentOpen(false)}
                />
            )}
        </div>
    );
}
