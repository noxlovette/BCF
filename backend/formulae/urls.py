from django.urls import path
from . import views

app_name = 'formulae'

urlpatterns = [
    path('', views.index_view, name='index'),
    path('api/formula/<int:user_id>/new/', views.FormulaCreateAPI.as_view(), name='formula_create_api'),
    path('api/formula/<int:user_id>/list/', views.FormulaListViewAPI.as_view(), name='formula_list_api'),
    path('api/formula/<int:user_id>/<int:pk>/', views.FormulaDetailViewAPI.as_view(), name="formula_detail"),
    path('api/formula/<int:user_id>/<int:pk>/delete/', views.FormulaDeleteAPIView.as_view(), name='formula_delete_api'),
    path('api/ingredient/<int:user_id>/<int:pk>/delete/', views.FormulaIngredientDeleteAPIView.as_view(),
         name='ingredient_delete_api'),
    path('api/formula/<int:user_id>/<int:formula_id>/add_as_custom/',
         views.FormulaAsCustomIngredientAPI.as_view(),
         name='formula_as_custom_ingredient_api'),
    path('api/formula/tag/<int:user_id>/<int:formula_id>', views.FormulaTagAPI.as_view(),
         name='formula_add_tag_api'),
]
