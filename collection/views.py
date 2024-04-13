from django.db import IntegrityError
from django.db.models import Q
from django.http import JsonResponse
from django.views import generic
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from .models import CollectionIngredient, Ingredient, User
from rest_framework.views import APIView
from rest_framework.exceptions import ParseError
import logging

logger = logging.getLogger(__name__)


class IngredientUpdateView(APIView):
    # TODO rewrite for UpdateView
    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            user_id = kwargs.get('user_id')
            collection_ingredient_id = kwargs.get('collectionIngredientId')

            try:
                collection_ingredient = CollectionIngredient.objects.get(user=user_id, id=collection_ingredient_id)
            except CollectionIngredient.DoesNotExist:
                return JsonResponse({'error': 'CollectionIngredient does not exist.'}, status=400)

            # Update the fields. if a key is missing, it defaults to what was there...
            collection_ingredient.amount = int(
                data.get('amount', collection_ingredient.amount).replace(' g', '').strip())
            collection_ingredient.colour = data.get('colour', collection_ingredient.colour).strip()
            collection_ingredient.impression = data.get('impression', collection_ingredient.impression).strip()
            collection_ingredient.is_collection = data.get('is_collection', collection_ingredient.is_collection)

            collection_ingredient.save()

            return JsonResponse({'success': True})
        except Ingredient.DoesNotExist:
            return JsonResponse({'error': 'Ingredient does not exist.'}, status=400)
        except ParseError:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    def delete(self, request, *args, **kwargs):
        try:
            user_id = kwargs.get('user_id')
            collection_ingredient_id = kwargs.get('collectionIngredientId')

            try:
                collection_ingredient = CollectionIngredient.objects.get(user=user_id, id=collection_ingredient_id)
            except CollectionIngredient.DoesNotExist:
                return JsonResponse({'error': 'CollectionIngredient does not exist.'}, status=400)

            collection_ingredient.delete()

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


class CollectionView(generic.ListView):
    model = CollectionIngredient
    template_name = "collection/collection.html"
    context_object_name = "collection"

    def get_queryset(self):
        return self.request.session.get('collection', [])


class CollectionAPI(APIView):
    @csrf_exempt
    def get_collection(self, request, user_id):

        user = User.objects.get(id=user_id)
        search_param = request.query_params.get('search', None)
        collection_ingredients = CollectionIngredient.objects.filter(user=user).order_by('ingredient__common_name')

        if search_param:
            collection_ingredients = collection_ingredients.filter(
                Q(ingredient__common_name__icontains=search_param) |
                Q(ingredient__other_names__icontains=search_param) |
                Q(ingredient__cas__icontains=search_param)
            ).order_by('ingredient__common_name')

        return collection_ingredients

    @csrf_exempt
    def get(self, request, user_id):
        logger.info('GET request received')
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

        return Response(collection_json)

    @csrf_exempt
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
