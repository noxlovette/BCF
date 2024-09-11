from rest_framework import serializers
from .models import NewCollectionIngredient


class NewCollectionSerializer(serializers.ModelSerializer):
    impression = serializers.CharField(
        allow_null=True, allow_blank=True, source="_impression", required=False
    )
    ideas = serializers.CharField(
        allow_null=True, allow_blank=True, source="_ideas", required=False
    )
    associations = serializers.CharField(
        allow_null=True, allow_blank=True, source="_associations", required=False
    )
    colour = serializers.CharField(
        allow_null=True, allow_blank=True, source="_colour", required=False
    )
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return NewCollectionIngredient.objects.create(user=request.user, **validated_data)
        raise serializers.ValidationError("User must be authenticated to create an ingredient.")
    
    def update(self, instance, validated_data): 
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            instance.user = request.user

        return super().update(instance, validated_data)

    
    class Meta:
        model = NewCollectionIngredient
        fields = "__all__"
        read_only_fields = ['user']
