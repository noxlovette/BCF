from django.contrib import admin
from . import views
from django.urls import path, include, re_path
from django.views.generic import RedirectView

urlpatterns = [
    path('', views.home, name='home'),
    path("browse/", include('browse.urls')),
    path("collection/", include('collection.urls')),
    path("formulae/", include('formulae.urls')),
    path('admin/', admin.site.urls),
    path("__debug__/", include("debug_toolbar.urls")),
    re_path(r'^favicon\.ico$', RedirectView.as_view(url='/static/images/favicon.ico')),
]
