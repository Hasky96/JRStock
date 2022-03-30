from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.test_start, name='test_start'),
    path('', views.get_my_backtest_result, name='get_my_backtest_result'),
    path('<int:pk>', views.get_backtest_result, name='get_backtest_result'),
    path('buysell/<int:backtest_id>', views.get_backtest_buysell, name='get_backtest_buysell'),
    path('condition/<int:backtest_id>', views.get_backtest_condition, name='get_backtest_condition'),
    path('day/<int:backtest_id>', views.get_backtest_day_history, name='get_backtest_day_history'),
    path('year/<int:backtest_id>', views.get_backtest_year_history, name='get_backtest_year_history'),
    
    path('rank/', views.get_rank, name='get_rank')
]
