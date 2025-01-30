from django.test import TestCase

from collection.models import CustomCollectionIngredient
from django.contrib.auth.models import User


class RefreshFromDBTest(TestCase):
    def setUp(self):
        # Setup test data
        self.user = User.objects.create_user("testuser")
        self.ingredient = CustomCollectionIngredient()
        self.ingredient.user = self.user
        self.ingredient._common_name = "Vanilla"
        self.ingredient.save()

    def test_refresh_from_db(self):
        # Change the data directly in the database.
        changed_text = "Changed Vanilla"
        encrypted = self.ingredient.encrypt_field(changed_text)
        self.new_instance = CustomCollectionIngredient.objects.get(
            pk=self.ingredient.pk
        )
        self.new_instance.encrypted_common_name = encrypted

        # Refresh instance data from the database
        self.new_instance.refresh_from_db()

        # Test if the data is correctly decrypted and updated
        self.assertEqual(self.new_instance._common_name, changed_text)
