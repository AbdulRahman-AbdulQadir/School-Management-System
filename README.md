# **School Management System (Django)**

A web-based School Management System built with Django.
This project manages student registrations, staff accounts, approvals, and admin dashboards.

---

## 📌 **Overview**

This system allows users to register, log in, and access different dashboards based on permissions.
Admins can approve or reject user accounts, manage school members, and view statistics.

The project uses a **Custom User Model** to support role-based permissions.

---

## 🛠️ **Features**

* User registration & login
* Django authentication system
* Custom user model (`CustomUser`)
* Admin dashboard (staff + superuser only)
* Pending user approval system
* Student & teacher management (future)
* Clean, extendable code structure

---

##  **User Approval Logic (Important)**

We added a custom field inside the `CustomUser` model:

```python
is_member_of_this_school = models.BooleanField(default=False)
```

### Why?

Django automatically sets `is_active = True` after registration.
This means we cannot use `is_active` to detect users waiting for approval.

So we created **is_member_of_this_school** to track admin approval.

* `False` → User registered but **not approved yet**
* `True` → User approved by admin

Example used in `admin_dashboard`:

```python
pending_count = CustomUser.objects.filter(is_member_of_this_school=False).count()
```

This count is displayed on the dashboard so admins can see how many users still need approval.

---

## 📂 Project Structure & App Logic

### 🔐 1. Accounts
* **Responsibility:** Handles user identity, security, and the custom authentication flow.
* **Key Logic:**
    * **CustomUser Model:** Extends `AbstractUser` to support roles (Student, Teacher, Parent) and UUID-based security.
    * **Approval System:** Manages the `is_member_of_this_school` flag to ensure admin verification before system access.
    * **Secure Auth:** Handles login, logout, and session-based password reset using random verification codes.

### 📐 2. Core
* **Responsibility:** Acts as the "glue" for the system, handling shared templates and global routing.
* **Key Logic:**
    * **Dashboard Routing:** Logic to detect user roles and redirect them to the appropriate dashboard (Admin vs. Student) upon login.
    * **Global Settings:** Manages school-wide data like current Academic Year, Term settings, and the homepage.

### 🏫 3. Academics
* **Responsibility:** Manages the structural organization of the school's educational system.
* **Key Logic:**
    * **Institutional Hierarchy:** Logic for linking Departments, Classes (Sections), and Subjects.
    * **Academic Calendar:** Manages the logic for Sessions and Terms to track when subjects are taught.

### 🎓 4. Students
* **Responsibility:** Handles everything related to the student's lifecycle and academic data.
* **Key Logic:**
    * **Enrollment:** Logic to link a `CustomUser` to a specific Class and Department.
    * **Academic Tracking:** Manages student-specific logs, attendance records, and emergency contact (Parent) links.

### 💼 5. Teachers
* **Responsibility:** Manages staff profiles and teaching assignments.
* **Key Logic:**
    * **Resource Allocation:** Logic to assign specific teachers to subjects and classrooms within the academic structure.
    * **Staff Management:** Handles teacher expertise, bio data, and their specific administrative permissions.

---

## 📁 Folder Directory

```text
school_management/
│
├── accounts/          # CustomUser, Auth Views (Login/Register), Approval Logic
├── core/              # Global Views, Home, Navigation Logic
├── academics/         # Departments, Classes, Subjects, Sessions
├── students/          # Student Profiles, Enrollment, Class Assignment
├── teachers/          # Teacher Profiles, Subject Assignments
├── static/            # Tailwind CSS, JavaScript, Assets
├── templates/         # Shared HTML (base.html, partials)
└── manage.py          # Django Project Manager
```

---

## ⚙️ **Installation & Setup**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/school-management.git
cd school-management
```

### 2. Create a virtual environment

```bash
python -m venv env
```

### 3. Activate environment

Windows:

```bash
env\Scripts\activate
```

macOS/Linux:

```bash
source env/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser

```bash
python manage.py createsuperuser
```

### 7. Run the server

```bash
python manage.py runserver
```

---

## 🔧 **Tech Stack**

* **Python 3**
* **Django**
* HTML, CSS, JS
* SQLite (default) / PostgreSQL (optional)
* Django messages framework
* Custom User Model + permissions

---

## 📐 **Future Enhancements**

* Student ID cards
* Classes & subjects
* Attendance system
* Fee management
* API endpoints
* Push notifications

---
