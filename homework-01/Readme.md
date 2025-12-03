# Django TODO Application

## Overview
A simple TODO application built with Django that allows users to create, edit, delete, and manage tasks with due dates and completion status.

## Project Structure
```
├── todoproject/        # Django project settings
│   ├── settings.py     # Project configuration
│   ├── urls.py         # Root URL configuration
│   └── wsgi.py         # WSGI application
├── todos/              # Main application
│   ├── models.py       # Todo model
│   ├── views.py        # CRUD views
│   ├── forms.py        # TodoForm (ModelForm)
│   ├── urls.py         # App URL patterns
│   └── tests.py        # Comprehensive tests
├── templates/          # HTML templates
│   ├── base.html       # Base template
│   └── home.html       # Main page template
└── manage.py           # Django management script
```

## Features
- Create TODO items with title, description, and due date
- Edit existing TODO items
- Delete TODO items with confirmation
- Toggle completion status
- View all tasks in a clean list interface
- Template inheritance (base.html → home.html)

## Model: Todo
- `title` (CharField, max 200 chars)
- `description` (TextField, optional)
- `due_date` (DateField, optional)
- `is_completed` (BooleanField, default False)
- `created_at` (DateTimeField, auto)
- `updated_at` (DateTimeField, auto)

## URL Routes
- `/` - Home page (list all todos)
- `/create/` - Create new todo
- `/update/<pk>/` - Edit todo
- `/delete/<pk>/` - Delete todo
- `/toggle/<pk>/` - Toggle completion status

## Running the Application
```bash
python manage.py runserver 0.0.0.0:5000
```

## Running Tests
```bash
python manage.py test todos -v 2
```

## Recent Changes
- December 3, 2025: Initial implementation of TODO application
  - Created Todo model with all required fields
  - Implemented CRUD views and toggle functionality
  - Created base.html and home.html templates
  - Added comprehensive test suite (17 tests)

## Technical Stack
- Python 3.11+
- Django 5.2.9
- SQLite database
- uv package manager
