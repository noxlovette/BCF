from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import JsonResponse
from django.views import generic
from rest_framework.response import Response
from .models import CollectionIngredient, Ingredient, User
from rest_framework.views import APIView
import json
from rest_framework.exceptions import ParseError


class CollectionView(generic.ListView):
    model = CollectionIngredient
    template_name = "collection/collection.html"
    context_object_name = "collection"

    def get_queryset(self):
        return self.request.session.get('collection', [])


class CollectionAPI(APIView):
    def get_collection(self, request, user_id):
        user = User.objects.get(id=user_id)
        collection_ingredients = CollectionIngredient.objects.filter(user=user).order_by('ingredient__common_name')
        return collection_ingredients

    def get(self, request, user_id):

        collection_ingredients = self.get_collection(request, user_id)

        if not collection_ingredients.exists():
            empty_ingredient = {
                'ingredient': '',
                'ingredient.cas': '',
                'ingredient.volatility': '',
                'ingredient.use': '',
                'amount': '',
                'colour': '',
                'impression': '',
                'date_added': '',
                'is_collection': False
            }
            return JsonResponse(empty_ingredient, status=200)

        collection_json = [collection_ingredient.to_json for collection_ingredient in collection_ingredients]
        request.session['collection'] = collection_json

        return Response(collection_json)



    def post(self, request, user_id):
        try:
            data = request.data
            ingredient_id = data.get('ingredient_id')

            # Get the user and ingredient from the database using the provided IDs
            user = User.objects.get(id=user_id)
            ingredient = Ingredient.objects.get(id=ingredient_id)

            # Create a new CollectionIngredient object
            CollectionIngredient.objects.create(user=user, ingredient=ingredient)

            return JsonResponse({'success': True})
        except IntegrityError:
            return JsonResponse({'error': 'Ingredient is already in collection.'}, status=400)
        except (User.DoesNotExist, Ingredient.DoesNotExist):
            return JsonResponse({'error': 'User or Ingredient does not exist.'}, status=400)
        except ParseError:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)
