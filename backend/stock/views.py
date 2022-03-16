from django.shortcuts import get_object_or_404
from numpy import where

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import DayStockInfoSerializer, FinancialInfoSerializer

from .models import BasicInfo, DayStockInfo, FinancialInfo

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .parser import get_serializer

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

# ====================================================================== 통합 ======================================================================
@swagger_auto_schema(
    method='get',
    operation_id='주식 종목 전체 조회(아무나)',
    operation_description='주식 종목 전체를 조회 합니다(기본정보 + 재무제표 + 최근 주가)',
    tags=['주식'],
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
def basic_info_list(request):
    stock_list = DayStockInfo.objects.select_related('financial_info').filter(date='2022-03-10')
    
    # 검색 기능
    if request.GET.get('company_name'):
        value = request.GET.get('company_name')
        stock_list = stock_list.filter(financial_info__basic_info__company_name__contains=value)
        
    if request.GET.get('code_number'):
        value = request.GET.get('code_number')
        stock_list = stock_list.filter(financial_info__basic_info__code_number__contains=value)
    
    # 필터링
    if request.GET.get('face_value'):
        value = request.GET.get('face_value')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__face_value__gte=value[0], financial_info__face_value__lte=value[1])
        
    if request.GET.get('capital_stock'):
        value = request.GET.get('capital_stock')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__capital_stock__gte=value[0], financial_info__capital_stock__lte=value[1])
        
    if request.GET.get('number_of_listings'):
        value = request.GET.get('number_of_listings')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__number_of_listings__gte=value[0], financial_info__number_of_listings__lte=value[1])
        
    if request.GET.get('credit_rate'):
        value = request.GET.get('credit_rate')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__credit_rate__gte=value[0], financial_info__credit_rate__lte=value[1])
        
    if request.GET.get('year_high_price'):
        value = request.GET.get('year_high_price')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__year_high_price__gte=value[0], financial_info__year_high_price__lte=value[1])
        
    if request.GET.get('year_low_price'):
        value = request.GET.get('year_low_price')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__year_low_price__gte=value[0], financial_info__year_low_price__lte=value[1])    
    
    if request.GET.get('market_cap'):
        value = request.GET.get('market_cap')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__market_cap__gte=value[0], financial_info__market_cap__lte=value[1])    
        
    if request.GET.get('foreigner_percent'):
        value = request.GET.get('foreigner_percent')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__foreigner_percent__gte=value[0], financial_info__foreigner_percent__lte=value[1])    
        
    if request.GET.get('substitute_price'):
        value = request.GET.get('substitute_price')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__substitute_price__gte=value[0], financial_info__substitute_price__lte=value[1])    
        
    if request.GET.get('per'):
        value = request.GET.get('per')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__per__gte=value[0], financial_info__per__lte=value[1])    
        
    if request.GET.get('eps'):
        value = request.GET.get('eps')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__eps__gte=value[0], financial_info__eps__lte=value[1])                    
    
    if request.GET.get('roe'):
        value = request.GET.get('roe')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__roe__gte=value[0], financial_info__roe__lte=value[1])  
        
    if request.GET.get('pbr'):
        value = request.GET.get('pbr')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__pbr__gte=value[0], financial_info__pbr__lte=value[1])  
        
    if request.GET.get('ev'):
        value = request.GET.get('ev')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__ev__gte=value[0], financial_info__ev__lte=value[1])  
        
    if request.GET.get('bps'):
        value = request.GET.get('bps')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__bps__gte=value[0], financial_info__bps__lte=value[1])  
        
    if request.GET.get('sales_revenue'):
        value = request.GET.get('sales_revenue')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__sales_revenue__gte=value[0], financial_info__sales_revenue__lte=value[1])                  
    
    
    if request.GET.get('operating_income'):
        value = request.GET.get('operating_income')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__operating_income__gte=value[0], financial_info__operating_income__lte=value[1])                  
        
    if request.GET.get('net_income'):
        value = request.GET.get('net_income')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__net_income__gte=value[0], financial_info__net_income__lte=value[1])                  
        
    if request.GET.get('shares_outstanding'):
        value = request.GET.get('shares_outstanding')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__shares_outstanding__gte=value[0], financial_info__shares_outstanding__lte=value[1])                  
        
    if request.GET.get('shares_outstanding_rate'):
        value = request.GET.get('shares_outstanding_rate')
        value = value.split('-')
        stock_list = stock_list.filter(financial_info__shares_outstanding_rate__gte=value[0], financial_info__shares_outstanding_rate__lte=value[1])                                  
    # 필터링
    # columns = ['face_value', 'capital_stock', 'number_of_listings', 'credit_rate', 'year_high_price', 'year_low_price', 
    #                 'market_cap', 'foreigner_percent', 'substitute_price', 'per', 'eps', 'roe', 'pbr', 'ev', 'bps', 'sales_revenue',
    #                 'operating_income', 'net_income', 'shares_outstanding', 'shares_outstanding_rate']
    # for column in columns:
    #     if request.GET.get(column):
    #         print("=====================================")
    #         value = request.GET.get(column)
    #         value = value.split('-')
    #         query = f"`stock_financialinfo`.`{column}` BETWEEN {value[0]} AND {value[1]}"
    #         stock_list = stock_list.extra(where={query})
    #         print(stock_list.query)
    
    paginator = PageNumberPagination()

    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size

    result = paginator.paginate_queryset(stock_list, request)
    serializers = DayStockInfoSerializer(result, many=True)
    return paginator.get_paginated_response(serializers.data)    

