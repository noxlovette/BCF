from rest_framework import serializers, generics

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
    ingredient_id = serializers.StringRelatedField(source='collection_ingredient.id')
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
    ingredients = FormulaIngredientSerializer(source='formulaingredient_set', many=True)
    created_at = DateTimeSerializer()
    updated_at = DateTimeSerializer()

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        print(ingredients_data)

        # Update existing Formula fields
        instance.name = validated_data.get('name', instance.name)
        print(validated_data.get('description', instance.description))
        print(instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        # Create new FormulaIngredient instances
        for ingredient_data in ingredients_data:
            print(ingredient_data)
            # Check if a FormulaIngredient instance with the same id and formula exists
            ingredient_id = ingredient_data.get('id')
            print(ingredient_id)
            if not FormulaIngredient.objects.filter(id=ingredient_id, formula=instance).exists():
                FormulaIngredient.objects.create(formula=instance, **ingredient_data)
                print("Created")

        return instance

    class Meta:
        model = Formula
        fields = ['id', 'user', 'name', 'description', 'ingredients', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
