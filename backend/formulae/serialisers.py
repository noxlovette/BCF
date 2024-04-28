from rest_framework import serializers, generics

from collection.models import CollectionIngredient, CustomCollectionIngredient
from formulae.models import FormulaIngredient, Formula, Tag


class DateTimeSerializer(serializers.DateTimeField):
    """
    custom time representation
    """

    def to_representation(self, value):
        formatted_datetime = value.strftime("%d.%m.%Y, %I:%M%p")
        return formatted_datetime


class FormulaIngredientSerializer(serializers.ModelSerializer):
    """
    Serializer for the FormulaIngredient model.
    """

    id = serializers.IntegerField(allow_null=True)  # Add this line
    collection_ingredient_id = serializers.IntegerField(required=False, allow_null=True)
    custom_collection_ingredient_id = serializers.IntegerField(required=False, allow_null=True)
    ingredient = serializers.SerializerMethodField()
    cas = serializers.SerializerMethodField()
    volatility = serializers.SerializerMethodField()
    use = serializers.SerializerMethodField()
    collection_ingredient_type = serializers.SerializerMethodField()
    percentage = serializers.FloatField(allow_null=True)

    def get_ingredient(self, obj):
        """
        Return the common name of the ingredient.
        """
        if obj.collection_ingredient:
            return obj.collection_ingredient.ingredient.common_name
        elif obj.custom_collection_ingredient:
            return obj.custom_collection_ingredient.common_name
        return None

    def get_cas(self, obj):
        """
        Return the CAS number of the ingredient.
        """
        if obj.collection_ingredient:
            return obj.collection_ingredient.ingredient.cas
        elif obj.custom_collection_ingredient:
            return obj.custom_collection_ingredient.cas
        return None

    def get_volatility(self, obj):
        """
        Return the volatility of the ingredient.
        """
        if obj.collection_ingredient:
            return obj.collection_ingredient.ingredient.volatility
        elif obj.custom_collection_ingredient:
            return obj.custom_collection_ingredient.volatility
        return None

    def get_use(self, obj):
        """
        Return the use of the ingredient.
        """
        if obj.collection_ingredient:
            return obj.collection_ingredient.ingredient.use
        elif obj.custom_collection_ingredient:
            return obj.custom_collection_ingredient.use
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
        fields = ['collection_ingredient_id', 'custom_collection_ingredient_id', 'id', 'ingredient', 'cas',
                  'volatility', 'use',
                  'amount', 'unit', 'collection_ingredient_type', 'percentage']


class FormulaSerializer(serializers.ModelSerializer):
    """
    This is the serializer for the Formula model. It will be used to serialize the Formula model into JSON format.
    """
    ingredients = FormulaIngredientSerializer(many=True)
    created = DateTimeSerializer(source='created_at', read_only=True)
    updated = DateTimeSerializer(source='updated_at', read_only=True)

    def update(self, instance, validated_data):
        # Update existing Formula fields
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        user_id = validated_data.get('user')
        instance.save()

        # update or create tags
        tags_data = validated_data.pop('tags', [])
        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name, user_id=user_id)
            instance.tags.add(tag)

        # Update existing FormulaIngredient instances or create new ones
        ingredients_data = validated_data.pop('ingredients', [])
        for ingredient_data in ingredients_data:
            formula_ingredient_id = ingredient_data.get('id')
            amount = ingredient_data.get('amount')
            percentage = ingredient_data.get('percentage')

            if ingredient_id := ingredient_data.get('collection_ingredient_id'):
                if formula_ingredient_id is None:
                    # Create a new FormulaIngredient instance
                    FormulaIngredient.objects.create(
                        amount=amount,
                        collection_ingredient=CollectionIngredient.objects.get(id=ingredient_id),
                        formula=instance,
                        percentage=percentage
                    )
                else:
                    # Update an existing FormulaIngredient instance
                    FormulaIngredient.objects.update_or_create(
                        id=formula_ingredient_id,
                        defaults={
                            'amount': amount,
                            'collection_ingredient': CollectionIngredient.objects.get(id=ingredient_id),
                            'custom_collection_ingredient': None,  # Clear the custom_collection_ingredient
                            'formula': instance,
                            'percentage': percentage
                        }
                    )
            elif ingredient_id := ingredient_data.get('custom_collection_ingredient_id'):
                if formula_ingredient_id is None:
                    # Create a new FormulaIngredient instance
                    FormulaIngredient.objects.create(
                        amount=amount,
                        custom_collection_ingredient=CustomCollectionIngredient.objects.get(id=ingredient_id),
                        formula=instance,
                        percentage=percentage
                    )
                else:
                    # Update an existing FormulaIngredient instance
                    FormulaIngredient.objects.update_or_create(
                        id=formula_ingredient_id,
                        defaults={
                            'amount': amount,
                            'custom_collection_ingredient': CustomCollectionIngredient.objects.get(id=ingredient_id),
                            'collection_ingredient': None,  # Clear the collection_ingredient
                            'formula': instance,
                            'percentage': percentage

                        }
                    )
            else:
                print("Invalid ingredient type.")
                continue

        return instance

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        user_id = validated_data.get('user')
        print(f"validated_data create function: {validated_data}")
        formula = Formula.objects.create(**validated_data)
        for ingredient_data in ingredients_data:
            FormulaIngredient.objects.create(user_id=user_id, formula=formula, **ingredient_data)
        return formula

    class Meta:
        model = Formula
        fields = ['updated', 'created', 'id', 'user', 'name', 'description', 'ingredients', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
