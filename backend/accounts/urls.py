from django.urls import include, path
from . import views

login_patterns = [
    path('normal/', views.login, name='login'),
    path('google/', views.google_login, name='google_login'),
    path('google/finish/', views.GoogleLogin.as_view(),
         name='google_login_todjango'),
]

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', include(login_patterns)),
]