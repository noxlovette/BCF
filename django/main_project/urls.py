from django.contrib import admin
from . import views
from django.urls import path, include
from .views import get_csrf_token
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("browse/", include("browse.urls")),
    path("collection/", include("collection.urls")),
    path("formulae/", include("formulae.urls")),
    path("admin/", admin.site.urls),
    path("__debug__/", include("debug_toolbar.urls")),
    path("api/get-csrf/", get_csrf_token, name="get_csrf_token"),
    path("api/login/", views.UserLoginAPI.as_view(), name="api-login"),
    path("api/signup/", views.UserSignupAPI.as_view(), name="api-signup"),
    path("api/logout/", views.UserLogoutAPI.as_view(), name="api-logout"),
    path(
        "api/profile/update/",
        views.UserProfileUpdateAPI.as_view(),
        name="api-profile-update",
    ),
    path("api/profile/delete/", views.UserDeleteAPI.as_view(), name="api-delete"),
    path(
        "api/check-session/", views.CheckSessionAPI.as_view(), name="api-check-session"
    ),
]
