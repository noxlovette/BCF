from django.contrib import admin
from . import views
from django.urls import path, include
from .views import get_csrf_token

urlpatterns = [
    path('api/user_id', views.get_user_id,  name='user_id'),
    path("browse/", include('browse.urls')),
    path("collection/", include('collection.urls')),
    path("formulae/", include('formulae.urls')),
    path('admin/', admin.site.urls),
    path("__debug__/", include("debug_toolbar.urls")),
    path('api/get-csrf/', get_csrf_token, name='get_csrf_token'),
    path('api/login/', views.UserLoginAPI.as_view(), name='api-login'),
    path('api/signup/', views.UserSignupAPI.as_view(), name='api-signup'),
    path('api/logout/', views.UserLogoutAPI.as_view(), name='api-logout'),
]
