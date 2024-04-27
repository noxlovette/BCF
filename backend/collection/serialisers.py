from rest_framework import serializers
from .models import CollectionIngredient, CustomCollectionIngredient


class DateTimeSerializer(serializers.DateTimeField):
    """
    custom time representation
    """

    def to_representation(self, value):
        formatted_datetime = value.strftime("%d.%m.%Y, %I:%M%p")
        return formatted_datetime


class BaseCollectionIngredientSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    common_name = serializers.CharField()
    cas = serializers.CharField()
    volatility = serializers.CharField()
    use = serializers.CharField()
    amount = serializers.IntegerField()
    unit = serializers.CharField()
    colour = serializers.CharField(allow_null=True, allow_blank=True)
    date_added = DateTimeSerializer(read_only=True)
    impression = serializers.CharField(allow_null=True, allow_blank=True)
    ideas = serializers.CharField(allow_null=True, allow_blank=True)
    associations = serializers.CharField(allow_null=True, allow_blank=True)

    class Meta:
        fields = ['type', 'id', 'common_name', 'cas', 'volatility', 'use', 'date_added', 'colour', 'impression',
                  'associations',
                  'ideas', 'is_collection', 'amount', 'unit']
        abstract = True


class CollectionIngredientSerializer(BaseCollectionIngredientSerializer):
    common_name = serializers.StringRelatedField(source='ingredient.common_name')
    cas = serializers.StringRelatedField(source='ingredient.cas')
    volatility = serializers.StringRelatedField(source='ingredient.volatility')
    use = serializers.StringRelatedField(source='ingredient.use')
    type = serializers.SerializerMethodField()

    def get_type(self, obj):
        return 'CollectionIngredient'

    class Meta(BaseCollectionIngredientSerializer.Meta):
        model = CollectionIngredient


class CustomCollectionIngredientSerializer(BaseCollectionIngredientSerializer):
    type = serializers.SerializerMethodField()

    def get_type(self, obj):
        return 'CustomCollectionIngredient'

    class Meta(BaseCollectionIngredientSerializer.Meta):
        model = CustomCollectionIngredient


class UnifiedCollectionIngredientSerializer(serializers.Serializer):
    collection_ingredient = CollectionIngredientSerializer(many=True)
    custom_collection_ingredient = CustomCollectionIngredientSerializer(many=True)
# Path: collection/views.py
