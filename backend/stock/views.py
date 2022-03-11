from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import FinancialKonexSerializer, FinancialKosdaqSerializer, FinancialKospiSerializer, InfoKonexSerializer, InfoKosdaqSerializer, InfoKospiSerializer

from .models import FinancialKonex, FinancialKosdaq, FinancialKospi, InfoKonex, InfoKosdaq, InfoKospi

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .parser import get_serializer

# ====================================================================== 코스피 ======================================================================

page = openapi.Parameter('page', openapi.IN_QUERY, default=1,
                        description="페이지 번호", type=openapi.TYPE_INTEGER)
size = openapi.Parameter('size', openapi.IN_QUERY, default=5,
                        description="한 페이지에 표시할 객체 수", type=openapi.TYPE_INTEGER)
sort = openapi.Parameter('sort', openapi.IN_QUERY, default="id",
                        description="정렬할 기준 Column, 'id'면 오름차순 '-id'면 내림차순", type=openapi.TYPE_STRING)
@swagger_auto_schema(
    method='get',
    operation_id='코스피 주식 종목 전체 조회(아무나)',
    operation_description='코스피 주식 종목 전체를 조회 합니다',
    tags=['주식_코스피'],
    manual_parameters=[page, size, sort],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 종목 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("info", "종목 정보"),
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
    operation_id='코스피 주식 상세 조회(아무나)',
    operation_description='코스피 주식 상세 조회 합니다',
    tags=['주식_코스피'],
    responses={status.HTTP_200_OK: InfoKospiSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def info_kospi_detail(request, code_number):
    info_kospi = get_object_or_404(InfoKospi, pk=code_number)
    serializer = InfoKospiSerializer(info_kospi)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='코스피 주식 재무제표 상세 조회(아무나)',
    operation_description='코스피 주식 재무제표를 상세 조회 합니다',
    tags=['주식_코스피'],
    responses={status.HTTP_200_OK: FinancialKospiSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def financial_kospi_detail(request, code_number):
    financial_kospi = get_object_or_404(FinancialKospi, pk=code_number)
    serializer = FinancialKospiSerializer(financial_kospi)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


# ====================================================================== 코스닥 ======================================================================
@swagger_auto_schema(
    method='get',
    operation_id='코스닥 주식 종목 전체 조회(아무나)',
    operation_description='코스닥 주식 종목 전체를 조회 합니다',
    tags=['주식_코스닥'],
    manual_parameters=[page, size, sort],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 종목 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("info", "종목 정보"),
            }
        )
    )}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def info_kosdaq_list(request):
    sort = request.GET.get('sort')
    
    if not sort == None:
        info_kosdaq_list = InfoKosdaq.objects.all().order_by(sort) # 전달 받은 값 기준 정렬
    else:
        info_kosdaq_list = InfoKosdaq.objects.all()
        
    paginator = PageNumberPagination()

    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size

    result = paginator.paginate_queryset(info_kosdaq_list, request)
    serializers = InfoKosdaqSerializer(result, many=True)
    return paginator.get_paginated_response(serializers.data)

@swagger_auto_schema(
    method='get',
    operation_id='코스닥 주식 상세 조회(아무나)',
    operation_description='코스닥 주식 상세 조회 합니다',
    tags=['주식_코스닥'],
    responses={status.HTTP_200_OK: InfoKosdaqSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def info_kosdaq_detail(request, code_number):
    info_kosdaq = get_object_or_404(InfoKosdaq, pk=code_number)
    serializer = InfoKosdaqSerializer(info_kosdaq)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='코스닥 주식 재무제표 상세 조회(아무나)',
    operation_description='코스닥 주식 재무제표를 상세 조회 합니다',
    tags=['주식_코스닥'],
    responses={status.HTTP_200_OK: FinancialKosdaqSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def financial_kosdaq_detail(request, code_number):
    financial_kosdaq = get_object_or_404(FinancialKosdaq, pk=code_number)
    serializer = FinancialKosdaqSerializer(financial_kosdaq)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

# ====================================================================== 코넥스 ======================================================================
@swagger_auto_schema(
    method='get',
    operation_id='코넥스 주식 종목 전체 조회(아무나)',
    operation_description='코넥스 주식 종목 전체를 조회 합니다',
    tags=['주식_코넥스'],
    manual_parameters=[page, size, sort],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 종목 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("info", "종목 정보"),
            }
        )
    )}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def info_konex_list(request):
    sort = request.GET.get('sort')
    
    if not sort == None:
        info_konex_list = InfoKonex.objects.all().order_by(sort) # 전달 받은 값 기준 정렬
    else:
        info_konex_list = InfoKonex.objects.all()
        
    paginator = PageNumberPagination()

    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size

    result = paginator.paginate_queryset(info_konex_list, request)
    serializers = InfoKonexSerializer(result, many=True)
    return paginator.get_paginated_response(serializers.data)

@swagger_auto_schema(
    method='get',
    operation_id='코넥스 주식 상세 조회(아무나)',
    operation_description='코넥스 주식 상세 조회 합니다',
    tags=['주식_코넥스'],
    responses={status.HTTP_200_OK: InfoKonexSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def info_konex_detail(request, code_number):
    info_konex = get_object_or_404(InfoKonex, pk=code_number)
    serializer = InfoKonexSerializer(info_konex)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='코넥스 주식 재무제표 상세 조회(아무나)',
    operation_description='코넥스 주식 재무제표를 상세 조회 합니다',
    tags=['주식_코넥스'],
    responses={status.HTTP_200_OK: FinancialKonexSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def financial_konex_detail(request, code_number):
    financial_konex = get_object_or_404(FinancialKonex, pk=code_number)
    serializer = FinancialKonexSerializer(financial_konex)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

