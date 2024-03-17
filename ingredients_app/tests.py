from django.test import TestCase
from ingredients_app.models import Ingredient


class IngredientModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        Ingredient.objects.create(common_name='Test Ingredient', cas='123-45-6', volatility='0.5', use='Test Use',
                                  ingredient_type='synthetic')

    def test_common_name_label(self):
        ingredient = Ingredient.objects.get(id=1)
        field_label = ingredient._meta.get_field('common_name').verbose_name
        self.assertEqual(field_label, 'Name')

    def test_cas_label(self):
        ingredient = Ingredient.objects.get(id=1)
        field_label = ingredient._meta.get_field('cas').verbose_name
        self.assertEqual(field_label, 'CAS')

    # Continue with other field label tests...

    def test_common_name_max_length(self):
        ingredient = Ingredient.objects.get(id=1)
        max_length = ingredient._meta.get_field('common_name').max_length
        self.assertEqual(max_length, 100)

    # Continue with other max length tests...
