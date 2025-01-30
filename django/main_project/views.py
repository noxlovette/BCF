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
from collection.models import CollectionIngredient

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

        try:
            userInstance = User.objects.create_user(
                username=username, email=email, password=password
            )

            CollectionIngredient.objects.create(
                user=userInstance,
                common_name="Welcome!",
                use="This is your first ingredient. You can add more ingredients to your collection from the browse page.",
                descriptors="Vanillic, Sweet, Warm",
            )
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                response_data = {
                    "message": "User created and authenticated successfully",
                    "username": user.username,
                    "is_authenticated": user.is_authenticated,
                    "email": user.email,
                    "sessionid": request.session.session_key,
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "Authentication failed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


import logging
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.middleware.csrf import get_token

logger = logging.getLogger(__name__)

class UserLoginAPI(APIView):
    """
    Check if user exists and login. Auth is handled by django.
    """
    
    def post(self, request, *args, **kwargs):
        # Log request metadata
        logger.info("=== Login Attempt Details ===")
        logger.info(f"Request Method: {request.method}")
        logger.info(f"Content Type: {request.content_type}")
        logger.info(f"Request Headers: {dict(request.headers)}")
        
        # Log CSRF related information
        logger.info("=== CSRF Details ===")
        logger.info(f"CSRF Cookie: {request.COOKIES.get('csrftoken')}")
        logger.info(f"CSRF Header: {request.headers.get('X-CSRFToken')}")
        logger.info(f"Session ID: {request.COOKIES.get('sessionid')}")
        
        # Log request body
        logger.info("=== Request Data ===")
        logger.info(f"Raw Data: {request.data}")
        
        try:
            data = request.data
            username = data.get("username")
            password = data.get("password")
            
            # Log authentication attempt (careful with passwords!)
            logger.info(f"Attempting authentication for username: {username}")
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                logger.info(f"Authentication successful for user: {username}")
                login(request, user)
                
                # Log session details after login
                logger.info("=== Session Details After Login ===")
                logger.info(f"New Session ID: {request.session.session_key}")
                logger.info(f"Session Data: {dict(request.session)}")
                
                response_data = {
                    "username": user.username,
                    "is_authenticated": user.is_authenticated,
                    "email": user.email,
                    "sessionid": request.session.session_key,
                    "csrftoken": get_token(request),  # Include new CSRF token
                }
                
                logger.info("=== Response Data ===")
                logger.info(f"Response: {response_data}")
                
                response = Response(response_data)
                return response
            else:
                logger.warning(f"Authentication failed for username: {username}")
                return Response(
                    {
                        "error": "Invalid username or password",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
                
        except Exception as e:
            logger.error(f"Unexpected error in login process: {str(e)}", exc_info=True)
            return Response(
                {"error": "Server error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
            csrf_token = get_token(request)
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
