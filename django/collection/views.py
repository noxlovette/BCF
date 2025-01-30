from django.db import IntegrityError
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response

from .models import (
    User,
    CollectionIngredient,
)

from browse.models import Ingredient
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
import logging
from .serialisers import (
    CollectionSerializer,
)

logger = logging.getLogger(__name__)

# NEW


class IngredientCreateView(generics.CreateAPIView):
    """
    CREATE A NEW INGREDIENT
    """

    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        # Use the default create behavior from DRF
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ingredient = serializer.save()

        return Response(
            {"id": ingredient.id, "url": f"/collect/{ingredient.id}"},
            status=status.HTTP_201_CREATED,
        )


class IngredientUpdateView(generics.UpdateAPIView):
    queryset = CollectionIngredient.objects.all()
    serializer_class = CollectionSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        return self.queryset.filter(user=user)

    def get_serializer_context(self):
        # Add the request to the serializer context
        return {"request": self.request}

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class IngredientDetailView(generics.RetrieveAPIView):
    queryset = CollectionIngredient.objects.all()
    serializer_class = CollectionSerializer

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied(
                "You do not have permission to access this ingredient."
            )

        obj.prepare_for_serialization()
        return obj


class IngredientDeleteView(generics.DestroyAPIView):
    queryset = CollectionIngredient.objects.all()
    serializer_class = CollectionSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        return self.queryset.filter(user=user)


class CollectionAPI(generics.ListAPIView):
    serializer_class = CollectionSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")

        # Filter the queryset based on the authenticated user
        queryset = CollectionIngredient.objects.filter(user=user)

        for ingredient in queryset:
            ingredient.prepare_for_serialization()

        # Pass the queryset to the serializer
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")

        try:
            data = request.data
            ingredient_id = data.get("ingredient_id")
            ingredient = Ingredient.objects.get(id=ingredient_id)

            CollectionIngredient.objects.create(
                user=user,
                common_name=ingredient.common_name,
                cas=ingredient.cas,
                volatility=ingredient.volatility,
                use=ingredient.use,
                descriptors=ingredient.get_descriptors(),
                other_names=ingredient.other_names,
                origin=ingredient.origin,
            )

            return JsonResponse({"success": True})
        except IntegrityError:
            return JsonResponse(
                {"error": "ingredient is already in collection"}, status=400
            )
        except (User.DoesNotExist, Ingredient.DoesNotExist):
            return JsonResponse(
                {"error": "user or ingredient does not exist"}, status=400
            )
        except ValueError:
            return JsonResponse({"error": "invalid ingredient_id"}, status=400)
