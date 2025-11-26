# Generated Password Feature - Verification Guide

## ✅ Changes Made

### 1. Backend (Already Complete)
- ✅ `GeneratedPassword` field exists in `Student` model
- ✅ Database migration applied
- ✅ API endpoint returns the field: `GET /api/v1/users/students/by-id-number/{studentIdNumber}`
- ✅ Service layer includes the field in responses

### 2. Frontend Updates (Just Completed)

#### Updated File: `src/query/get/useStudentByIdNumberQuery.ts`
Added `GeneratedPassword?: string;` to the `StudentDetails` type interface (line 19).

#### Already Implemented:
- ✅ `TStudent` type includes `generatedPassword?: string` (src/types/types.ts, line 157)
- ✅ `ViewStudentCredentials` component displays the password with show/hide toggle (src/components/ViewStudentCredentials.tsx, lines 169-189)

## 🧪 How to Test

### Step 1: Verify Backend Data
1. Open your backend API testing tool (Postman, Thunder Client, or browser)
2. Login to get an auth token
3. Call the endpoint:
   ```
   GET http://localhost:5278/api/v1/users/students/by-id-number/{studentIdNumber}
   Authorization: Bearer {your-token}
   ```
4. Check the response includes `generatedPassword` field

### Step 2: Test Frontend Display
1. Start your frontend development server:
   ```bash
   cd Web-Technical-Management
   npm run dev
   ```

2. Login to the application

3. Navigate to **Registration** page (or wherever students are listed)

4. Click on a student row to view their credentials

5. In the **Account Information** section, you should see:
   - **Generated Password** field with a password input (masked by default)
   - An eye icon button to show/hide the password

### Step 3: Import Students with Generated Passwords
If you don't have students with generated passwords yet:

1. Prepare an Excel file with columns: `LastName`, `FirstName`, `MiddleName` (optional)
2. Use the Excel import feature in the Registration page
3. The system will auto-generate passwords for each student
4. View the imported student's credentials to see the generated password

## 📋 Expected Behavior

### When Viewing Student Credentials:
- **If student has a generated password**: Shows the password (masked by default, can be revealed)
- **If student doesn't have a generated password**: Shows "N/A"

### Password Display Features:
- Password is masked by default (shows dots: ••••••••)
- Click the eye icon to reveal the password
- Click again to hide it
- The password field is read-only (cannot be edited from this view)

## 🔍 Troubleshooting

### Issue: Password shows "N/A"
**Possible causes:**
1. Student was created manually (not imported via Excel)
2. Student was created before the `GeneratedPassword` field was added
3. Database migration wasn't applied

**Solution:**
- Import students using the Excel import feature
- Or manually update the database to add passwords for existing students

### Issue: Password field not showing
**Possible causes:**
1. Frontend cache needs to be cleared
2. TypeScript types not updated

**Solution:**
```bash
# Clear frontend cache and rebuild
cd Web-Technical-Management
rm -rf node_modules/.vite
npm run dev
```

### Issue: API returns 404 or error
**Possible causes:**
1. Backend not running
2. Wrong API endpoint
3. Authentication token expired

**Solution:**
- Verify backend is running on the correct port
- Check the `.env` file has correct `VITE_API_BASE_URL`
- Re-login to get a fresh token

## 📝 API Response Example

```json
{
  "data": {
    "Id": "123e4567-e89b-12d3-a456-426614174000",
    "FirstName": "John",
    "MiddleName": "Michael",
    "LastName": "Doe",
    "StudentIdNumber": "2024-001",
    "Course": "Computer Science",
    "Section": "A",
    "Year": "3rd Year",
    "Email": "john.doe@example.com",
    "PhoneNumber": "1234567890",
    "Street": "123 Main St",
    "CityMunicipality": "Sample City",
    "Province": "Sample Province",
    "PostalCode": "12345",
    "FrontIdPicture": "base64string...",
    "BackIdPicture": "base64string...",
    "GeneratedPassword": "aB3$xY9@kL2m"
  },
  "message": "Student retrieved successfully",
  "success": true
}
```

## ✨ Summary

The generated password feature is now fully integrated:
- Backend stores and returns the password
- Frontend fetches and displays it
- UI includes show/hide toggle for security
- Works seamlessly with the Excel import feature

No further code changes needed - just test and verify!
