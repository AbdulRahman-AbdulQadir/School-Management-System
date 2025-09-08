from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse

class AuthTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")

    def test_login_success(self):
        response = self.client.post(reverse("login"), {"username": "testuser", "password": "testpass"})
        self.assertRedirects(response, "/home/")

    def test_login_failure(self):
        response = self.client.post(reverse("login"), {"username": "testuser", "password": "wrongpass"})
        self.assertRedirects(response, "/login/")

    def test_logout(self):
        self.client.login(username="testuser", password="testpass")
        response = self.client.get(reverse("logout"))
        self.assertRedirects(response, "/login/")
