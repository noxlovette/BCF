from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import UserCollectionIng, Ingredient, User
import json




@csrf_exempt
def add_to_collection(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            user_id = data.get('user_id')
            ingredient_id = data.get('ingredient_id')

            user = User.objects.get(id=user_id)
            ingredient = Ingredient.objects.get(id=ingredient_id)

            UserCollectionIng.objects.create(
                user=user,
                ingredient=ingredient
            )

            return JsonResponse({'success': True})
    except IntegrityError:
        return JsonResponse({'error': 'Ingredient is already in collection.'}, status=400)

    return JsonResponse({'success': False})


def modify(request, ing_id):
    """
    modifies the local representation of an ingredients. TODO
    :param request:
    :param ing_id:
    :return:
    """
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
