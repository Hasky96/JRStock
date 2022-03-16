from django.urls import path
from . import views

urlpatterns = [
    # path('kospi/', views.info_kospi_list, name='info_kospi_list'),
    # path('kospi/<str:code_number>', views.info_kospi_detail, name='info_kospi_detail'),
    # path('kospi/financial/<str:code_number>', views.financial_kospi_detail, name='financial_kospi_detail'),
    
    # path('kosdaq/', views.info_kosdaq_list, name='info_kosdaq_list'),
    # path('kosdaq/<str:code_number>', views.info_kosdaq_detail, name='info_kosdaq_detail'),
    # path('kosdaq/financial/<str:code_number>', views.financial_kosdaq_detail, name='financial_kosdaq_detail'),
    
    # path('konex/', views.info_konex_list, name='info_konex_list'),
    # path('konex/<str:code_number>', views.info_konex_detail, name='info_konex_detail'),
    # path('konex/financial/<str:code_number>', views.financial_konex_detail, name='financial_konex_detail'),
    
    path('', views.basic_info_list, name='basic_info_list'),
    path('detail/<str:code_number>', views.financial_info_detail, name='financial_info_detail'),
    path('day-stock/<str:code_number>', views.day_stock_list, name='day_stock_list'),
]
