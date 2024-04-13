import json

from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import generics
from .models import Formula, FormulaIngredient
from .serialisers import FormulaSerializer, FormulaIngredientSerializer


def index_view(request):
    """
    renders the minimalistic index page
    :param request:
    :return:
    """
    return render(request, 'formulae/index.html')


class FormulaCreateAPI(generics.CreateAPIView):
    """
    CREATE A NEW FORMULA
    """
    serializer_class = FormulaSerializer

    def get_queryset(self):
        # access the sessionStorage
        user_id = self.request.session.get('user_id')

        if user_id is not None:
            return Formula.objects.filter(user=user_id)
        else:
            # i.e. you are not logged in
            return Formula.objects.none()


class FormulaListViewAPI(generics.ListAPIView):
    """
    LIST OF FORMULAE. The page is populated by JS
    """
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer
    @csrf_exempt
    def get_queryset(self):
        # Access the user_id from query parameters
        user_id = self.request.query_params.get('user_id')

        if user_id is not None:
            return Formula.objects.filter(user=user_id)
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
        raw_data = request.body.decode('utf-8')  # Decode the raw data
        data = json.loads(raw_data)  # Parse the raw data into a JSON object
        print(raw_data)
        print(data)

        # Get the existing instance
        instance = self.get_object()

        # Initialize the serializer with the existing instance and the data
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

