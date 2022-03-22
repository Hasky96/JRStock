from django.urls import path
from . import views

urlpatterns = [
    path('post/create', views.post_create, name='post_create'),
    path('post/<str:code_number>', views.post_list, name='post_list'),
    path('post/my/<str:code_number>', views.my_post_list, name='my_post_list'),
    path('post/detail/<int:pk>', views.post_detail, name='post_detail'),
    path('post/update/<int:pk>', views.post_update, name='post_update'),
    path('post/delete/<int:pk>', views.post_delete, name='post_delete'),
    
    path('comment/create/', views.comment_create, name='comment_create'),
    path('comment/<int:post_id>', views.comment_list, name='comment_list'),
    path('comment/update/<int:pk>', views.comment_update, name='comment_update'),
    path('comment/delete/<int:pk>', views.comment_delete, name='comment_delete'),
]
