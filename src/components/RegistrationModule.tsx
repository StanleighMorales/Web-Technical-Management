import { useState, useMemo, useEffect } from "react";
import { AddTeacher } from "./AddTeacher";
import { AddStudent } from "./AddStudent";
import { EditTeacher } from "./EditTeacher";
import { EditStudent } from "./EditStudent";
import SearchBar from "./SearchBar";
import type { TStudent, TTeacher } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { useAllStudentsQuery } from "../query/get/useAllStudentsQuery";
import { useArchiveStudentMutation } from "../query/delete/useArchiveStudentMutation";
import { useArchiveTeacherMutation } from "../query/delete/useArchiveTeacherMutation";
import StudentTable from "./StudentTable";
import TeacherTable from "./TeacherTable";
import ViewStudentCredentials from "./ViewStudentCredentials";
import ViewTeacherCredentials from "./ViewTeacherCredentials";
import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import { useAllTeachersQuery } from "../query/get/useAllTeachersQuery";
import PopUpModal from "./PopUpModal";

export const RegistrationModule = () => {
    const [isAddTeacherOpen, setIsAddTeacherOpen] = useState<boolean>(false);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
    const [isEditTeacherOpen, setIsEditTeacherOpen] = useState<boolean>(false);
    const [isEditStudentOpen, setIsEditStudentOpen] = useState<boolean>(false);
    const [isViewStudentOpen, setIsViewStudentOpen] = useState<boolean>(false);
    const [isViewTeacherOpen, setIsViewTeacherOpen] = useState<boolean>(false);
    const [isArchiveStudentOpen, setIsArchiveStudentOpen] = useState<boolean>(false);
    const [isArchiveTeacherOpen, setIsArchiveTeacherOpen] = useState<boolean>(false);
    const [archiveStudentId, setArchiveStudentId] = useState<string>("");
    const [archiveTeacherId, setArchiveTeacherId] = useState<string>("");
    const [searchUser, setSearchUser] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("Teacher");
    const [editTeacherId, setEditTeacherId] = useState<string>("");
    const [editStudentId, setEditStudentId] = useState<string>("");
    const [viewStudentId, setViewStudentId] = useState<string>("");
    const [viewTeacherId, setViewTeacherId] = useState<string>("");
    const [students, setStudents] = useState<TStudent[]>([]);
    const [teachers, setTeachers] = useState<TTeacher[]>([]);

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

    const { data: studentsData } = useQuery(useAllStudentsQuery());
    const { data: teachersData } = useQuery(useAllTeachersQuery());
    const { mutate: archiveStudent } = useArchiveStudentMutation();
    const { mutate: archiveTeacher } = useArchiveTeacherMutation();

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
            filtered = filtered.filter(
                (student) =>
                    student.firstName.toLowerCase().includes(searchUser.toLowerCase()) ||
                    student.lastName.toLowerCase().includes(searchUser.toLowerCase()) ||
                    student.course.toLowerCase().includes(searchUser.toLowerCase())
            );
        }

        return filtered;
    }, [students, searchUser]);

    const filteredTeachers = useMemo(() => {
        let filtered = teachers;

        // Filter by search term
        if (searchUser) {
            filtered = filtered.filter(
                (teacher) =>
                    teacher.firstName.toLowerCase().includes(searchUser.toLowerCase()) ||
                    teacher.lastName.toLowerCase().includes(searchUser.toLowerCase())
            );
        }

        return filtered;
    }, [teachers, searchUser]);

    // const handleAddTeacher = () => {
    //     setIsAddTeacherOpen(true);
    // };

    // const handleAddStudent = () => {
    //     setIsAddStudentOpen(true);
    // };

    const handleRestoreStudent = (id: string) => {
        setArchiveStudentId(id)
        setIsArchiveStudentOpen(true)
    }

    const handleCancelRestore = () => {
        setIsArchiveStudentOpen(false)
        setArchiveStudentId("")
    }

    const handleConfirmRestoreItem = () => {
        if (archiveStudentId) {
            archiveStudent(archiveStudentId)
            setIsArchiveStudentOpen(false)
            setArchiveStudentId("")
        }
    }

    const handleArchiveTeacher = (id: string) => {
        setArchiveTeacherId(id)
        setIsArchiveTeacherOpen(true)
    }

    const handleCancelArchiveTeacher = () => {
        setIsArchiveTeacherOpen(false)
        setArchiveTeacherId("")
    }

    const handleConfirmArchiveTeacher = () => {
        if (archiveTeacherId) {
            archiveTeacher(archiveTeacherId)
            setIsArchiveTeacherOpen(false)
            setArchiveTeacherId("")
        }
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] p-6">
            <div className="w-full max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#1e293b] mb-2">
                        Registration Module
                    </h1>
                    <p className="text-[#64748b] text-lg">
                        Manage teachers and students registration
                    </p>
                </div>

                {/* Action Buttons */}
                {/* <div className="flex flex-wrap gap-4 mb-6">
                    <Button
                        onClick={handleAddTeacher}
                        name="New Teacher"
                    />
                    <Button
                        onClick={handleAddStudent}
                        name="New Student"
                    />
                </div> */}

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        {/* Role Filter Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[#64748b] font-semibold mr-2">Filter by Role:</span>
                            <button
                                onClick={() => setSelectedRole("Teacher")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${selectedRole === "Teacher"
                                    ? "bg-[#1827f9] text-white shadow-md"
                                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                                    }`}
                            >
                                Teachers
                            </button>
                            <button
                                onClick={() => setSelectedRole("Student")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${selectedRole === "Student"
                                    ? "bg-[#ed3a3a] text-white shadow-md"
                                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                                    }`}
                            >
                                Students
                            </button>
                        </div>

                        {/* Search */}
                        <div className="flex flex-col sm:flex-row gap-4 ml-auto">
                            <SearchBar
                                onChangeValue={setSearchUser}
                                placeholder="Search by name"
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-[#059669]/10 rounded-lg">
                                <FaChalkboardTeacher className="text-2xl text-[#059669]" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-[#64748b]">Teachers</p>
                                <p className="text-2xl font-bold text-[#1e293b]">{teachers.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-[#7c3aed]/10 rounded-lg">
                                <FaGraduationCap className="text-2xl text-[#7c3aed]" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-[#64748b]">Students</p>
                                <p className="text-2xl font-bold text-[#1e293b]">{students.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users/Students Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#e2e8f0]">
                        <h2 className="text-2xl font-bold text-[#1e293b]">
                            {selectedRole === "Student" ? "Students" : "Teachers"}
                            <span className="text-[#64748b] font-normal ml-2">
                                ({selectedRole === "Student" ? filteredStudents.length : filteredTeachers.length} {selectedRole === "Student" ? (filteredStudents.length === 1 ? "student" : "students") : (filteredTeachers.length === 1 ? "teacher" : "teachers")})
                            </span>
                        </h2>
                    </div>

                    {selectedRole === "Student" ? (
                        filteredStudents.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-6xl text-[#cbd5e1] mb-4">
                                    <div className="flex items-center justify-center"><FaGraduationCap className="text-center" /></div>
                                </div>
                                <h3 className="text-xl font-semibold text-[#64748b] mb-2">
                                    No students found
                                </h3>
                                <p className="text-[#94a3b8]">
                                    {searchUser
                                        ? "Try adjusting your search criteria"
                                        : "No students match the current filters"}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f8fafc]">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Student ID
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Full Name
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Course
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Section
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Year
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.map((student) => (
                                            <tr
                                                key={student.id}
                                                className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc]"
                                            >
                                                <StudentTable
                                                    id={student.id}
                                                    frontStudentIdPicture={student.frontStudentIdPicture}
                                                    backStudentIdPicture={student.backStudentIdPicture}
                                                    phoneNumber={student.phoneNumber}
                                                    street={student.street}
                                                    cityMunicipality={student.cityMunicipality}
                                                    province={student.province}
                                                    postalCode={student.postalCode}
                                                    username={student.username}
                                                    email={student.email}
                                                    userRole={student.userRole}
                                                    status={student.status}
                                                    firstName={student.firstName}
                                                    middleName={student.middleName}
                                                    lastName={student.lastName}
                                                    studentIdNumber={student.studentIdNumber}
                                                    course={student.course}
                                                    section={student.section}
                                                    year={student.year}
                                                    profilePicture={student.profilePicture}
                                                    onSetIsEditStudentrOpen={() => setIsEditStudentOpen(true)}
                                                    onSetEditUserId={() => setEditStudentId(student.id)}
                                                    onSetViewStudentId={() => setViewStudentId(student.id)}
                                                    onSetIsViewStudentOpen={() => setIsViewStudentOpen(true)}
                                                    onMutate={() => handleRestoreStudent(student.id)}
                                                />
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : (
                        filteredTeachers.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-6xl text-[#cbd5e1] mb-4">
                                    <div className="flex items-center justify-center"><FaChalkboardTeacher className="text-center" /></div>
                                </div>
                                <h3 className="text-xl font-semibold text-[#64748b] mb-2">
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
                                <table className="w-full">
                                    <thead className="bg-[#f8fafc]">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Full Name
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Username
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Role
                                            </th>
                                              <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeachers.map((teacher) => (
                                            <tr
                                                key={teacher.id}
                                                className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc]"
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
                                                    onSetIsEditUserOpen={() => setIsEditTeacherOpen(true)}
                                                    onSetViewUserId={() => setViewTeacherId(teacher.id)}
                                                    onSetIsViewUserOpen={() => setIsViewTeacherOpen(true)}
                                                    onMutate={() => handleArchiveTeacher(teacher.id)}
                                                />
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>

                {/* Description */}
                <p className="mt-6 text-[#64748b] text-sm text-center">
                    <span className="font-semibold">Tip:</span> Use filters and search to quickly locate users by role.
                </p>
            </div>

            {/* Modals */}
            {isArchiveStudentOpen && (
                <PopUpModal
                    title={"Restore Student"}
                    label={"restore"}
                    noun={"student"}
                    destination={"archive"}
                    onHandleCancleAction={handleCancelRestore}
                    onHandleConfirmAction={handleConfirmRestoreItem}
                />
            )}
            {isArchiveTeacherOpen && (
                <PopUpModal
                    title={"Archive Teacher"}
                    label={"archive"}
                    noun={"teacher"}
                    destination={"archive"}
                    onHandleCancleAction={handleCancelArchiveTeacher}
                    onHandleConfirmAction={handleConfirmArchiveTeacher}
                />
            )}
            {isAddTeacherOpen && (
                <AddTeacher
                    onClose={() => setIsAddTeacherOpen(false)}
                />
            )}
            {isAddStudentOpen && (
                <AddStudent
                    onClose={() => setIsAddStudentOpen(false)}
                />
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
};
