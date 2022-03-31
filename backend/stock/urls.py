from django.urls import path
from . import views

urlpatterns = [
    path('', views.basic_info_list, name='basic_info_list'),
    path('detail/<str:code_number>', views.financial_info_detail, name='financial_info_detail'),
    path('day/<str:code_number>', views.day_stock_list, name='day_stock_list'),
    path('live/<str:code_number>', views.live_data, name='live_data'),
    
    path('week/<str:code_number>', views.week_stock_list, name='week_stock_list'),
    path('month/<str:code_number>', views.month_stock_list, name='month_stock_list'),
    
    path('interest/create/', views.interest_stock_create, name='interest_stock_create'),
    path('interest/', views.interest_stock_list, name='interest_stock_list'),
    path('interest/delete/', views.interset_stock_delete, name='interset_stock_delete'),
    
    path('news/<str:code_number>', views.get_recent_news, name='get_recent_news'),
    
    path('start-end/<str:code_number>', views.get_start_end_date, name='get_start_end_date'),
    path('data/start-end/<str:code_number>', views.get_stock_data_with_startend, name='get_stock_data_with_startend'),
    
    path('predict/<str:code_number>', views.get_predict_data, name='get_predict_data'),
]
