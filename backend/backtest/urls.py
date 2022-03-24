from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.test_start, name='test_start'),
]
