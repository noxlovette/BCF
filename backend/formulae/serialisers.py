from rest_framework import serializers, generics

from collection.models import RegularCollectionIngredient, CustomCollectionIngredient
from formulae.models import FormulaIngredient, Formula, Tag, NewFormulaIngredient, NewFormula
from main_project.encryption import decrypt_field
from browse.serialisers import DateTimeSerializer


class FormulaIngredientSerializer(serializers.ModelSerializer):
    """
    Serializer for the FormulaIngredient model. The funniest thing is the implementation of the case when custom ingredients
    are used, because their common name, cas, blabla, are ecnrypted, unlike those in the Regular Collection ingredient
    model. The serialiser gives more data than is actually needed at this state of the project. Better is more, anyway.
    The encryption takes up a lot of time anyway.
    """

    id = serializers.IntegerField(allow_null=True)  # Add this line
    collection_ingredient_id = serializers.IntegerField(required=False, allow_null=True)
    custom_collection_ingredient_id = serializers.IntegerField(
        required=False, allow_null=True
    )
    ingredient = serializers.SerializerMethodField()
    cas = serializers.SerializerMethodField()
    volatility = serializers.SerializerMethodField()
    use = serializers.SerializerMethodField()
    collection_ingredient_type = serializers.SerializerMethodField()
    percentage = serializers.FloatField(allow_null=True)

    def prepare_for_serialization(self, obj):
        if obj.custom_collection_ingredient:
            obj.custom_collection_ingredient._common_name = (
                decrypt_field(obj.custom_collection_ingredient.encrypted_common_name)
                if obj.custom_collection_ingredient.encrypted_common_name
                else None
            )
            obj.custom_collection_ingredient._cas = (
                decrypt_field(obj.custom_collection_ingredient.encrypted_cas)
                if obj.custom_collection_ingredient.encrypted_cas
                else None
            )
            obj.custom_collection_ingredient._use = (
                decrypt_field(obj.custom_collection_ingredient.encrypted_use)
                if obj.custom_collection_ingredient.encrypted_use
                else None
            )
            obj.custom_collection_ingredient._volatility = (
                decrypt_field(obj.custom_collection_ingredient.encrypted_volatility)
                if obj.custom_collection_ingredient.encrypted_volatility
                else None
            )

    def get_ingredient(self, obj):
        """
        Return the common name of the ingredient...
        """
        self.prepare_for_serialization(obj)

        if obj.collection_ingredient:
            return obj.collection_ingredient.ingredient.common_name
        elif obj.custom_collection_ingredient:
            return obj.custom_collection_ingredient._common_name
        return None

    def get_cas(self, obj):
        """
        Return the CAS number of the ingredient.
        """
        self.prepare_for_serialization(obj)
        if obj.collection_ingredient:
            return obj.collection_ingredient.ingredient.cas
        elif obj.custom_collection_ingredient:
            return obj.custom_collection_ingredient._cas
        return None

    def get_volatility(self, obj):
        """
        Return the volatility of the ingredient.
        """
        self.prepare_for_serialization(obj)
        if obj.collection_ingredient:
            return obj.collection_ingredient.ingredient.volatility
        elif obj.custom_collection_ingredient:
            return obj.custom_collection_ingredient._volatility
        return None

    def get_use(self, obj):
        """
        Return the use of the ingredient.
        """
        self.prepare_for_serialization(obj)
        if obj.collection_ingredient:
            return obj.collection_ingredient.ingredient.use
        elif obj.custom_collection_ingredient:
            return obj.custom_collection_ingredient._use
        return None

    def get_collection_ingredient_type(self, obj):
        """
        Return the type of collection ingredient associated with the FormulaIngredient.
        """
        if obj.collection_ingredient:
            return "Collection Ingredient"
        elif obj.custom_collection_ingredient:
            return "Custom Collection Ingredient"
        return None

    class Meta:
        model = FormulaIngredient
        fields = [
            "collection_ingredient_id",
            "custom_collection_ingredient_id",
            "id",
            "ingredient",
            "cas",
            "volatility",
            "use",
            "amount",
            "unit",
            "collection_ingredient_type",
            "percentage",
        ]


