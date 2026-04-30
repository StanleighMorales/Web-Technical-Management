# SignalR Setup Guide - Frontend

## Quick Start

### 1. Add to Your App.tsx

```typescript
import { useAuth } from './context/AuthContext'; // Your auth context
import AdminNotificationListener from './components/AdminNotificationListener';
import StudentNotificationListener from './components/StudentNotificationListener';

function App() {
  const { user } = useAuth(); // Get current user

  return (
    <>
      {/* Load appropriate listener based on user role */}
      {(user?.role === 'Admin' || user?.role === 'Staff' || user?.role === 'SuperAdmin') && (
        <AdminNotificationListener />
      )}
      
      {user?.role === 'Student' && user?.id && (
        <StudentNotificationListener userId={user.id} />
      )}

      {/* Your other components */}
      <YourRoutes />
    </>
  );
}
```

### 2. Ensure Toast Notifications are Configured

Make sure you have `react-toastify` set up in your app:

```typescript
// In your main.tsx or App.tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Your app content */}
    </>
  );
}
```

### 3. Environment Variable

Make sure your `.env` file has the API URL:

```env
VITE_API_URL=http://localhost:5278
```

For production:
```env
VITE_API_URL=https://your-production-api.com
```

## How It Works

### For Admin/Staff (Web App)

1. **Connects to SignalR** when app loads
2. **Joins `admin_staff` group** automatically
3. **Listens for:**
   - `ReceiveNewPendingRequest` - When students create requests
   - `ReceiveApprovalNotification` - When requests are approved
   - `ReceiveStatusChangeNotification` - When status changes

4. **Shows toast notifications** for each event
5. **Auto-refreshes data** using React Query

### For Students (Web/Mobile)

1. **Connects to SignalR** when app loads
2. **Joins `user_{userId}` group** automatically
3. **Listens for:**
   - `ReceiveApprovalNotification` - When their request is approved
   - `ReceiveStatusChangeNotification` - When their item status changes

4. **Shows toast notifications** for each event
5. **Auto-refreshes data** using React Query

## Testing

### 1. Start Backend
```bash
cd BackendTechnicalAssetsManagement
dotnet run
```

### 2. Start Frontend
```bash
cd Web-Technical-Management
npm run dev
```

### 3. Test Flow

**Test New Pending Request Notification:**
1. Login as a student (or use API)
2. Create a new lent item request:
   ```bash
   POST http://localhost:5278/api/v1/lentItems
   {
     "itemId": "some-guid",
     "userId": "student-guid",
     "status": "Pending"
   }
   ```
3. Admin/Staff should see a toast notification immediately

**Test Approval Notification:**
1. Login as admin/staff
2. Approve a pending request:
   ```bash
   PATCH http://localhost:5278/api/v1/lentItems/{id}
   {
     "lentItemsStatus": "Approved"
   }
   ```
3. Student should see approval notification immediately

## Notification Events

| Event | Who Receives | When | Data |
|-------|-------------|------|------|
| `ReceiveNewPendingRequest` | Admin/Staff | Student creates request | itemName, borrowerName, reservedFor |
| `ReceiveApprovalNotification` | Student + Admin/Staff | Request approved | itemName, message |
| `ReceiveStatusChangeNotification` | Student + Admin/Staff | Status changes | oldStatus, newStatus, itemName |

## Customization

### Change Toast Position
Edit `AdminNotificationListener.tsx` or `StudentNotificationListener.tsx`:

```typescript
toast.info(notification.message, {
  position: 'bottom-right', // Change position
  autoClose: 3000,          // Change duration
  theme: 'dark',            // Change theme
});
```

### Add Sound Notification
```typescript
const playNotificationSound = () => {
  const audio = new Audio('/notification-sound.mp3');
  audio.play();
};

// In your listener
subscribe('ReceiveNewPendingRequest', (notification) => {
  playNotificationSound();
  toast.info(notification.message);
});
```

### Add Badge Count
```typescript
const [pendingCount, setPendingCount] = useState(0);

subscribe('ReceiveNewPendingRequest', (notification) => {
  setPendingCount(prev => prev + 1);
  // Update badge in UI
});
```

## Troubleshooting

### Not Receiving Notifications

1. **Check connection:**
   ```typescript
   import { signalRService } from './services/signalrService';
   console.log('Connected:', signalRService.isConnected());
   ```

2. **Check browser console** for connection errors

3. **Verify token** is valid:
   ```typescript
   import Cookies from 'js-cookie';
   console.log('Token:', Cookies.get('token'));
   ```

4. **Check backend logs** to see if notifications are being sent

### CORS Issues

Make sure backend `Program.cs` has correct CORS configuration:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontends", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // For development
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### Connection Drops

The service has automatic reconnection built-in with retry intervals:
- 0ms (immediate)
- 2 seconds
- 5 seconds
- 10 seconds
- 30 seconds

Check console for reconnection messages.

## Mobile App Integration

For Flutter or React Native, use the same hub endpoint and events.

### Flutter Example
```dart
import 'package:signalr_netcore/signalr_client.dart';

final connection = HubConnectionBuilder()
    .withUrl('http://your-api/notificationHub')
    .build();

await connection.start();
await connection.invoke('JoinUserGroup', args: [userId]);

connection.on('ReceiveApprovalNotification', (arguments) {
  final notification = arguments?[0];
  // Show notification
});
```

### React Native Example
```typescript
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('http://your-api/notificationHub')
  .build();

await connection.start();
await connection.invoke('JoinUserGroup', userId);

connection.on('ReceiveApprovalNotification', (notification) => {
  // Show notification
});
```

## Summary

✅ **Files Created:**
- `src/services/signalrService.ts` - SignalR connection management
- `src/hooks/useSignalR.ts` - React hook for SignalR
- `src/components/AdminNotificationListener.tsx` - Admin/Staff notifications
- `src/components/StudentNotificationListener.tsx` - Student notifications

✅ **What You Need to Do:**
1. Add listeners to `App.tsx` based on user role
2. Ensure `react-toastify` is configured
3. Set `VITE_API_URL` in `.env`
4. Test the notification flow

That's it! Your real-time notifications are ready to use! 🎉
