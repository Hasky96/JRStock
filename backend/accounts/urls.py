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
    path('detail/', views.user_detail, name='user_detail'),
    path('', views.user_list, name='user_list'),
    path('update/<int:pk>', views.user_update, name='user_update'),
    path('login/', include(login_patterns)),
    path('email-confirm/<str:uidb64>/<str:token>', views.email_confirm, name='email_confirm'),
    path('email-check/<str:email>', views.email_check, name='email_check'),
]