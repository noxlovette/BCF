from django.db import models
from django.contrib.auth.models import User
from browse.models import Ingredient
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from main_project.encryption import decrypt_field, encrypt_field
import uuid

class NewCollectionIngredient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    common_name = models.CharField(max_length=100, verbose_name="Common Name", default="New Ingredient")
    cas = models.CharField(max_length=100, verbose_name="CAS", default="0000-00-0")
    volatility = models.CharField(max_length=100, verbose_name="Volatility", null=True, blank=True)
    use = models.TextField(verbose_name="Use", null=True, blank=True)

    descriptors = models.CharField(verbose_name="Descriptors", default="New Ingredient", max_length=100)

    other_names = models.TextField(verbose_name="Other Names", null=True, blank=True)
    is_restricred = models.BooleanField(default=False, verbose_name="Restricted")
    origin = models.CharField(max_length=100, verbose_name="Origin", null=True, blank=True)

    amount = models.FloatField(default=0, verbose_name="Amount")
    unit = models.CharField(max_length=50, default="g", verbose_name="Unit")
    is_collection = models.BooleanField(default=False, verbose_name="In Collection")

    encrypted_impression = models.BinaryField(null=True, blank=True)
    encrypted_colour = models.BinaryField(null=True, blank=True)
    encrypted_associations = models.BinaryField(null=True, blank=True)
    encrypted_ideas = models.BinaryField(null=True, blank=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Temporary attributes for plaintext data handling
        self._impression = None
        self._colour = None
        self._associations = None
        self._ideas = None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)
    
    def prepare_for_serialization(self):
        """
        without this, the client will return hell. the decryption takes place here, on the server side.
        """
        self._impression = (
            decrypt_field(self.encrypted_impression)
            if self.encrypted_impression
            else None
        )
        self._colour = (
            decrypt_field(self.encrypted_colour) if self.encrypted_colour else None
        )
        self._associations = (
            decrypt_field(self.encrypted_associations)
            if self.encrypted_associations
            else None
        )
        self._ideas = (
            decrypt_field(self.encrypted_ideas) if self.encrypted_ideas else None
        )

    def refresh_from_db(self, *args, **kwargs):
        """
        decrypts the fields from the database before refreshing the instance. straightforward.
        """
        self._impression = (
            decrypt_field(self.encrypted_impression)
            if self.encrypted_impression
            else None
        )
        self._colour = (
            decrypt_field(self.encrypted_colour) if self.encrypted_colour else None
        )
        self._associations = (
            decrypt_field(self.encrypted_associations)
            if self.encrypted_associations
            else None
        )
        self._ideas = (
            decrypt_field(self.encrypted_ideas) if self.encrypted_ideas else None
        )

        super().refresh_from_db(*args, **kwargs)

    def save(self, *args, **kwargs):
        """
        encrypts the fields before saving the instance. if the amount is negative, raises an error. if the amount is 0,
        and that is also the default, the is_collection field is set to False. if the amount is greater than 0, the
        is_collection field is set to True. the encrypted fields are set to the encrypted versions of the plaintext
        """
        if self.amount < 0:
            raise ValueError("The amount cannot be negative.")
        elif self.amount == 0:
            self.is_collection = False
        else:
            self.is_collection = True

        if self._impression:
            self.encrypted_impression = encrypt_field(self._impression)
        if self._colour:
            self.encrypted_colour = encrypt_field(self._colour)
        if self._associations:
            self.encrypted_associations = encrypt_field(self._associations)
        if self._ideas:
            self.encrypted_ideas = encrypt_field(self._ideas)

        # Clear the temporary attributes
        self._impression = None
        self._colour = None
        self._associations = None
        self._ideas = None

        super().save(*args, **kwargs)

    def __str__(self):
        return f"COLLECTION INGREDIENT {self.user.username} {self.common_name}"

    class Meta:
        unique_together = ["user", "id"]
        verbose_name = "Collection Ingredient"
        verbose_name_plural = "Collection Ingredients"
        db_table = "collection_ingredients"
        ordering = ["user", "common_name"]

