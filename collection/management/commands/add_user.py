from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Creates a new user'

    def handle(self, *args, **kwargs):
        username = input('Enter username: ')
        email = input('Enter email: ')
        password = input('Enter password: ')

        # Create a new user
        user = User.objects.create_user(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'User "{username}" created successfully!'))
