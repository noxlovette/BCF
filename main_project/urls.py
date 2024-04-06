from django.contrib import admin
from . import views
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from .views import UserLoginView

urlpatterns = [
    path('', views.home, name='home'),
    path('api/user_id', views.get_user_id,  name='user_id'),
    path('login/', UserLoginView.as_view(), name='login'),
    path("browse/", include('browse.urls')),
    path("collection/", include('collection.urls')),
    path("formulae/", include('formulae.urls')),
    path('admin/', admin.site.urls),
    path("__debug__/", include("debug_toolbar.urls")),
    re_path(r'^favicon\.ico$', RedirectView.as_view(url='/static/images/favicon.ico')),
]
