from django.urls import path
from . import views

urlpatterns = [
    path('kospi/', views.info_kospi_list),
]
