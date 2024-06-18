from django.conf import settings
from django.http import HttpResponseRedirect


# TODO INCLUDE THIS MIDDLEWARE IN THE MIDDLEWARE LIST IN settings.py
class EnsureHttpsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.is_secure() and settings.DEBUG is False:
            # Redirect to HTTPS version of the URL
            secure_url = request.build_absolute_uri().replace("http://", "https://")
            return HttpResponseRedirect(secure_url)

        return self.get_response(request)
