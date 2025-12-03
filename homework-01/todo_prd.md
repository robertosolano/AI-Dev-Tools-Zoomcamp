# 📝 Product Requirements Document (PRD)
## Project: Django TODO Application

## 1. Overview
We will build a simple TODO application using **Django**. The application will allow users to create tasks, assign due dates, mark tasks as resolved, edit/delete tasks, and view a list of all tasks. The objective is to provide a minimal, test-covered project demonstrating full CRUD functionality and Django best practices.

The project will be developed using **Python**, and it is recommended to use **uv** for dependency management and environment setup.

## 2. Goals & Non-Goals

### Goals
- Create a Django web app with basic CRUD capabilities for TODO items.
- Provide two main templates (`base.html`, `home.html`) with template inheritance.
- Implement Django models, views, URL routing, forms, and tests.
- Support due dates and completion status for TODO items.

### Non-Goals
- User accounts or authentication.
- REST API or JSON endpoints.
- Advanced UI or CSS styling (beyond minimal).
- Scheduling/reminder notifications.

## 3. User Stories
1. View all TODOs.
2. Create TODO with title, description, due date.
3. Edit TODO.
4. Delete TODO.
5. Mark TODO resolved.

## 4. Functional Requirements
- CRUD functionality
- Due dates
- Mark complete/incomplete

## 5. Technical Requirements
- Python 3.10+
- Django (latest stable)
- uv (optional)

## 6. Models
### Todo
- title
- description
- due_date
- is_completed
- created_at
- updated_at

## 7. Views & Logic
- List
- Create
- Update
- Delete
- Toggle complete

## 8. Forms
- Django ModelForms

## 9. Templates
- base.html
- home.html

## 10. Tests
- Model tests
- View tests
- Template tests

## 11. Acceptance Criteria
- All CRUD works
- Templates extend base.html
- All tests pass

## 12. Out of Scope / Future Enhancements
- Auth
- API
- Categories
- Pagination
- Notifications
