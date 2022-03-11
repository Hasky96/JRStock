from django.urls import path
from . import views

urlpatterns = [
    path('kospi/', views.info_kospi_list, name='info_kospi_list'),
    path('kospi/<str:code_number>', views.info_kospi_detail, name='info_kospi_detail'),
    path('kospi/financial/<str:code_number>', views.financial_kospi_detail, name='financial_kospi_detail'),
    path('kospi/board/create/', views.board_kospi_create, name='board_kospi_create'),
    path('kospi/board/<str:code_number>/', views.board_kospi_list, name='board_kospi_list'),
    
    path('kosdaq/', views.info_kosdaq_list, name='info_kosdaq_list'),
    path('kosdaq/<str:code_number>', views.info_kosdaq_detail, name='info_kosdaq_detail'),
    path('kosdaq/financial/<str:code_number>', views.financial_kosdaq_detail, name='financial_kosdaq_detail'),
    path('kosdaq/board/create/', views.board_kosdaq_create, name='board_kosdaq_create'),
    path('kosdaq/board/<str:code_number>/', views.board_kosdaq_list, name='board_kosdaq_list'),
    
    path('konex/', views.info_konex_list, name='info_konex_list'),
    path('konex/<str:code_number>', views.info_konex_detail, name='info_konex_detail'),
    path('konex/financial/<str:code_number>', views.financial_konex_detail, name='financial_konex_detail'),
    path('konex/board/create/', views.board_konex_create, name='board_konex_create'),
    path('konex/board/<str:code_number>/', views.board_konex_list, name='board_konex_list'),
]
