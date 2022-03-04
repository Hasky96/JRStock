from django.urls import include, path
from . import views

login_patterns = [
    path('normal/', views.login, name='login'),
    path('google/', views.google_login, name='google_login'),
    path('google/finish/', views.GoogleLogin.as_view(),
         name='google_login_todjango'),
]

urlpatterns = [
    path('create/', views.signup, name='signup'),
    path('', views.user_list, name='user_list'),
    path('detail/', views.user_detail, name='user_detail'),
    path('login/', include(login_patterns)),
    path('email_confirm/<str:uidb64>/<str:token>', views.email_confirm, name='email_confirm'),
]