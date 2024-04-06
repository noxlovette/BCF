from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import JsonResponse
from django.views import generic
from rest_framework.response import Response
from .models import CollectionIngredient, Ingredient, User
from rest_framework.views import APIView
import json


class CollectionView(generic.ListView):
    model = CollectionIngredient
    template_name = "collection/collection.html"
    context_object_name = "collection"

    def get_queryset(self):
        return CollectionIngredient.objects.order_by('ingredient__common_name').values_list('ingredient__common_name',
                                                                                            flat=True)


class FullCollectionAPI(APIView):
    """
    API endpoint that allows full collection to be viewed.
    """

    def get(self, request):
        user_id = self.request.user.id
        user = User.objects.get(id=user_id)
        collection_ingredients = CollectionIngredient.objects.filter(user=user).order_by('ingredient__common_name')

        # Convert the collection to JSON
        collection_json = [collection_ingredient.to_json for collection_ingredient in collection_ingredients]
        return Response(collection_json)


class CollectionAPIPages(APIView):
    """
    API endpoint that allows collection to be viewed.
    """

    def get(self, request):
        # main code
        user_id = self.request.user.id
        user = User.objects.get(id=user_id)
        collection_ingredients = CollectionIngredient.objects.filter(user=user).order_by('ingredient__common_name')

        # pagination handling
        page_number = request.GET.get('page', 1)  # Get the page number from the request parameters
        paginator = Paginator(collection_ingredients, 20)  # Create a Paginator object with 20 items per page
        page = paginator.get_page(page_number)  # Get the requested page
        # Convert the collection to JSON
        collection_json = [collection_ingredient.to_json for collection_ingredient in page]
        return Response(collection_json)

    @staticmethod
    def post(request):
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            ingredient_id = data.get('ingredient_id')

            user = User.objects.get(id=user_id)
            ingredient = Ingredient.objects.get(id=ingredient_id)

            CollectionIngredient.objects.create(
                user=user,
                ingredient=ingredient
            )

            return Response({'success': True})
        except IntegrityError:
            return JsonResponse({'error': 'Ingredient is already in collection.'}, status=400)

        except TypeError:
            # i.e. if the collection doesn't exist
            return JsonResponse({'error': 'Collection does not exist.'}, status=400)
