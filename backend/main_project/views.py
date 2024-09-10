import json
from django.contrib.auth import logout
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_safe
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, update_session_auth_hash, login
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

import logging

logger = logging.getLogger(__name__)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User


class UserSignupAPI(APIView):
    # TODO: CAPTCHA, verify email.
    """
    Check if username or email already exists. If not, create a new user. Auth is handled by django.
    """

    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Validate input data
        if not username or not email or not password:
            return Response(
                {"error": "Please provide username, email, and password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already in use"}, status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create new user
        try:
            User.objects.create_user(username=username, email=email, password=password)
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                response_data = {
                    "message": "User created and authenticated successfully",
                    "username": user.username,
                    "is_authenticated": user.is_authenticated,
                    "email": user.email,
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "Authentication failed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginAPI(APIView):
    # TODO CAPTCHA, verify email
    """
    Check if user exists and login. Auth is handled by django.
    """

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response(
                {
                    "username": user.username,
                    "is_authenticated": user.is_authenticated,
                    "email": user.email,
                    "sessionid": request.session.session_key,
                }
            )
        else:
            return Response(
                {
                    "error": "Invalid username or password",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserLogoutAPI(APIView):
    """
    Logout the user. Invalidate the session.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({"message": "User logged out successfully"})


class UserProfileUpdateAPI(APIView):
    """
    Update the user's profile. Change password if requested. Change username and email if provided.
    """

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        logging.debug("Raw data received: %s", request.data)
        user = request.user
        data = request.data
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST
                )

        # Check if the password change is requested and validate the old password
        old_password = data.get("oldPassword")
        new_password = data.get("newPassword")
        if old_password and new_password:
            if not user.check_password(old_password):
                return Response(
                    {"error": "Wrong password"}, status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(new_password)

        # Update email and username if provided
        if email := data.get("email"):
            if (
                User.objects.filter(email=email)
                .exclude(username=user.username)
                .exists()
            ):
                return Response(
                    {"error": "Email already in use"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                user.email = email

        if username := data.get("username"):
            if (
                User.objects.filter(username=username)
                .exclude(email=user.email)
                .exists()
            ):
                return Response(
                    {"error": "Username already in use"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                user.username = username
        user.save()

        # Keep the session valid after changing password
        if new_password:
            update_session_auth_hash(request, user)

        return Response({"success": "Profile updated"}, status=status.HTTP_200_OK)


class UserDeleteAPI(APIView):
    """
    Delete the user. Auth is handled by django.
    """

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            user = request.user
            user.delete()
            return Response(
                {"message": "User deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except ObjectDoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@require_safe  # Ensures that the view only responds to safe GET requests
def get_csrf_token(request):
    csrf_token = get_token(
        request
    )  # Ensures CSRF cookie is set and retrieves the token
    return JsonResponse({"csrfToken": csrf_token})  # Send CSRF token in JSON response


class CheckSessionAPI(APIView):
    """
    Check if the user is authenticated.
    """
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            csrf_token = get_token(
        request
    )
            return Response(
                {
                    "is_authenticated": request.user.is_authenticated,
                    "username": request.user.username,
                    "email": request.user.email,
                    "csrfToken": csrf_token,
                }
            )
        else:
            return Response(
                {"is_authenticated": request.user.is_authenticated},
                status=status.HTTP_401_UNAUTHORIZED,
            )