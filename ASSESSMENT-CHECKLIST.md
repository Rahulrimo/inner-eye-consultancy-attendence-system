# Assessment coverage

| Requirement | Implementation |
|---|---|
| Employee Login & Registration | JWT login/register |
| Attendance Check-In / Check-Out | `/api/attendance/check-in`, `/check-out` |
| Working Hours Calculation | Calculated from timestamps on checkout |
| Leave Deduction Calculation | Approved leave deducts from employee balance |
| HR Dashboard | HR Console with KPIs, approvals, attendance tracking |
| Employee Dashboard | Employee KPIs and today's attendance |
| Attendance Status Tracking | Employee history + HR attendance table |
| Architecture | React client + Express API + MongoDB |
| Security | Password hashing, JWT, role middleware, input checks |
| UI/UX | Responsive dashboard, navigation, status badges, forms |
| Database design | User, Attendance and Leave collections with indexes |
