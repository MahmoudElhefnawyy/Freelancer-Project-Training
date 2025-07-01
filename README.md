# Employee Management System (EMS) - MERN Stack

A comprehensive Employee Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). This full-stack web application streamlines HR processes, enabling efficient management of employee data, attendance, leave requests, projects, and more. It includes role-based access for employees and HR/admin, secure authentication, and a responsive user interface.

## 🚀 Features

### Core Features
- **CRUD Operations**: Create, Read, Update, and Delete employee records with details like name, email, position, department, salary, and joining date.
- **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) with role-based access (Employee, HR/Admin).
- **Employee Dashboard**: Employees can view their profile, attendance, leave history, payslips, and assigned projects.
- **HR/Admin Dashboard**: Admins can manage employee records, approve/reject leave requests, issue notices, and oversee project assignments.
- **Leave Management**: Employees can apply for leaves; admins can view, approve, or reject leave requests.
- **Attendance Tracking**: Employees can mark daily attendance; admins can monitor attendance records.
- **Project Management**: Admins can create, update, and assign projects to employees; employees can view their project details.
- **Real-Time Notifications**: Notify users of updates (e.g., leave approvals, profile changes, or new notices).
- **Profile Management**: Users can update their profiles, including uploading profile pictures.
- **Data Visualization**: Charts and analytics for HR to monitor attendance, leave trends, and employee performance using Chart.js.

### Additional Features
- **Role-Based Permissions**: Restrict access to sensitive data and actions based on user roles (Employee vs. HR/Admin).
- **Search, Sort, and Filter**: Search employees by name, filter by department, and sort by salary or joining date.
- **Pagination**: Efficiently handle large datasets in employee and project lists.
- **Responsive Design**: Optimized for desktops, tablets, and mobile devices using React-Bootstrap and Tailwind CSS.
- **Third-Party Integrations**: Email notifications for leave approvals and password resets using Mailtrap.

## 🛠️ Tech Stack

**Frontend**: React.js, React-Bootstrap, Tailwind CSS, Chart.js, Axios  
**Backend**: Node.js, Express.js, MongoDB, Mongoose  
**Authentication**: JWT, Bcrypt  
**Environment**: MongoDB Atlas, Render (for deployment), Mailtrap (for email)  
**Tools**: Vite, Git, npm  

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Mailtrap account (for email notifications)
- Git

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git https://github.com/MahmoudElhefnawyy/Freelancer-Project-Training
   cd server
   ```
### 🙏 Acknowledgments
**Special thanks to all contributors and open-source libraries used in this project**

**Inspired by modern HR management systems and built for learning and scalability**
