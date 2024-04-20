# browse/middleware.py

from django.http import HttpResponseForbidden


# we can use middleware to validate the referrer of the request. make sure to add the middleware to the MIDDLEWARE list in settings.py
class ValidateReferrerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the request is for your API endpoint
        if 'api/ingredients' in request.path:
            # Check if the referrer is from your website – don't allow requests from other websites
            if 'http://127.0.0.1:8000' not in request.META.get('HTTP_REFERER', ''):
                return HttpResponseForbidden()

        response = self.get_response(request)
        return response
