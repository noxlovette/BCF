from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views import generic

from .models import Ingredient

# Create your views here.

def modify(request, ing_id):
    ingredient = get_object_or_404(Ingredient, pk=ing_id)

    if request.method == 'POST':
        selected_choice_pk = request.POST.get("choice")
        if selected_choice_pk is None:
            return render(
                request, "ingredients_app/modify.html",
                {
                    "ingredient": ingredient,
                    "error_message": "You didn't select a type",
                }
            )

        selected_choice = None
        for choice in ingredient.INGREDIENT_TYPES:
            if choice[0] == selected_choice_pk:
                selected_choice = choice
                break

        if selected_choice is None:
            return render(
                request, "ingredients_app/modify.html",
                {
                    "ingredient": ingredient,
                    "error_message": "Selected type is not valid",
                }
            )

        ingredient.ingredient_type = selected_choice[0]
        ingredient.save()
        return HttpResponseRedirect(reverse("ingredients_app:ingredient", args=[ingredient.id]))

    # Handle GET request
    return render(
        request, "ingredients_app/modify.html",
        {
            "ingredient": ingredient,
        }
    )