class CollectionIngredient(models.Model):
    """
    this is the abstract base class for the ingredients in the collection.
    inherited by the regular and custom collection ingredient models.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    unit = models.CharField(max_length=50, default="g", verbose_name="Unit")
    is_collection = models.BooleanField(default=False, verbose_name="In Collection")
    date_added = models.DateTimeField(auto_now_add=True, verbose_name="Date Added")
    amount = models.FloatField(default=0, verbose_name="Amount")

    # encrypted fields
    encrypted_impression = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_colour = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_associations = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_ideas = models.BinaryField(null=True, blank=True, editable=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Temporary attributes for plaintext data handling
        self._impression = None
        self._colour = None
        self._associations = None
        self._ideas = None

    def prepare_for_serialization(self):
        """
        without this, the client will return hell. the decryption takes place here, on the server side.
        """
        self._impression = (
            decrypt_field(self.encrypted_impression)
            if self.encrypted_impression
            else None
        )
        self._colour = (
            decrypt_field(self.encrypted_colour) if self.encrypted_colour else None
        )
        self._associations = (
            decrypt_field(self.encrypted_associations)
            if self.encrypted_associations
            else None
        )
        self._ideas = (
            decrypt_field(self.encrypted_ideas) if self.encrypted_ideas else None
        )

    def refresh_from_db(self, *args, **kwargs):
        """
        decrypts the fields from the database before refreshing the instance. straightforward.
        """
        self._impression = (
            decrypt_field(self.encrypted_impression)
            if self.encrypted_impression
            else None
        )
        self._colour = (
            decrypt_field(self.encrypted_colour) if self.encrypted_colour else None
        )
        self._associations = (
            decrypt_field(self.encrypted_associations)
            if self.encrypted_associations
            else None
        )
        self._ideas = (
            decrypt_field(self.encrypted_ideas) if self.encrypted_ideas else None
        )

        super().refresh_from_db(*args, **kwargs)

    def save(self, *args, **kwargs):
        """
        encrypts the fields before saving the instance. if the amount is negative, raises an error. if the amount is 0,
        and that is also the default, the is_collection field is set to False. if the amount is greater than 0, the
        is_collection field is set to True. the encrypted fields are set to the encrypted versions of the plaintext
        """
        if self.amount < 0:
            raise ValueError("The amount cannot be negative.")
        elif self.amount == 0:
            self.is_collection = False
        else:
            self.is_collection = True

        if self._impression:
            self.encrypted_impression = encrypt_field(self._impression)
        if self._colour:
            self.encrypted_colour = encrypt_field(self._colour)
        if self._associations:
            self.encrypted_associations = encrypt_field(self._associations)
        if self._ideas:
            self.encrypted_ideas = encrypt_field(self._ideas)

        # Clear the temporary attributes
        self._impression = None
        self._colour = None
        self._associations = None
        self._ideas = None

        super().save(*args, **kwargs)

    def __str__(self):
        return f" BASE COLLECTION INGREDIENT {self.user.username} {self.amount} {self.unit}"

    class Meta:
        abstract = True


class RegularCollectionIngredient(CollectionIngredient):
    """
    the only difference between this and the custom collection ingredient is that this one has a foreign key to the
    ingredient model. this is the model for the ingredients that are already in the database.
    """

    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)

    def __str__(self):
        return f"regular collection ing {self.user.username} - {self.ingredient.common_name}"

    class Meta:
        unique_together = ["user", "ingredient"]
        verbose_name = "Ingredient in Collection"
        verbose_name_plural = "Ingredients in Collection"
        db_table = "user_collection_ing"
        ordering = ["user", "ingredient__common_name"]


class CustomCollectionIngredient(CollectionIngredient):
    """
    the scale of encryption is different here. since this is an ingredient that is unique to the user, the fields are
    encrypted. the user can add their own ingredients to the collection, and these are stored in this model. this guarantees
    trust with the app. trust me, it is hard for me to manually decrypt this.
    """

    encrypted_common_name = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_cas = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_use = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_volatility = models.BinaryField(null=True, blank=True, editable=False)

    # these lines are for the generic foreign key with the Formula model. the reason why this is so is that creating a
    # simple foreign key would result in a circular error. the formula model is defined in the formulae app.
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, null=True, blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey("content_type", "object_id")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._common_name = None
        self._cas = None
        self._use = None
        self._volatility = None

    def prepare_for_serialization(self):
        """
        decrypts the fields before serialization. the plaintext fields are set to the decrypted versions of the encrypted
        it might be worth merging this and the aforementioned method into one method.
        """
        super().prepare_for_serialization()
        self._common_name = (
            decrypt_field(self.encrypted_common_name)
            if self.encrypted_common_name
            else None
        )
        self._cas = decrypt_field(self.encrypted_cas) if self.encrypted_cas else None
        self._use = decrypt_field(self.encrypted_use) if self.encrypted_use else None
        self._volatility = (
            decrypt_field(self.encrypted_volatility)
            if self.encrypted_volatility
            else None
        )

    def save(self, *args, **kwargs):
        """
        again, same as the save method for the base model. there are simply more fields to encrypt.
        """
        if self._common_name:
            self.encrypted_common_name = encrypt_field(self._common_name)
        if self._cas:
            self.encrypted_cas = encrypt_field(self._cas)
        if self._use:
            self.encrypted_use = encrypt_field(self._use)
        if self._volatility:
            self.encrypted_volatility = encrypt_field(self._volatility)

        # Clear the temporary attributes.
        self._common_name = None
        self._cas = None
        self._use = None
        self._volatility = None

        # Save the instance again with the new encrypted fields.
        super().save(*args, **kwargs)

    def refresh_from_db(self, *args, **kwargs):
        """
        decrypts the fields before refreshing the instance. the plaintext fields are set to the decrypted versions of the
        """
        self._common_name = (
            decrypt_field(self.encrypted_common_name)
            if self.encrypted_common_name
            else None
        )
        self._cas = decrypt_field(self.encrypted_cas) if self.encrypted_cas else None
        self._use = decrypt_field(self.encrypted_use) if self.encrypted_use else None
        self._volatility = (
            decrypt_field(self.encrypted_volatility)
            if self.encrypted_volatility
            else None
        )

        super().refresh_from_db(*args, **kwargs)

    class Meta:
        """
        yes, ordering only by user's name. ordering is near useless anyway, because the representation on the website is
        in a table, sorted automatically on the client.
        """

        verbose_name = "Custom Ingredient"
        verbose_name_plural = "Custom Ingredients"
        db_table = "custom_collection_ing"
        ordering = ["user"]
