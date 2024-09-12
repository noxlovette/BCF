from rest_framework import serializers, generics

from collection.models import NewCollectionIngredient
from formulae.models import NewFormulaIngredient, NewFormula
from django.db.models import Q


class NewFormulaIngredientSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(allow_null=True)
    class Meta:
        model = NewFormulaIngredient
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    


class NewFormulaSerializer(serializers.ModelSerializer):
    ingredients = NewFormulaIngredientSerializer(many=True)

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

        request = self.context.get('request')

        existing_ids = set(instance.ingredients.values_list('id', flat=True))

        new_ingredient_ids = set();

        ingredients_data = validated_data.pop("ingredients", [])
        for ingredient_data in ingredients_data:
            formula_ingredient_id = ingredient_data.get("id")



            # Try to find or create a counterpart NewCollectionIngredient
            counterpart = self.get_or_create_counterpart(ingredient_data, request.user)

            if formula_ingredient_id:  # If the id exists, update the instance
                new_ingredient_ids.add(formula_ingredient_id)

                NewFormulaIngredient.objects.update_or_create(
                    id=formula_ingredient_id,
                    defaults={
                        "amount": ingredient_data.get("amount"),
                        "formula": instance,
                        "volatility": ingredient_data.get("volatility"),
                        "percentage": ingredient_data.get("percentage"),
                        "common_name": ingredient_data.get("common_name"),
                        "counterpart": counterpart,  # associate the found or created counterpart
                    },
                )
            else:  # If id is None or Null, create a new instance
                NewFormulaIngredient.objects.create(
                    amount=ingredient_data.get("amount"),
                    formula=instance,
                    volatility=ingredient_data.get("volatility"),
                    percentage=ingredient_data.get("percentage"),
                    common_name=ingredient_data.get("common_name"),
                    counterpart=counterpart,  # associate the found or created counterpart
                )
        # Delete ingredients not in the updated list
        ids_to_remove = existing_ids - new_ingredient_ids

        if ids_to_remove:
            NewFormulaIngredient.objects.filter(id__in=ids_to_remove).delete()

        return instance

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients", [])

        name = validated_data.pop("_name", None)
        description = validated_data.pop("_description", None)
        notes = validated_data.pop("_notes", None)

        request = self.context.get('request')

        instance = NewFormula.objects.create(user=request.user, **validated_data)

        instance._name = name
        instance._description = description
        instance._notes = notes

        for ingredient_data in ingredients_data:
            # Try to find or create a counterpart NewCollectionIngredient
            counterpart = self.get_or_create_counterpart(ingredient_data)

            NewFormulaIngredient.objects.create(
                formula=instance, 
                counterpart=counterpart,  # associate the found or created counterpart
                **ingredient_data
            )

        instance.save()
        return instance

    def get_or_create_counterpart(self, ingredient_data, user):
        """Try to find a NewCollectionIngredient by common_name or other_names.
        If not found, create a new instance."""
        common_name = ingredient_data.get("common_name", '').strip()

        # Try to find a NewCollectionIngredient by common_name or other_names
        counterpart = NewCollectionIngredient.objects.filter(
            Q(common_name__icontains=common_name) | Q(other_names__icontains=common_name)
        ).first()

        if not counterpart:
            # Create a new NewCollectionIngredient if no match was found
            counterpart = NewCollectionIngredient.objects.create(
                user=user,
                common_name=common_name,
            )
        
        return counterpart

    class Meta:
        model = NewFormula
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at", "updated_at"]
