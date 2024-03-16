from django.shortcuts import render


def home(request):
    return render(request, 'home.html')


def fuck_off(request, exception=None):
    """
    custom 403
    :param exception:
    :type request: object
    """
    return render(request, '403.html', status=403)
