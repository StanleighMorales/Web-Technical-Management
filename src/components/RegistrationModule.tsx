import { useState, useMemo, useEffect, useCallback } from "react";
import type { TStudent, TTeacher } from "../@types/types.ts";
import { EditTeacher } from "./EditTeacher";
import { EditStudent } from "./EditStudent";
import SearchBar from "./SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useArchiveUser } from "../hooks/userHooks";
import { useAllUsers } from "../hooks/userHooks";
import { StudentTable } from "./StudentTable";
import TeacherTable from "./TeacherTable";
import ViewStudentCredentials from "./ViewStudentCredentials";
import ViewTeacherCredentials from "./ViewTeacherCredentials";
import PopUpModal from "./PopUpModal";
import ErrorTable from "./ErrorTables.tsx";
import { SuccessAlert } from "./SuccessAlert.tsx";
import ExcelImportUserButton from "./ExcelImportUserButton.tsx";
import {
    BookOpen,
    GraduationCap,
    Sparkles,
    ChevronRight,
    Search,
} from "lucide-react";

export default function RegistrationModule() {
    const [ShowAlert, setShowAlert] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<string>("");
    const [isEditTeacherOpen, setIsEditTeacherOpen] = useState<boolean>(false);
    const [isEditStudentOpen, setIsEditStudentOpen] = useState<boolean>(false);
    const [isViewStudentOpen, setIsViewStudentOpen] = useState<boolean>(false);
    const [isViewTeacherOpen, setIsViewTeacherOpen] = useState<boolean>(false);
    const [isArchiveStudentOpen, setIsArchiveStudentOpen] = useState<boolean>(false);
    const [isArchiveTeacherOpen, setIsArchiveTeacherOpen] = useState<boolean>(false);
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

    const handleViewTeacherCredentials = (id: string) => { setViewTeacherId(id); setIsViewTeacherOpen(true); };
    const handleViewStudentCredentials = (id: string) => { setViewStudentId(id); setIsViewStudentOpen(true); };

    const { data: studentsData, isError: isStudentStudentIsError } = useQuery(useAllUsers());
    const { data: teachersData, isError: isTeacherDataIsError } = useQuery(useAllUsers());
    const { mutate: archiveStudent } = useArchiveUser();
    const { mutate: archiveTeacher } = useArchiveUser();

    const selectedViewStudent = useMemo(() => students.find((s) => s.id === viewStudentId), [students, viewStudentId]);
    const selectedViewTeacher = useMemo(() => teachers.find((t) => t.id === viewTeacherId), [teachers, viewTeacherId]);
    const selectedEditTeacher = useMemo(() => teachers.find((t) => t.id === editTeacherId), [teachers, editTeacherId]);
    const selectedEditStudent = useMemo(() => students.find((s) => s.id === editStudentId), [students, editStudentId]);

    useEffect(() => { if (studentsData && Array.isArray(studentsData)) setStudents(studentsData); }, [studentsData]);
    useEffect(() => { if (teachersData && Array.isArray(teachersData)) setTeachers(teachersData); }, [teachersData]);

    const filteredStudents = useMemo(() => {
        if (!searchUser || selectedRole !== "Student") return students;
        return students.filter((s) =>
            String(s.studentIdNumber || "").toLowerCase().includes(searchUser.toLowerCase()) ||
            s.firstName.toLowerCase().includes(searchUser.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchUser.toLowerCase()) ||
            String(s.course || "").toLowerCase().includes(searchUser.toLowerCase()) ||
            String(s.section || "").toLowerCase().includes(searchUser.toLowerCase()) ||
            String(s.year || "").toLowerCase().includes(searchUser.toLowerCase()),
        );
    }, [students, searchUser, selectedRole]);

    const filteredTeachers = useMemo(() => {
        if (!searchUser || selectedRole !== "Teacher") return teachers;
        return teachers.filter((t) =>
            t.firstName.toLowerCase().includes(searchUser.toLowerCase()) ||
            t.lastName.toLowerCase().includes(searchUser.toLowerCase()) ||
            String(t.department || "").toLowerCase().includes(searchUser.toLowerCase()),
        );
    }, [teachers, searchUser, selectedRole]);

    const handleRestoreStudent = (id: string) => { setArchiveStudentId(id); setIsArchiveStudentOpen(true); };
    const handleCancelArchiveStudent = () => { setIsArchiveStudentOpen(false); setArchiveStudentId(""); };

    const handleConfirmArchiveStudent = useCallback(() => {
        if (!archiveStudentId) return;
        archiveStudent(archiveStudentId, {
            onSuccess: (data) => {
                setIsArchiveStudentOpen(false);
                setArchiveStudentId(null);
                setShowAlert(true);
                setShowMessage(data.message);
                setTimeout(() => { setShowAlert(false); setShowMessage(""); }, 3500);
            },
        });
    }, [archiveStudentId, archiveStudent]);

    const handleConfirmArchiveTeacher = useCallback(() => {
        if (!archiveTeacherId) return;
        archiveTeacher(archiveTeacherId, {
            onSuccess: (data) => {
                setIsArchiveTeacherOpen(false);
                setArchiveTeacherId(null);
                setShowAlert(true);
                setShowMessage(data.message);
                setTimeout(() => { setShowAlert(false); setShowMessage(""); }, 3500);
            },
        });
    }, [archiveTeacherId, archiveTeacher]);

    const handleArchiveTeacher = (id: string) => { setArchiveTeacherId(id); setIsArchiveTeacherOpen(true); };
    const handleCancelArchiveTeacher = () => { setIsArchiveTeacherOpen(false); setArchiveTeacherId(""); };

    const isTeacher = selectedRole === "Teacher";
    const activeStudents = filteredStudents.filter((s) => s.userRole === "Student");
    const activeTeachers = filteredTeachers.filter((t) => t.userRole === "Teacher");
    const activeCount = isTeacher ? activeTeachers.length : activeStudents.length;

    const teacherHeaders = ["Full Name", "Username", "Role", "Department", "Status", "Actions"];
    const studentHeaders = ["Student ID", "Full Name", "Course", "Section", "Year", "Role", "Actions"];

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

            {ShowAlert && <SuccessAlert message={showMessage} />}

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold mb-4">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Registration module</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                        Registered Module
                    </h1>
                    <p className="text-slate-500 font-medium text-base max-w-xl leading-relaxed">
                        Manage teacher and student registrations, edit profiles, and archive records.
                    </p>
                </div>

                {/* Stat chips */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
                        <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <span>{teachers.filter((t) => t.userRole === "Teacher").length} teachers</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
                        <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center">
                            <GraduationCap className="h-3.5 w-3.5 text-violet-600" />
                        </div>
                        <span>{students.filter((s) => s.userRole === "Student").length} students</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

                {/* Toolbar */}
                <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                    {/* Segmented role tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
                        <button
                            onClick={() => { setSelectedRole("Teacher"); setSearchUser(""); }}
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                isTeacher ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <BookOpen className="h-3.5 w-3.5" />
                            Teachers
                        </button>
                        <button
                            onClick={() => { setSelectedRole("Student"); setSearchUser(""); }}
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                !isTeacher ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <GraduationCap className="h-3.5 w-3.5" />
                            Students
                        </button>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        {!isTeacher && <ExcelImportUserButton />}
                        <SearchBar
                            onChangeValue={setSearchUser}
                            placeholder={
                                isTeacher
                                    ? "Search by name or department"
                                    : "Search by name, ID, course, section, or year"
                            }
                        />
                    </div>
                </div>

                {/* Table sub-header */}
                <div className="px-6 md:px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            {isTeacher
                                ? <><BookOpen className="h-4 w-4 text-emerald-500" /> Teachers</>
                                : <><GraduationCap className="h-4 w-4 text-violet-500" /> Students</>
                            }
                        </h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {activeCount} {isTeacher ? "teacher" : "student"}{activeCount !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <div className="min-h-[50vh] max-h-[50vh] overflow-y-auto">

                        {isTeacher && (
                            isTeacherDataIsError ? <ErrorTable /> :
                            activeTeachers.length === 0 ? (
                                <EmptyState icon={BookOpen} label="teachers" hasSearch={!!searchUser} />
                            ) : (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {teacherHeaders.map((h) => (
                                                <th key={h} className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                    {h}
                                                </th>
                                            ))}
                                            <th className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {activeTeachers.map((teacher) => (
                                            <tr
                                                key={teacher.id}
                                                onClick={() => handleViewTeacherCredentials(teacher.id)}
                                                className="group transition-all duration-200 hover:bg-violet-50/30 cursor-pointer"
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
                                                    onMutate={() => handleArchiveTeacher(teacher.id)}
                                                />
                                                <td className="px-6 py-4">
                                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 transition-colors" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        )}

                        {!isTeacher && (
                            isStudentStudentIsError ? <ErrorTable /> :
                            activeStudents.length === 0 ? (
                                <EmptyState icon={GraduationCap} label="students" hasSearch={!!searchUser} />
                            ) : (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {studentHeaders.map((h) => (
                                                <th key={h} className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                    {h}
                                                </th>
                                            ))}
                                            <th className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {activeStudents.map((student) => (
                                            <tr
                                                key={student.id}
                                                onClick={() => handleViewStudentCredentials(student.id)}
                                                className="group transition-all duration-200 hover:bg-violet-50/30 cursor-pointer"
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
                                                    onSetIsEditStudentOpen={() => setIsEditStudentOpen(true)}
                                                    onSetEditUserId={() => setEditStudentId(student.id)}
                                                    onMutate={() => handleRestoreStudent(student.id)}
                                                />
                                                <td className="px-6 py-4">
                                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 transition-colors" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        )}
                    </div>
                </div>

                {/* Footer hint */}
                <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-xs text-slate-400 font-medium">
                        <span className="font-semibold text-slate-500">Tip:</span> Click any row to view credentials. Use the role tabs and search to filter quickly.
                    </p>
                </div>
            </div>

            {isArchiveStudentOpen && (
                <PopUpModal
                    title="Archive Student" label="archive" noun="student" destination="archive"
                    onHandleCancelAction={handleCancelArchiveStudent}
                    onHandleConfirmAction={handleConfirmArchiveStudent}
                />
            )}
            {isArchiveTeacherOpen && (
                <PopUpModal
                    title="Archive Teacher" label="archive" noun="teacher" destination="archive"
                    onHandleCancelAction={handleCancelArchiveTeacher}
                    onHandleConfirmAction={handleConfirmArchiveTeacher}
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
}


function EmptyState({ icon: Icon, label, hasSearch }: { icon: any; label: string; hasSearch: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-8">
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                {hasSearch
                    ? <Search className="h-8 w-8 text-slate-300" />
                    : <Icon className="h-8 w-8 text-slate-300" />
                }
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No {label} found</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                {hasSearch
                    ? "Try adjusting your search criteria."
                    : `No ${label} match the current filters.`}
            </p>
        </div>
    );
}
