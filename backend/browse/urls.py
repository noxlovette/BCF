from django.urls import path

from . import views
app_name = "browse"
urlpatterns = [
    # /browse/
    path("api/ingredients", views.BrowseView.as_view(), name="api-ingredients"),
]
