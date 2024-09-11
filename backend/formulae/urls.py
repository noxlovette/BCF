from django.urls import path, re_path
from . import views

app_name = "formulae"

urlpatterns = [
    
    path(
        "api/formula/list/", views.FormulaListViewAPI.as_view(), name="formula_list_api"
    ),
    re_path(
        r"api/formula/(?P<uuid>[a-f0-9\-]+)/",
        views.FormulaDetailViewAPI.as_view(),
        name="formula_detail",
    ),
    path(
        "api/ingredient/<int:pk>/delete/",
        views.FormulaIngredientDeleteAPIView.as_view(),
        name="ingredient_delete_api",
    ),
    path(
        "api/formula/<int:formula_id>/add_as_custom/",
        views.FormulaAsCustomIngredientAPI.as_view(),
        name="formula_as_custom_ingredient_api",
    ),
    path(
        "api/formula/tag/<int:formula_id>",
        views.FormulaTagAPI.as_view(),
        name="formula_add_tag_api",
    ),


    re_path(
        r"api/new/formula/(?P<pk>[a-f0-9\-]+)",
        views.NewFormulaDetail.as_view(),
        name="formula_update_api",
    ),
    re_path(
        r"api/formula/delete/(?P<pk>[a-f0-9\-]+)/",
        views.NewFormulaDelete.as_view(),
        name="formula_update_api",
    ),
    path(
        "api/new/formula/list/", views.NewFormulaList.as_view(), name="formula_list_api"
    ),
    path(
        "api/formula/new/", views.NewFormulaCreate.as_view(), name="formula_create_api"
    ),
]
