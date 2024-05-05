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

    amount = serializers.IntegerField()
    unit = serializers.CharField()
    date_added = DateTimeSerializer(read_only=True)

    impression = serializers.CharField(allow_null=True, allow_blank=True, source='_impression')
    ideas = serializers.CharField(allow_null=True, allow_blank=True, source='_ideas')
    associations = serializers.CharField(allow_null=True, allow_blank=True, source='_associations')
    colour = serializers.CharField(allow_null=True, allow_blank=True, source='_colour')
    common_name = serializers.CharField(source='_common_name')
    cas = serializers.CharField(source='_cas', allow_null=True, allow_blank=True)
    volatility = serializers.CharField(source='_volatility', allow_null=True, allow_blank=True)
    use = serializers.CharField(source='_use', allow_null=True, allow_blank=True)

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

    def create(self, validated_data):
        # Extract custom attributes and remove them from validated_data
        custom_name = validated_data.pop('_common_name', None)
        cas = validated_data.pop('_cas', None)
        volatility = validated_data.pop('_volatility', None)
        use = validated_data.pop('_use', None)
        colour = validated_data.pop('_colour', None)
        impression = validated_data.pop('_impression', None)
        associations = validated_data.pop('_associations', None)
        ideas = validated_data.pop('_ideas', None)

        # Create the model instance with remaining validated_data
        instance = CustomCollectionIngredient.objects.create(**validated_data)

        # Manually set custom attributes
        instance._common_name = custom_name
        instance._cas = cas
        instance._volatility = volatility
        instance._use = use
        instance._colour = colour
        instance._impression = impression
        instance._associations = associations
        instance._ideas = ideas

        instance.save()
        return instance

    def get_type(self, obj):
        return 'CustomCollectionIngredient'

    class Meta(BaseCollectionIngredientSerializer.Meta):
        model = CustomCollectionIngredient


class UnifiedCollectionIngredientSerializer(serializers.Serializer):
    collection_ingredient = CollectionIngredientSerializer(many=True)
    custom_collection_ingredient = CustomCollectionIngredientSerializer(many=True)
# Path: collection/views.py
