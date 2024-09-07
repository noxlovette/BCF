# your_app/management/commands/generate_uuids.py

from django.core.management.base import BaseCommand
from formulae.models import Formula
import uuid

class Command(BaseCommand):
    help = 'Generate UUIDs for existing formulas'

    def handle(self, *args, **kwargs):
        formulas = Formula.objects.filter(uuid__isnull=True)
        for formula in formulas:
            formula.uuid = uuid.uuid4()
            formula.save()
            self.stdout.write(self.style.SUCCESS(f'Updated formula ID {formula.id} with UUID {formula.uuid}'))
