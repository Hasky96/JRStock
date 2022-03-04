from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls.static import static
from django.conf import settings

from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="JRstock API",
        default_version='v1',
        description="JRstock API 페이지 입니다.",
        terms_of_service="https://ssafy.com/",
        contact=openapi.Contact(email="ssafy.6th.project@gmail.com"),
        license=openapi.License(name="Apache 2.0", url="https://www.apache.org/licenses/LICENSE-2.0.html"),
    ),
    public=True,
    permission_classes=[AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'swagger(?P<format>\.json|\.yaml)', schema_view.without_ui(
        cache_timeout=0), name='schema-json'),
    re_path(r'swagger', schema_view.with_ui(
        'swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'redoc', schema_view.with_ui(
        'redoc', cache_timeout=0), name='schema-redoc-v1'),
    path('user/', include('dj_rest_auth.urls')),
    path('user/', include('allauth.urls')),
    path('api/user/', include('accounts.urls')),
    path('api/notice/', include('notice.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
