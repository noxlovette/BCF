from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import logout
import logging
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_safe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from collection.models import CustomCollectionIngredient
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

logger = logging.getLogger(__name__)


class UserSignupAPI(APIView):
    # TODO: CAPTCHA, verify email
    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validate input data
        if not username or not email or not password:
            return Response({'error': 'Please provide username, email, and password'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create new user
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            gift = CustomCollectionIngredient.objects.create(
                user_id=user.id,
                common_name="test ingredient",
                cas="123456-78-9",
                amount=100, unit='g', colour='green', impression='this is your first ingredient in collectoin',
                associations='write what you want about it', ideas='think of how you can use it')
            gift.save()
            meow = {
                'message': 'User created successfully',
                'user_id': user.id,
                'username': user.username,
                'is_authenticated': user.is_authenticated,
            }
            return Response(meow, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginAPI(APIView):
    # TODO CAPTCHA, verify email
    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({
                'user_id': user.id,
                'username': user.username,
                'is_authenticated': user.is_authenticated,
            })
        else:
            return Response({
                'error': 'Invalid username or password',
            }, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutAPI(APIView):
    def post(self, request, *args, **kwargs):

        logout(request)
        return Response({'message': 'User logged out successfully'})


@login_required
def get_user_id(request):
    return JsonResponse({'user_id': request.user.id})


@require_safe  # Ensures that the view only responds to safe GET requests
def get_csrf_token(request):
    csrf_token = get_token(request)  # Ensures CSRF cookie is set and retrieves the token
    return JsonResponse({'csrfToken': csrf_token})  # Send CSRF token in JSON response


