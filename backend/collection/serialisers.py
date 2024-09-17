from rest_framework import serializers
from .models import CollectionIngredient
from formulae.models import Formula
from formulae.serialisers import FormulaSerializer


class CollectionSerializer(serializers.ModelSerializer):
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
    related_formulas = serializers.SerializerMethodField()

    def get_related_formulas(self, obj):
        # Access the counterpart set from CollectionIngredient via FormulaIngredient
        # Retrieve unique formula IDs by iterating through the related FormulaIngredient instances
        formulas = Formula.objects.filter(ingredients__counterpart=obj).distinct()
        for formula in formulas:
            formula.prepare_for_serialization()

        return FormulaSerializer(formulas, many=True).data

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            return CollectionIngredient.objects.create(
                user=request.user, **validated_data
            )
        raise serializers.ValidationError(
            "User must be authenticated to create an ingredient."
        )

    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            instance.user = request.user

        return super().update(instance, validated_data)

    class Meta:
        model = CollectionIngredient
        fields = "__all__"
        read_only_fields = ["user"]
