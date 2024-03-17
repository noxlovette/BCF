from django.core.paginator import Paginator
from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import generic
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from .models import UserCollectionIng, Ingredient, User
from rest_framework.views import APIView
import json


class CollectionView(generic.ListView):
    model = UserCollectionIng
    template_name = "user_collection/collection.html"
    context_object_name = "collection"

    def get_queryset(self):
        return UserCollectionIng.objects.order_by('ingredient__common_name').values_list('ingredient__common_name', flat=True)


class CollectionAPI(APIView):
    """
    API endpoint that allows collection to be viewed.
    """

    def get(self, request):
        # TEMPORARY HARD-CODED USER ID
        user_id = 2
        user = User.objects.get(id=user_id)
        page_number = request.GET.get('page', 1)  # Get the page number from the request parameters
        ingredients = UserCollectionIng.objects.filter(user=user).order_by('ingredient__common_name')
        paginator = Paginator(ingredients, 20)  # Create a Paginator object with 20 items per page
        page = paginator.get_page(page_number)  # Get the requested page
        collection_json = [collection_ing.to_json for collection_ing in page]  # Convert the collection to JSON
        return Response(collection_json)


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
