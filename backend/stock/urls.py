from django.urls import path
from . import views

urlpatterns = [
    path('kospi/', views.info_kospi_list, name='info_kospi_list'),
    path('kospi/<str:code_number>', views.info_kospi_detail, name='info_kospi_detail'),
    path('kospi/board/create/', views.board_create_kospi, name='board_create_kospi'),
]
