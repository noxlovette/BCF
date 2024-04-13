from rest_framework import serializers, generics

from collection.models import CollectionIngredient
from formulae.models import FormulaIngredient, Formula


class DateTimeSerializer(serializers.DateTimeField):
    """
    custom time representation
    """

    def to_representation(self, value):
        formatted_datetime = value.strftime("%d.%m.%Y, %I:%M%p")
        return formatted_datetime


class FormulaIngredientSerializer(serializers.ModelSerializer):
    """
    This is the serializer for the FormulaIngredient model. It will be used to serialize the FormulaIngredient model into JSON format.
    """
    ingredient_id = serializers.PrimaryKeyRelatedField(source='collection_ingredient.id',
                                                       queryset=CollectionIngredient.objects.all())
    ingredient = serializers.StringRelatedField(source='collection_ingredient.ingredient.common_name')
    cas = serializers.StringRelatedField(source='collection_ingredient.ingredient.cas')
    volatility = serializers.StringRelatedField(source='collection_ingredient.ingredient.volatility')
    use = serializers.StringRelatedField(source='collection_ingredient.ingredient.use')

    class Meta:
        model = FormulaIngredient
        fields = ['ingredient_id', 'ingredient', 'cas', 'volatility', 'use', 'amount', 'unit']
        read_only_fields = ['ingredient_id', 'ingredient', 'cas', 'volatility', 'use', 'unit']


class FormulaSerializer(serializers.ModelSerializer):
    """
    This is the serializer for the Formula model. It will be used to serialize the Formula model into JSON format.
    """
    ingredients = FormulaIngredientSerializer(many=True)
    created_at = DateTimeSerializer()
    updated_at = DateTimeSerializer()

    def update(self, instance, validated_data):
        # Update existing Formula fields
        print(f"validated_data update function: {validated_data}")
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        # Update existing FormulaIngredient instances or create new ones
        ingredients_data = validated_data.pop('ingredients', [])
        print(f"ingredients_data: {ingredients_data}")
        for ingredient_data in ingredients_data:
            collection_ingredient = ingredient_data.get('collection_ingredient')
            if collection_ingredient is not None:
                ingredient_id = collection_ingredient.get('id')
                if ingredient_id is not None:
                    amount = ingredient_data.get('amount')
                    try:
                        formula_ingredient, created = FormulaIngredient.objects.update_or_create(
                            formula=instance,
                            collection_ingredient_id=ingredient_id.id,
                            # Access the id attribute of the CollectionIngredient instance
                            defaults={'amount': amount}
                        )
                    except Exception as e:
                        print(f"Error updating or creating FormulaIngredient: {e}")

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
        fields = ['id', 'user', 'name', 'description', 'ingredients', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
