# register models on the admin page

from django.contrib import admin
from .models import Ingredient, Descriptor


class IngredientAdmin(admin.ModelAdmin):
    search_fields = ["common_name", "cas"]
    list_display = ["common_name", "cas", "get_descriptors", "ingredient_type"]
    fieldsets = [
        ("Basic Info", {"fields": ["common_name", "cas", "family", "ingredient_type"]}),
        ("Subjective Info", {"fields": ["colour", "olfactory_profile"]}),
    ]


class FamilyAdmin(admin.ModelAdmin):
    fields = ["name", "description"]


admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(Descriptor)
