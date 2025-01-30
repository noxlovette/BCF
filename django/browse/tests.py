from django.test import TestCase
from browse.models import Ingredient
from collection.models import CustomCollectionIngredient


class IngredientModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        Ingredient.objects.create(
            common_name="Test Ingredient",
            cas="123-45-6",
            volatility="0.5",
            use="Test Use",
            ingredient_type="synthetic",
        )

    def test_common_name_label(self):
        ingredient = Ingredient.objects.get(id=1)
        field_label = ingredient._meta.get_field("common_name").verbose_name
        self.assertEqual(field_label, "Name")

    def test_cas_label(self):
        ingredient = Ingredient.objects.get(id=1)
        field_label = ingredient._meta.get_field("cas").verbose_name
        self.assertEqual(field_label, "CAS")
