from django.urls import path, re_path
from . import views

app_name = "formulae"

urlpatterns = [
    re_path(
        r"api/new/formula/(?P<pk>[a-f0-9\-]+)",
        views.FormulaDetail.as_view(),
        name="formula_update_api",
    ),
    re_path(
        r"api/formula/delete/(?P<pk>[a-f0-9\-]+)/",
        views.FormulaDelete.as_view(),
        name="formula_update_api",
    ),
    path("api/new/formula/list/", views.FormulaList.as_view(), name="formula_list_api"),
    path("api/formula/new/", views.FormulaCreate.as_view(), name="formula_create_api"),
]
