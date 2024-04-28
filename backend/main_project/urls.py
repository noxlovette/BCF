from django.contrib import admin
from . import views
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from .views import get_csrf_token

urlpatterns = [
    path('api/user_id', views.get_user_id,  name='user_id'),
    path("browse/", include('browse.urls')),
    path("collection/", include('collection.urls')),
    path("formulae/", include('formulae.urls')),
    path('admin/', admin.site.urls),
    path("__debug__/", include("debug_toolbar.urls")),
    re_path(r'^favicon\.ico$', RedirectView.as_view(url='/staticfiles/assets/img/bcf_logo_dark.png')),
    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('api/login/', views.UserLoginAPI.as_view(), name='api-login'),
    path('api/signup/', views.UserSignupAPI.as_view(), name='api-signup'),
    path('api/logout/', views.UserLogoutAPI.as_view(), name='api-logout'),
]
