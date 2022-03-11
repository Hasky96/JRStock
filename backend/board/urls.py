from django.urls import path
from . import views

urlpatterns = [
    path('kospi/board/create/', views.board_kospi_create, name='board_kospi_create'),
    path('kospi/board/<str:code_number>', views.board_kospi_list, name='board_kospi_list'),
    path('kospi/board/detail/<int:pk>', views.board_kospi_detail, name='board_kospi_detail'),
    path('kospi/board/update/<int:pk>', views.board_kospi_update, name='board_kospi_update'),
    
    path('kosdaq/board/create/', views.board_kosdaq_create, name='board_kosdaq_create'),
    path('kosdaq/board/<str:code_number>', views.board_kosdaq_list, name='board_kosdaq_list'),
    path('kosdaq/board/detail/<int:pk>', views.board_kosdaq_detail, name='board_kosdaq_detail'),
    path('kosdaq/board/update/<int:pk>', views.board_kosdaq_update, name='board_kosdaq_update'),
    
    path('konex/board/create/', views.board_konex_create, name='board_konex_create'),
    path('konex/board/<str:code_number>', views.board_konex_list, name='board_konex_list'),
    path('konex/board/detail/<int:pk>', views.board_konex_detail, name='board_konex_detail'),
    path('konex/board/update/<int:pk>', views.board_konex_update, name='board_konex_update'),
]
