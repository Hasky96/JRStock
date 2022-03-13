from django.urls import path
from . import views

urlpatterns = [
    path('kospi/board/create/', views.board_kospi_create, name='board_kospi_create'),
    path('kospi/board/<str:code_number>', views.board_kospi_list, name='board_kospi_list'),
    path('kospi/board/detail/<int:pk>', views.board_kospi_detail, name='board_kospi_detail'),
    path('kospi/board/update/<int:pk>', views.board_kospi_update, name='board_kospi_update'),
    path('kospi/board/delete/<int:pk>', views.board_kospi_delete, name='board_kospi_delete'),
    path('kospi/comment/create/', views.comment_kospi_create, name='comment_kospi_create'),
    path('kospi/comment/<int:board_id>', views.comment_kospi_list, name='comment_kospi_list'),
    path('kospi/comment/update/<int:pk>', views.comment_kospi_update, name='comment_kospi_update'),
    
    path('kosdaq/board/create/', views.board_kosdaq_create, name='board_kosdaq_create'),
    path('kosdaq/board/<str:code_number>', views.board_kosdaq_list, name='board_kosdaq_list'),
    path('kosdaq/board/detail/<int:pk>', views.board_kosdaq_detail, name='board_kosdaq_detail'),
    path('kosdaq/board/update/<int:pk>', views.board_kosdaq_update, name='board_kosdaq_update'),
    path('kosdaq/board/delete/<int:pk>', views.board_kosdaq_delete, name='board_kosdaq_delete'),
    path('kosdaq/comment/create/', views.comment_kosdaq_create, name='comment_kosdaq_create'),
    path('kosdaq/comment/<int:board_id>', views.comment_kosdaq_list, name='comment_kosdaq_list'),
    path('kosdaq/comment/update/<int:pk>', views.comment_kosdaq_update, name='comment_kosdaq_update'),
    
    path('konex/board/create/', views.board_konex_create, name='board_konex_create'),
    path('konex/board/<str:code_number>', views.board_konex_list, name='board_konex_list'),
    path('konex/board/detail/<int:pk>', views.board_konex_detail, name='board_konex_detail'),
    path('konex/board/update/<int:pk>', views.board_konex_update, name='board_konex_update'),
    path('konex/board/delete/<int:pk>', views.board_konex_delete, name='board_konex_delete'),
    path('konex/comment/create/', views.comment_konex_create, name='comment_konex_create'),
    path('konex/comment/<int:board_id>', views.comment_konex_list, name='comment_konex_list'),
    path('konex/comment/update/<int:pk>', views.comment_konex_update, name='comment_konex_update'),
]
