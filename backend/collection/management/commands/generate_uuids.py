# collection/management/commands/generate_uuids.py

from django.core.management.base import BaseCommand
from collection.models import CustomCollectionIngredient, RegularCollectionIngredient
import uuid

class Command(BaseCommand):
    help = 'Generate UUIDs for existing CustomCollectionIngredient and RegularCollectionIngredient entries'

    def handle(self, *args, **kwargs):
        # Update UUIDs for CustomCollectionIngredient
        custom_ingredients = CustomCollectionIngredient.objects.filter(uuid__isnull=True)
        for custom_ingredient in custom_ingredients:
            custom_ingredient.uuid = uuid.uuid4()
            custom_ingredient.save()
            self.stdout.write(self.style.SUCCESS(
                f'Updated CustomCollectionIngredient ID {custom_ingredient.id} with UUID {custom_ingredient.uuid}'
            ))

        # Update UUIDs for RegularCollectionIngredient
        regular_ingredients = RegularCollectionIngredient.objects.filter(uuid__isnull=True)
        for regular_ingredient in regular_ingredients:
            regular_ingredient.uuid = uuid.uuid4()
            regular_ingredient.save()
            self.stdout.write(self.style.SUCCESS(
                f'Updated RegularCollectionIngredient ID {regular_ingredient.id} with UUID {regular_ingredient.uuid}'
            ))
