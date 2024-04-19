from itertools import chain
from django.db import IntegrityError
from django.db.models import Q
from django.http import JsonResponse
from django.views import generic
from rest_framework import generics
from rest_framework.response import Response
from .models import CollectionIngredient, Ingredient, User, CustomCollectionIngredient
from rest_framework.views import APIView
from rest_framework.exceptions import ParseError
import logging
from .serialisers import CollectionIngredientSerializer, \
    CustomCollectionIngredientSerializer

logger = logging.getLogger(__name__)


class CustomIngredientUpdateView(APIView):
    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            user_id = kwargs.get('user_id')
            custom_collection_ingredient_id = kwargs.get('customCollectionIngredientId')

            try:
                custom_collection_ingredient = CustomCollectionIngredient.objects.get(user=user_id,
                                                                                      id=custom_collection_ingredient_id)
            except CustomCollectionIngredient.DoesNotExist:
                return JsonResponse({'error': 'CustomCollectionIngredient does not exist.'}, status=400)

            # Update the fields. if a key is missing, it defaults to what was there...
            custom_collection_ingredient.amount = data.get('amount', custom_collection_ingredient.amount)
            custom_collection_ingredient.colour = data.get('colour', custom_collection_ingredient.colour).strip()
            custom_collection_ingredient.impression = data.get('impression',
                                                               custom_collection_ingredient.impression).strip()
            custom_collection_ingredient.is_collection = data.get('is_collection',
                                                                  custom_collection_ingredient.is_collection)

            custom_collection_ingredient.save()

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
            custom_collection_ingredient_id = kwargs.get('customCollectionIngredientId')

            try:
                custom_collection_ingredient = CustomCollectionIngredient.objects.get(user=user_id,
                                                                                      id=custom_collection_ingredient_id)
            except CustomCollectionIngredient.DoesNotExist:
                return JsonResponse({'error': 'CustomCollectionIngredient does not exist.'}, status=400)

            custom_collection_ingredient.delete()

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


class IngredientUpdateView(generics.UpdateAPIView):
    queryset = CollectionIngredient.objects.all()
    serializer_class = CollectionIngredientSerializer
    lookup_url_kwarg = 'collectionIngredientId'

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return self.queryset.filter(user=user_id)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class IngredientDeleteView(generics.DestroyAPIView):
    queryset = CollectionIngredient.objects.all()
    serializer_class = CollectionIngredientSerializer
    lookup_url_kwarg = 'collectionIngredientId'

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return self.queryset.filter(user=user_id)


class CollectionView(generic.ListView):
    template_name = "collection/collection.html"
    context_object_name = "collection"

    def get_queryset(self):
        collection = self.request.session.get('collection', [])
        collection_ingredient_ids = [id for item in collection if len(item) == 2 and item[0] == 'CollectionIngredient'
                                     for type, id in [item]]
        custom_collection_ids = [id for item in collection if len(item) == 2 and item[0] == 'CustomCollectionIngredient'
                                 for type, id in [item]]

        collection_ingredient = list(CollectionIngredient.objects.filter(id__in=collection_ingredient_ids))
        custom_collection = list(CustomCollectionIngredient.objects.filter(id__in=custom_collection_ids))
        for obj in collection_ingredient:
            obj.type = 'CollectionIngredient'
        for obj in custom_collection:
            obj.type = 'CustomCollectionIngredient'

        combined_collection = collection_ingredient + custom_collection

        return combined_collection


class CollectionAPI(APIView):
    # todo accomodate for customingredient

    def get_collection(self, request, user_id):
        user = User.objects.get(id=user_id)
        search_param = request.query_params.get('search', None)

        collection_ingredients = CollectionIngredient.objects.filter(user=user).order_by('ingredient__common_name')
        custom_collection_ingredients = CustomCollectionIngredient.objects.filter(user=user).order_by('common_name')

        if search_param:
            collection_ingredients = collection_ingredients.filter(
                Q(ingredient__common_name__icontains=search_param) |
                Q(ingredient__other_names__icontains=search_param) |
                Q(ingredient__cas__icontains=search_param)
            ).order_by('ingredient__common_name')

            custom_collection_ingredients = custom_collection_ingredients.filter(
                Q(common_name__icontains=search_param) |
                Q(cas__icontains=search_param)
            ).order_by('common_name')

        return collection_ingredients, custom_collection_ingredients

    def get(self, request, user_id):
        logger.info('GET request received')
        collection_ingredients, custom_collection_ingredients = self.get_collection(request, user_id)

        if not collection_ingredients.exists() and not custom_collection_ingredients.exists():
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

        collection_serializer = CollectionIngredientSerializer(collection_ingredients, many=True)
        custom_collection_serializer = CustomCollectionIngredientSerializer(custom_collection_ingredients, many=True)
        combined_data = list(chain(collection_serializer.data, custom_collection_serializer.data))
        sorted_data = sorted(combined_data, key=lambda x: x['common_name'])

        return Response(sorted_data)

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


class IngredientCreateView(generics.CreateAPIView):
    """
    CREATE A NEW CUSTOM INGREDIENT
    """

    serializer_class = CustomCollectionIngredientSerializer

    def perform_create(self, serializer):
        # Set the user field before saving the object
        serializer.save(user=self.request.user)
