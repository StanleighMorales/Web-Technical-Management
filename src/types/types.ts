export type TRegisterUser = {
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
    password: string;
    confirmPassword: string;
};

export type TLoginUser = {
    identifier: string;
    password: string;
};

export type TUserFormData = {
    username: string;
    lastName: string;
    middleName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    role: string;
    password: string;
    confirmPassword: string;
};

export type TTeacherFormData = {
    username: string;
    lastName: string;
    middleName: string;
    firstName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    department?: string;
    subject?: string;
};

export type TStudentFormData = {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    StudentIdNumber: string;
    Course: string;
    Section: string;
    Year: string;
    Street: string;
    Province: string;
    PostalCode: string;
    CityMunicipality: string;
    ProfilePicture?: string;
};

export type TUpdateUsers = {
    id: string;
    firstName: string,
    lastName: string,
    middleName: string,
    username: string,
    email: string,
    phoneNumber: string,
    position: string,
};

export type TForgotPasswordUser = {
    username: string;
};

export type TItemForm = {
    serialNumber: string;
    image: File | null;
    itemName: string;
    itemType: string;
    itemModel: string;
    itemMake: string;
    description: string;
    category: string;
    condition: string;
    preview: string | null;
};

export type TItemList = {
    id: string;
    serialNumber: string;
    image: string;
    itemName: string;
    itemType: string;
    itemModel: string;
    itemMake: string;
    description: string;
    category: string;
    condition: string;
    status: string;
    barcode: "",
    barcodeImage: "",
    createdAt: string;
    updatedAt?: string;
};

export type TEditItemForm = {
    Id: number;
    SerialNumber: string;
};

export type TArchiveItem = {
    id: string;
    serialNumber: string;
    image: string;
    itemName: string;
    itemType: string;
    itemModel: string;
    itemMake: string;
    description: string;
    category: string;
    condition: string;
    barcodeImage: string;
    archivedAt: string;
};

export type TBorrowItemForm = {
    itemId: string;
    itemName: string;
    borrowerFirstName: string;
    borrowerLastName: string;
    borrowerRole: string;
    teacherFirstName: string | null;
    teacherLastName: string | null;
    room: string;
    subjectTimeSchedule: string;
    remarks: string | null;
    studentIdNumber: string | null;
};

export type TStudent = {
    frontStudentIdPicture: null,
    backStudentIdPicture: null,
    studentIdNumber: string,
    phoneNumber: string,
    course: string,
    section: string,
    year: string,
    profilePicture: null,
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
};

export type TTeacher = {
    id: string;
    username: string;
    lastName: string;
    middleName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    department: string;
    subject: string;
    userRole: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
};
export type TUsers = {
    id: string;
    username: string;
    lastName: string;
    middleName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    course: string;
    section: string;
    year: string;
    userRole: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    position: string;
}

export type TUpdatedTeacher = {
    lastName: string,
    middleName: string,
    firstName: string,
    department: string
}
export type TUpdatedStudents = TStudent & {}

export type TArchiveStudent = {
    $type: string;
    archivedAt: string;
    backStudentIdPicture: string;
    cityMunicipality: string;
    course: string;
    email: string;
    firstName: string;
    frontStudentIdPicture: string;
    id: string;
    lastName: string;
    middleName: string;
    originalUserId: string;
    phoneNumber: string;
    postalCode: string;
    profilePicture: string;
    province: string;
    section: string;
    status: string;
    studentIdNumber: string;
    userRole: string;
    username: string;
    year: string;
    street: string;
};

export type TArchiveTeacher = {
    $type: string;
    archivedAt: string;
    department: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    middleName: string | null;
    originalUserId: string;
    phoneNumber: string;
    status: string;
    userRole: string;
    username: string;
};

export type TUpdatePassword = {
    newPassword: string;
    confirmPassword: string;
}


export type TRecentBorrowItemProps = {
    id: string;
    userId: null,
    teacherId: string,
    borrowerFullName: string,
    borrowerRole: string,
    teacherFullName: string,
    room: string,
    subjectTimeSchedule: string,
    lentAt: string,
    returnedAt: string,
    status: string,
    remarks: null,
    isHiddenFromUser: boolean,
    item: {
        id: string;
        serialNumber: string;
        barcode: null;
        barcodeImage: null;
        image: null;
        itemName: string;
        itemType: string;
        itemModel: string;
        itemMake: string;
        description: string;
        category: string;
        condition: string;
        createdAt: string;
        updatedAt: string;
    }
}

export type THistoryBorrwedItems = TRecentBorrowItemProps & {
};
