from django.urls import path
from . import views

app_name = 'formulae'

urlpatterns = [
    path('', views.index_view, name='index'),
    path('api/formula/new/', views.FormulaCreateAPI.as_view(), name='formula_create_api'),
    path('api/formula/list/', views.FormulaListViewAPI.as_view(), name='formula_list_api'),
    path('api/formula/<int:pk>/', views.FormulaDetailViewAPI.as_view(), name="formula_detail"),
    path('<int:pk>/edit/', views.FormulaUpdateView.as_view(), name="formula_edit"),
]
