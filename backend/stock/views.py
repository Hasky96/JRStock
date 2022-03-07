from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import InfoKospiSerializer

from .models import InfoKospi

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .parser import get_serializer

page = openapi.Parameter('page', openapi.IN_QUERY, default=1,
                        description="페이지 번호", type=openapi.TYPE_INTEGER)
size = openapi.Parameter('size', openapi.IN_QUERY, default=5,
                        description="한 페이지에 표시할 객체 수", type=openapi.TYPE_INTEGER)
sort = openapi.Parameter('sort', openapi.IN_QUERY, default="id",
                        description="정렬할 기준 Column, 'id'면 오름차순 '-id'면 내림차순", type=openapi.TYPE_STRING)
@swagger_auto_schema(
    method='get',
    operation_id='코스피 주식 종목 전체 조회',
    operation_description='코스피 주식 종목 전체를 조회 합니다',
    tags=['주식'],
    manual_parameters=[page, size, sort],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 회원 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("infokospi", "유저 정보"),
            }
        )
    )}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def info_kospi_list(request):
    sort = request.GET.get('sort')
    
    if not sort == None:
        info_kospi_list = InfoKospi.objects.all().order_by(sort) # 전달 받은 값 기준 정렬
    else:
        info_kospi_list = InfoKospi.objects.all()
        
    paginator = PageNumberPagination()

    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size

    result = paginator.paginate_queryset(info_kospi_list, request)
    serializers = InfoKospiSerializer(result, many=True)
    return paginator.get_paginated_response(serializers.data)

@swagger_auto_schema(
    method='get',
    operation_id='코스피 주식 상세 조회',
    operation_description='공코스피 주식 상세 조회 합니다',
    tags=['주식'],
    responses={status.HTTP_200_OK: InfoKospiSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def info_kospi_detail(request, code_number):
    info_kospi = get_object_or_404(InfoKospi, pk=code_number)
    serializer = InfoKospiSerializer(info_kospi)
    
    return Response(serializer.data, status=status.HTTP_200_OK)