@swagger_auto_schema(
    method='get',
    operation_id='주식 상세 조회(아무나)',
    operation_description='주식 상세 조회 합니다(재무제표 + 기본정보)',
    tags=['주식'],
    responses={status.HTTP_200_OK: FinancialInfoSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def financial_info_detail(request, code_number):
    financial_info = get_object_or_404(FinancialInfo, pk=code_number)
    serializer = FinancialInfoSerializer(financial_info)
    
    return Response(serializer.data, status=status.HTTP_200_OK)
# ====================================================================== 코스피 ======================================================================



# @swagger_auto_schema(
#     method='get',
#     operation_id='코스피 주식 종목 전체 조회(아무나)',
#     operation_description='코스피 주식 종목 전체를 조회 합니다',
#     tags=['주식_코스피'],
#     manual_parameters=[page, size, sort, company_name, face_value],
#     responses={status.HTTP_200_OK: openapi.Response(
#         description="200 OK",
#         schema=openapi.Schema(
#             type=openapi.TYPE_OBJECT,
#             properties={
#                 'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 종목 수"),
#                 'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
#                 'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
#                 'results' : get_serializer("info", "종목 정보"),
#             }
#         )
#     )}
# )
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def info_kospi_list(request):
#     sort = request.GET.get('sort')
    
#     # 정렬을 원한다면
#     if not sort == None:
#         if sort.startswith('-'):
#             sort = sort[1:]
#             kospi_list = FinancialKospi.objects.all().order_by(f"-info_kospi__{sort}")
#         else:
#             kospi_list = FinancialKospi.objects.all().order_by(f"info_kospi__{sort}")
#     else:
#         kospi_list = FinancialKospi.objects.all()
        
    
#     # 검색 기능
#     if request.GET.get('company_name'):
#         value = request.GET.get('company_name')
#         kospi_list = kospi_list.filter(info_kospi__company_name__contains=value)
        
#     if request.GET.get('code_number'):
#         value = request.GET.get('code_number')
#         kospi_list = kospi_list.filter(info_kospi__code_number__contains=value)
    
#     # 필터링
#     columns = ['face_value', 'capital_stock', 'number_of_listings', 'credit_rate', 'year_high_price', 'year_low_price', 
#                     'market_cap', 'foreigner_percent', 'substitute_price', 'per', 'eps', 'roe', 'pbr', 'ev', 'bps', 'sales_revenue',
#                     'operating_income', 'net_income', 'shares_outstanding', 'shares_outstanding_rate']
#     for column in columns:
#         if request.GET.get(column):
#             value = request.GET.get(column)
#             value = value.split('-')
#             query = f"{column} BETWEEN {value[0]} AND {value[1]}"
#             kospi_list = kospi_list.extra(where={query})
            
#     paginator = PageNumberPagination()

#     page_size = request.GET.get('size')
#     if not page_size == None:
#         paginator.page_size = page_size

#     result = paginator.paginate_queryset(kospi_list, request)
#     serializers = KospiCustomSerializer(result, many=True)
#     return paginator.get_paginated_response(serializers.data)

# @swagger_auto_schema(
#     method='get',
#     operation_id='코스피 주식 상세 조회(아무나)',
#     operation_description='코스피 주식 상세 조회 합니다',
#     tags=['주식_코스피'],
#     responses={status.HTTP_200_OK: InfoKospiSerializer},
# )
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def info_kospi_detail(request, code_number):
#     info_kospi = get_object_or_404(InfoKospi, pk=code_number)
#     serializer = InfoKospiSerializer(info_kospi)
    
#     return Response(serializer.data, status=status.HTTP_200_OK)

# @swagger_auto_schema(
#     method='get',
#     operation_id='코스피 주식 재무제표 상세 조회(아무나)',
#     operation_description='코스피 주식 재무제표를 상세 조회 합니다',
#     tags=['주식_코스피'],
#     responses={status.HTTP_200_OK: FinancialKospiSerializer},
# )
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def financial_kospi_detail(request, code_number):
#     financial_kospi = get_object_or_404(FinancialKospi, pk=code_number)
#     serializer = FinancialKospiSerializer(financial_kospi)
    
#     return Response(serializer.data, status=status.HTTP_200_OK)