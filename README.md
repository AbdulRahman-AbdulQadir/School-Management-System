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

## 📂 **Project Structure**

```
school_management/
│
├── accounts/
│   ├── models.py       # CustomUser model (includes is_member_of_this_school)
│   ├── views.py        # Login, register, dashboard logic
│   ├── urls.py
│   └── forms.py
│
├── pages/
│   ├── views.py        # Public-facing pages
│   ├── templates/pages/
│   └── urls.py
│
├── templates/
│   └── base.html       # Global template
│
├── static/
│   ├── css/
│   ├── js/
│   └── images/
│
├── school_management/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
└── README.md
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
