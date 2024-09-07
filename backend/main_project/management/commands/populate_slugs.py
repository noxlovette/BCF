from django.core.management.base import BaseCommand
from browse.models import Ingredient
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Populate slugs and ensure uniqueness'

    def handle(self, *args, **kwargs):
        slugs = {}
        for ingredient in Ingredient.objects.all():
            base_slug = slugify(ingredient.common_name)
            slug = base_slug
            count = 1

            while slug in slugs:
                slug = f"{base_slug}-{count}"
                count += 1

            slugs[slug] = ingredient
            ingredient.slug = slug
            ingredient.save()

        self.stdout.write(self.style.SUCCESS('Successfully populated slugs and ensured uniqueness'))
