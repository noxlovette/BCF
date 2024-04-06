from django.shortcuts import render
from django.contrib.auth.views import LoginView
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json
from .forms import LoginForm
from django.contrib.auth import authenticate, login
import logging
from django.http import QueryDict

logger = logging.getLogger(__name__)


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        logger.info('Received username: %s', username)
        logger.info('Received password: %s', password)
    return JsonResponse({'message': 'This is a response from the server.'})


@login_required
def get_user_id(request):
    return JsonResponse({'user_id': request.user.id})


def home(request):
    return render(request, 'main page.html')


class UserLoginView(LoginView):
    template_name = "registration/login.html"
    form_class = LoginForm

    def post(self, request, *args, **kwargs):
        logger.info('Received request body: %s', request.body)

        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # Create a new QueryDict and add the username and password
        post_data = QueryDict(mutable=True)
        post_data.update({
            'username': username,
            'password': password,
        })

        # Replace the request's POST data with the new QueryDict
        request.POST = post_data

        return super().post(request, *args, **kwargs)

    def form_valid(self, form):
        # Authenticate the user
        user = authenticate(
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password']
        )

        if user is not None:
            # Log the user in
            login(self.request, user)

            # Return a JSON response
            return JsonResponse({
                'user_id': user.id,
                'username': user.username,
                'is_authenticated': user.is_authenticated,
            })
        else:
            # Authentication failed
            return JsonResponse({
                'error': 'Invalid username or password',
            }, status=400)

    def form_invalid(self, form):
        logger.error('Form is invalid: %s', form.errors)
        return JsonResponse({
            'error': 'Form broken',
            'errors': form.errors,
        }, status=400)


def fuck_off(request, exception=None):
    """
    custom 403
    :param exception:
    :type request: object
    """
    return render(request, '403.html', status=403)