class FormulaSerializer(serializers.ModelSerializer):
    """
    This is the serializer for the Formula model. It will be used to serialize the Formula model into JSON format.
    The ingredients array is a different story, see above.
    the funniest thing happens when the update is triggered, because the formula might be supplied with more ingredients,
    so we have to iterate over the list received from the request and check if the ingredient is already in the formula...
    """

    ingredients = FormulaIngredientSerializer(many=True)
    created = DateTimeSerializer(source="created_at", read_only=True)
    updated = DateTimeSerializer(source="updated_at", read_only=True)
    name = serializers.CharField(source="_name")
    description = serializers.CharField(
        source="_description", allow_null=True, allow_blank=True
    )
    notes = serializers.CharField(source="_notes", allow_null=True, allow_blank=True)
    solvent = serializers.CharField(allow_null=True, allow_blank=True)

    def update(self, instance, validated_data):
        """
        to continue what I started above – one of the crucial ideas is to reuse the ID of the ingredients and not create
        new ones blindly every time the name and the id of the associated collection_formula changes. the update_or_create
        method is used to update the existing FormulaIngredients and create new ones if they are not found.
        """
        # Update existing Formula fields
        instance._name = validated_data.pop("_name", instance._name)
        instance._description = validated_data.pop(
            "_description", instance._description
        )
        instance._notes = validated_data.pop("_notes", instance._notes)
        instance.solvent = validated_data.get("solvent", instance.solvent)

        # guarantee some degree of consistency
        instance.save()

        # Update existing FormulaIngredient instances or create new ones. four scenarios are possible:
        ingredients_data = validated_data.pop("ingredients", [])
        for ingredient_data in ingredients_data:
            formula_ingredient_id = ingredient_data.get("id")
            amount = ingredient_data.get("amount")
            percentage = ingredient_data.get("percentage")

            if ingredient_id := ingredient_data.get("collection_ingredient_id"):
                if formula_ingredient_id is None:
                    # Create a new FormulaIngredient instance
                    FormulaIngredient.objects.create(
                        amount=amount,
                        collection_ingredient=RegularCollectionIngredient.objects.get(
                            id=ingredient_id
                        ),
                        formula=instance,
                        percentage=percentage,
                    )
                else:
                    # Update an existing FormulaIngredient instance
                    FormulaIngredient.objects.update_or_create(
                        id=formula_ingredient_id,
                        defaults={
                            "amount": amount,
                            "collection_ingredient": RegularCollectionIngredient.objects.get(
                                id=ingredient_id
                            ),
                            "custom_collection_ingredient": None,  # Clear the custom_collection_ingredient
                            "formula": instance,
                            "percentage": percentage,
                        },
                    )
            elif ingredient_id := ingredient_data.get(
                "custom_collection_ingredient_id"
            ):
                if formula_ingredient_id is None:
                    # Create a new FormulaIngredient instance
                    FormulaIngredient.objects.create(
                        amount=amount,
                        custom_collection_ingredient=CustomCollectionIngredient.objects.get(
                            id=ingredient_id
                        ),
                        formula=instance,
                        percentage=percentage,
                    )
                else:
                    # Update an existing FormulaIngredient instance
                    FormulaIngredient.objects.update_or_create(
                        id=formula_ingredient_id,
                        defaults={
                            "amount": amount,
                            "custom_collection_ingredient": CustomCollectionIngredient.objects.get(
                                id=ingredient_id
                            ),
                            "collection_ingredient": None,  # Clear the collection_ingredient
                            "formula": instance,
                            "percentage": percentage,
                        },
                    )
            else:
                print("Invalid ingredient type.")
                continue

        return instance

    def create(self, validated_data):
        """
        the create method is used to create a new Formula instance. the data is received server-side. this code is
        as flexible as possible. possibly, the users will want to customise their template for new formulas –
        this code will make that possible. It is flexible
        """
        ingredients_data = validated_data.pop("ingredients", [])

        name = validated_data.pop("_name", None)
        description = validated_data.pop("_description", None)
        notes = validated_data.pop("_notes", None)
        instance = Formula.objects.create(**validated_data)

        instance._name = name
        instance._description = description
        instance._notes = notes

        for ingredient_data in ingredients_data:
            FormulaIngredient.objects.create(formula=instance, **ingredient_data)

        instance.save()
        return instance

    class Meta:
        model = Formula
        fields = [
            "updated",
            "created",
            "id",
            "uuid",
            "name",
            "description",
            "ingredients",
            "notes",
            "solvent",
        ]
        read_only_fields = ["id", "uuid", "created", "updated"]

#NEW
class NewFormulaIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewFormulaIngredient
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class NewFormulaSerializer(serializers.ModelSerializer):
    ingredients = FormulaIngredientSerializer(many=True)
    name = serializers.CharField(source="_name")
    description = serializers.CharField(
        source="_description", allow_null=True, allow_blank=True
    )
    notes = serializers.CharField(source="_notes", allow_null=True, allow_blank=True)
    solvent = serializers.CharField(allow_null=True, allow_blank=True)

    def update(self, instance, validated_data):
        instance._name = validated_data.pop("_name", instance._name)
        instance._description = validated_data.pop(
            "_description", instance._description
        )
        instance._notes = validated_data.pop("_notes", instance._notes)
        instance.solvent = validated_data.get("solvent", instance.solvent)

        # guarantee some degree of consistency
        instance.save()

        ingredients_data = validated_data.pop("ingredients", [])
        for ingredient_data in ingredients_data:
            formula_ingredient_id = ingredient_data.get("id")
            if formula_ingredient_id:  # If the id exists, update the instance
                NewFormulaIngredient.objects.update_or_create(
                    id=formula_ingredient_id,
                    defaults={
                        "amount": ingredient_data.get("amount"),
                        "formula": instance,
                        "volatility": ingredient_data.get("volatility"),
                        "percentage": ingredient_data.get("percentage"),
                        "common_name": ingredient_data.get("common_name"),
                        "other_names": ingredient_data.get("other_names")
                    },
                )
            else:  # If id is None or Null, create a new instance
                NewFormulaIngredient.objects.create(
                    amount=ingredient_data.get("amount"),
                    formula=instance,
                    volatility=ingredient_data.get("volatility"),
                    percentage=ingredient_data.get("percentage"),
                    common_name=ingredient_data.get("common_name"),
                    other_names= ingredient_data.get("other_names")
                )
        
        return instance
    
    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients", [])

        name = validated_data.pop("_name", None)
        description = validated_data.pop("_description", None)
        notes = validated_data.pop("_notes", None)
        instance = NewFormula.objects.create(**validated_data)

        instance._name = name
        instance._description = description
        instance._notes = notes

        for ingredient_data in ingredients_data:
            NewFormulaIngredient.objects.create(formula=instance, **ingredient_data)

        instance.save()
        return instance
    
    class Meta:
        model = NewFormula
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]