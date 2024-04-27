import json
from django.shortcuts import render
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import generics
from collection.models import CustomCollectionIngredient
from collection.serialisers import CustomCollectionIngredientSerializer
from .models import Formula, FormulaIngredient, Tag
from .serialisers import FormulaSerializer, FormulaIngredientSerializer
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


def index_view(request):
    """
    renders the minimalistic index page
    :param request:
    :return:
    """
    return render(request, 'formulae/index.html')


from django.contrib.auth.models import User


class FormulaCreateAPI(generics.CreateAPIView):
    """
    CREATE A NEW FORMULA
    """
    serializer_class = FormulaSerializer

    def perform_create(self, serializer):
        # Get the user_id from the URL
        user_id = self.kwargs.get('user_id')
        # Get the user object
        user = User.objects.get(id=user_id)
        # Set the user field before saving the object
        serializer.save(user=user, created_at=timezone.now(), updated_at=timezone.now())


class FormulaListViewAPI(generics.ListAPIView):
    """
    LIST OF FORMULAE. The page is populated by JS
    """
    serializer_class = FormulaSerializer

    def get_queryset(self):
        # Get the user_id from the URL
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            # Get the user object
            user = User.objects.get(id=user_id)
            return Formula.objects.filter(user=user)
        else:
            # If user_id is not provided, return an empty queryset
            return Formula.objects.none()


class FormulaDetailViewAPI(generics.RetrieveUpdateAPIView):
    """
    Looks for pk in the url and returns the formula. Can also edit it.
    """
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def update(self, request, *args, **kwargs):
        raw_data = request.body.decode('utf-8')
        data = json.loads(raw_data)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def get_serializer(self, *args, **kwargs):
        # Specify partial=True for partial updates
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        # Set the updated_at field to the current time
        request.data['updated_at'] = timezone.now()
        return super().partial_update(request, *args, **kwargs)


class FormulaIngredientDeleteAPIView(generics.DestroyAPIView):
    queryset = FormulaIngredient.objects.all()
    serializer_class = FormulaIngredientSerializer


class FormulaDeleteAPIView(generics.DestroyAPIView):
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer


# Path: formulae/urls.py

class FormulaAsCustomIngredientAPI(generics.CreateAPIView):
    serializer_class = CustomCollectionIngredientSerializer

    def perform_create(self, serializer):
        formula_id = self.kwargs.get('formula_id')

        try:
            formula = Formula.objects.get(id=formula_id)
        except Formula.DoesNotExist:
            raise ValidationError("Formula with id {} does not exist".format(formula_id))

        existing_relationship = CustomCollectionIngredient.objects.filter(
            content_type=ContentType.objects.get_for_model(Formula), object_id=formula_id).exists()
        if existing_relationship:
            raise ValidationError("A relationship between this formula and a custom ingredient already exists")

        # Create the CustomCollectionIngredient instance
        custom_ingredient = CustomCollectionIngredient.objects.create(
            common_name=formula.name,
            amount=0,
            unit='g',
            user=formula.user,
            date_added=timezone.now(),
            use=formula.description,
            cas='BASE',
        )


        # Set the content type and object id fields for the generic relationship
        custom_ingredient.content_type = ContentType.objects.get_for_model(Formula)
        custom_ingredient.object_id = formula.id

        # Save the CustomCollectionIngredient instance
        custom_ingredient.save()
