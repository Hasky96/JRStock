from django.shortcuts import get_object_or_404
from numpy import where

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import FinancialKonexSerializer, FinancialKosdaqSerializer, FinancialKospiSerializer, InfoKonexSerializer, InfoKosdaqSerializer, InfoKospiSerializer, KonexCustomSerializer, KosdaqCustomSerializer, KospiCustomSerializer

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
company_name = openapi.Parameter('company_name', openapi.IN_QUERY, default="삼성",
                        description="검색할 회사 이름", type=openapi.TYPE_STRING)
face_value = openapi.Parameter('face_value', openapi.IN_QUERY, default="0-5000",
                        description="액면가 0이상 5000이하", type=openapi.TYPE_STRING)

@swagger_auto_schema(
    method='get',
    operation_id='코스피 주식 종목 전체 조회(아무나)',
    operation_description='코스피 주식 종목 전체를 조회 합니다',
    tags=['주식_코스피'],
    manual_parameters=[page, size, sort, company_name, face_value],
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
    
    # 정렬을 원한다면
    if not sort == None:
        if sort.startswith('-'):
            sort = sort[1:]
            kospi_list = FinancialKospi.objects.all().order_by(f"-info_kospi__{sort}")
        else:
            kospi_list = FinancialKospi.objects.all().order_by(f"info_kospi__{sort}")
    else:
        kospi_list = FinancialKospi.objects.all()
        
    
    # 검색 기능
    if request.GET.get('company_name'):
        value = request.GET.get('company_name')
        kospi_list = kospi_list.filter(info_kospi__company_name__contains=value)
        
    if request.GET.get('code_number'):
        value = request.GET.get('code_number')
        kospi_list = kospi_list.filter(info_kospi__code_number__contains=value)
    
    # 필터링
    columns = ['face_value', 'capital_stock', 'number_of_listings', 'credit_rate', 'year_high_price', 'year_low_price', 
                    'market_cap', 'foreigner_percent', 'substitute_price', 'per', 'eps', 'roe', 'pbr', 'ev', 'bps', 'sales_revenue',
                    'operating_income', 'net_income', 'shares_outstanding', 'shares_outstanding_rate']
    for column in columns:
        if request.GET.get(column):
            value = request.GET.get(column)
            value = value.split('-')
            query = f"{column} BETWEEN {value[0]} AND {value[1]}"
            kospi_list = kospi_list.extra(where={query})
            
    paginator = PageNumberPagination()

    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size

    result = paginator.paginate_queryset(kospi_list, request)
    serializers = KospiCustomSerializer(result, many=True)
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

# ====================================================================== 통합 ======================================================================

@swagger_auto_schema(
    method='post',
    operation_id='주식 유저 선택별 종목',
    operation_description='주식 유저가 선택한 항목의 종목',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'face_value': openapi.Schema(type=openapi.TYPE_STRING, description="액면가", default=">4000"),
            'capital_stock': openapi.Schema(type=openapi.TYPE_STRING, description="자본금", default="<5000"),
            'number_of_listings': openapi.Schema(type=openapi.TYPE_STRING, description="상장주식수", default="=300"),
        }
    ),
    tags=['주식'],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'kospi' : get_serializer("info", "코스피 종목 추천"),
                'kosdaq' : get_serializer("info", "코스닥 종목 추천"),
                'konex' : get_serializer("info", "코넥스 종목 추천"),
            }
        )
    )}
)
@api_view(['POST'])
@permission_classes([AllowAny])
def get_custom_stock(request):
    financial_kospi = FinancialKospi.objects.all().order_by("info_kospi__location")
    financial_kosdaq = FinancialKosdaq.objects.all()
    financial_konex = FinancialKonex.objects.all()
    columns = ['face_value', 'capital_stock', 'number_of_listings', 'credit_rate', 'year_high_price', 'year_low_price', 
                    'market_cap', 'foreigner_percent', 'substitute_price', 'per', 'eps', 'roe', 'pbr', 'ev', 'bps', 'sales_revenue',
                    'operating_income', 'net_income', 'shares_outstanding', 'shares_outstanding_rate']
    for column in columns:
        if request.data.get(column):
            value = request.data.get(column)
            query = f"{column}{value}"
            financial_kospi = financial_kospi.extra(where={query})
            financial_kosdaq = financial_kosdaq.extra(where={query})
            financial_konex = financial_konex.extra(where={query})
    
    serializer_kospi = KospiCustomSerializer(financial_kospi, many=True)
    serializer_kosdaq = KosdaqCustomSerializer(financial_kosdaq, many=True)
    serializer_konex = KonexCustomSerializer(financial_konex, many=True)
    
    return Response({"kospi" : serializer_kospi.data,
                    "kosdaq" : serializer_kosdaq.data,
                    "konex" : serializer_konex.data}, status=status.HTTP_200_OK)

