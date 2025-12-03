from django.test import TestCase, Client
from django.urls import reverse
from datetime import date
from .models import Todo
from .forms import TodoForm


class TodoModelTests(TestCase):
    def test_create_todo(self):
        todo = Todo.objects.create(
            title='Test Todo',
            description='Test Description',
            due_date=date(2025, 12, 31)
        )
        self.assertEqual(todo.title, 'Test Todo')
        self.assertEqual(todo.description, 'Test Description')
        self.assertEqual(todo.due_date, date(2025, 12, 31))
        self.assertFalse(todo.is_completed)
        self.assertIsNotNone(todo.created_at)
        self.assertIsNotNone(todo.updated_at)

    def test_todo_str(self):
        todo = Todo.objects.create(title='My Task')
        self.assertEqual(str(todo), 'My Task')

    def test_todo_default_values(self):
        todo = Todo.objects.create(title='Minimal Todo')
        self.assertEqual(todo.description, '')
        self.assertIsNone(todo.due_date)
        self.assertFalse(todo.is_completed)

    def test_todo_ordering(self):
        todo1 = Todo.objects.create(title='First')
        todo2 = Todo.objects.create(title='Second')
        todos = list(Todo.objects.all())
        self.assertEqual(todos[0], todo2)
        self.assertEqual(todos[1], todo1)


class TodoFormTests(TestCase):
    def test_valid_form(self):
        data = {
            'title': 'Test Task',
            'description': 'Description',
            'due_date': '2025-12-31'
        }
        form = TodoForm(data=data)
        self.assertTrue(form.is_valid())

    def test_form_with_empty_title(self):
        data = {
            'title': '',
            'description': 'Description'
        }
        form = TodoForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn('title', form.errors)

    def test_form_optional_fields(self):
        data = {'title': 'Only Title'}
        form = TodoForm(data=data)
        self.assertTrue(form.is_valid())


class TodoViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.todo = Todo.objects.create(
            title='Test Todo',
            description='Test Description',
            due_date=date(2025, 12, 31)
        )

    def test_home_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'home.html')
        self.assertContains(response, 'Test Todo')

    def test_create_todo(self):
        response = self.client.post(reverse('todo_create'), {
            'title': 'New Todo',
            'description': 'New Description',
            'due_date': '2025-12-25'
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Todo.objects.filter(title='New Todo').exists())

    def test_update_todo(self):
        response = self.client.post(
            reverse('todo_update', args=[self.todo.pk]),
            {
                'title': 'Updated Title',
                'description': 'Updated Description',
                'due_date': '2025-12-31'
            }
        )
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated Title')

    def test_delete_todo(self):
        response = self.client.post(reverse('todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Todo.objects.filter(pk=self.todo.pk).exists())

    def test_toggle_todo(self):
        self.assertFalse(self.todo.is_completed)
        response = self.client.post(reverse('todo_toggle', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.is_completed)
        response = self.client.post(reverse('todo_toggle', args=[self.todo.pk]))
        self.todo.refresh_from_db()
        self.assertFalse(self.todo.is_completed)

    def test_update_view_get(self):
        response = self.client.get(reverse('todo_update', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Edit Task')
        self.assertContains(response, self.todo.title)


class TodoTemplateTests(TestCase):
    def test_base_template_inheritance(self):
        response = self.client.get(reverse('home'))
        self.assertContains(response, '<!DOCTYPE html>')
        self.assertContains(response, 'TODO Application')

    def test_home_shows_empty_state(self):
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'No tasks yet')

    def test_home_shows_todos(self):
        Todo.objects.create(title='Task 1')
        Todo.objects.create(title='Task 2')
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'Task 1')
        self.assertContains(response, 'Task 2')
        self.assertContains(response, 'Your Tasks (2)')

    def test_completed_todo_styling(self):
        todo = Todo.objects.create(title='Completed Task', is_completed=True)
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'completed')
        self.assertContains(response, 'Completed')
