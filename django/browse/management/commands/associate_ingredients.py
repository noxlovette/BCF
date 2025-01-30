from django.core.management.base import BaseCommand
from browse.models import Ingredient  # Adjust the import to your app and model


class Command(BaseCommand):
    help = "Associate ingredients by cas1 and cas2 with reciprocal relationships"

    def add_arguments(self, parser):
        parser.add_argument(
            "cas1", type=str, help="CAS number of the first set of ingredients (cas1)"
        )
        parser.add_argument(
            "cas2", type=str, help="CAS number of the second set of ingredients (cas2)"
        )

    def handle(self, *args, **options):
        cas1 = options["cas1"]
        cas2 = options["cas2"]

        # Fetch all ingredients matching cas1 and cas2
        ingredients_cas1 = Ingredient.objects.filter(cas=cas1)
        ingredients_cas2 = Ingredient.objects.filter(cas=cas2)

        if not ingredients_cas1.exists():
            self.stdout.write(
                self.style.ERROR(f"No ingredients found for cas1: {cas1}")
            )
            return
        if not ingredients_cas2.exists():
            self.stdout.write(
                self.style.ERROR(f"No ingredients found for cas2: {cas2}")
            )
            return

        # Create reciprocal relationships
        for ing1 in ingredients_cas1:
            for ing2 in ingredients_cas2:
                ing1.related_ingredients.add(ing2)
                ing2.related_ingredients.add(ing1)

        # Save changes
        for ing1 in ingredients_cas1:
            ing1.save()
        for ing2 in ingredients_cas2:
            ing2.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully associated all ingredients with cas1: {cas1} and cas2: {cas2} reciprocally."
            )
        )
