# Admin Dashboard - Quick Usage Guide

## 🎯 Quick Start

### Accessing the Dashboard
1. Navigate to `/admin` or `/admin/index.html`
2. Login with your admin credentials
3. Dashboard loads automatically

---

## 📋 Appointments Management

### Viewing Appointments
```
Dashboard → Appointments Section
```

**Filter Options:**
- **All** - Shows all appointments
- **Pending** - New appointments awaiting approval
- **Approved** - Confirmed appointments
- **Completed** - Finished appointments
- **Cancelled** - Cancelled appointments

### Managing Appointment Status
1. Locate the appointment in the table
2. Click the **Status Dropdown** (colored pill)
3. Select new status:
   - Pending (Yellow)
   - Approved (Green)
   - Completed (Blue)
   - Cancelled (Red)
4. Status updates automatically

### Deleting Appointments
1. Click the **trash icon** (🗑️) in Actions column
2. Confirm deletion
3. Appointment removed from database

---

## 📧 Contact Form Submissions

### Viewing Messages
```
Dashboard → Contact Forms Section
```

**Filter Options:**
- **All** - All messages
- **Unread** - New messages (default)
- **Read** - Viewed messages
- **Replied** - Messages you've responded to

### Reading a Message
1. Click the **eye icon** (👁️) in Actions column
2. Modal opens with full message details:
   - Sender name
   - Email address (clickable)
   - Phone number (clickable)
   - Subject
   - Full message text
3. Message automatically marked as "Read"

### Replying to Messages
1. Open message modal (eye icon)
2. Click **"Reply via Email"** button
3. Your default email client opens with:
   - Recipient pre-filled
   - Ready to compose reply

### Updating Message Status
1. Use the **Status Dropdown** in table
2. Select status:
   - Unread (Yellow)
   - Read (Blue)
   - Replied (Green)

### Deleting Messages
1. Click **trash icon** (🗑️)
2. Confirm deletion
3. Message removed permanently

---

## 🎨 UI Features

### Color Coding System

**Appointments:**
- 🟡 **Pending** - Awaiting action
- 🟢 **Approved** - Confirmed
- 🔵 **Completed** - Finished
- 🔴 **Cancelled** - Cancelled

**Contact Messages:**
- 🟡 **Unread** - New message
- 🔵 **Read** - Viewed
- 🟢 **Replied** - Responded

### Interactive Elements

**Clickable Links:**
- Email addresses → Opens email client
- Phone numbers → Opens dialer (mobile)

**Hover Effects:**
- Buttons lift on hover
- Rows highlight on hover
- Tooltips show on icon hover

**Notifications:**
- Success: Green slide-in (top-right)
- Error: Red slide-in (top-right)
- Auto-dismiss after 3 seconds

---

## 📱 Mobile Usage

### On Tablets/Phones:
- Tables scroll horizontally
- Filter buttons stack vertically
- Action buttons show icons only
- Modals adapt to screen size
- Touch-friendly button sizes

### Tips:
- Swipe tables left/right to see all columns
- Tap filter buttons to switch views
- Long-press for tooltips (mobile)

---

## ⚡ Keyboard Shortcuts

- **Tab** - Navigate between elements
- **Enter** - Activate buttons/dropdowns
- **Esc** - Close modals
- **Arrow Keys** - Navigate dropdown options

---

## 🔔 Notifications Explained

### Success Messages:
- "Appointment status updated successfully"
- "Contact status updated successfully"
- "Contact submission deleted successfully"
- "Appointment deleted successfully"

### Error Messages:
- "Failed to update status"
- "Failed to delete submission"
- "Error loading data"

---

## 💡 Pro Tips

1. **Quick Status Changes**: Click dropdown directly in table - no need to open details
2. **Bulk Actions**: Use filters to view specific groups, then act on them
3. **Email Integration**: "Reply via Email" preserves context automatically
4. **Auto-Read**: Viewing a message marks it as read - no manual update needed
5. **Responsive Tables**: On mobile, scroll tables horizontally to see all data

---

## 🐛 Troubleshooting

### Data Not Loading?
- Check browser console for errors
- Verify Supabase connection
- Refresh the page

### Filters Not Working?
- Clear browser cache
- Check if JavaScript is enabled
- Verify filter buttons are clickable

### Modal Not Opening?
- Check for JavaScript errors
- Try refreshing the page
- Ensure Font Awesome icons are loaded

### Status Not Updating?
- Check internet connection
- Verify Supabase permissions
- Look for error notifications

---

## 📊 Dashboard Statistics

The dashboard shows real-time stats:
- **Total Appointments** - All time count
- **Pending Appointments** - Awaiting approval
- **Active Services** - Available services
- **Unread Messages** - New contact forms

Stats update automatically when data changes.

---

## 🔐 Security Notes

- Always logout when done
- Don't share admin credentials
- Session expires on browser close
- All actions are logged in database

---

**Need Help?** Check the browser console for detailed error messages.

**Last Updated:** March 16, 2026
