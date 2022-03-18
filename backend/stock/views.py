from datetime import datetime
from django.http import QueryDict
from django.shortcuts import get_object_or_404
from numpy import where

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import BasicInfoSerializer, DayStockInfoSerializer, DayStockSerializer, FinancialInfoSerializer, InterestSerializer

from .models import BasicInfo, DayStock, DayStockInfo, FinancialInfo, Interest

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .parser import get_serializer

import requests
from bs4 import BeautifulSoup

from django.core import serializers

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

@swagger_auto_schema(
    method='get',
    operation_id='종목별 일봉 데이터 전체 조회(아무나)',
    operation_description='일봉 데이터 전체 정보를 가져옵니다',
    tags=['주식'],
    responses={status.HTTP_200_OK: DayStockSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def day_stock_list(request, code_number):
    day_stock_list = DayStock.objects.filter(code_number=code_number)
    serializer = DayStockSerializer(day_stock_list, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='종목별 주봉 데이터 전체 조회(아무나)',
    operation_description='주봉 데이터 전체 정보를 가져옵니다',
    tags=['주식'],
    responses={status.HTTP_200_OK: DayStockSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def week_stock_list(reqeust, code_number):
    day_stock_list = DayStock.objects.filter(code_number=code_number)
    day_stock_list = list(day_stock_list)
    
    for day_stock in day_stock_list[:]:
        datetime_date = datetime.strptime(day_stock.date, '%Y-%m-%d')
        if datetime_date.weekday() != 0: # 월요일이 아닐 때
            day_stock_list.remove(day_stock)
    
    serializer = DayStockSerializer(day_stock_list, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='종목별 월봉 데이터 전체 조회(아무나)',
    operation_description='월봉 데이터 전체 정보를 가져옵니다',
    tags=['주식'],
    responses={status.HTTP_200_OK: DayStockSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def month_stock_list(reqeust, code_number):
    day_stock_list = DayStock.objects.filter(code_number=code_number)
    day_stock_list = list(day_stock_list)
    
    prev_month = None
    
    for day_stock in day_stock_list[:]:
        datetime_date = datetime.strptime(day_stock.date, '%Y-%m-%d')
        if prev_month == None:
            prev_month = datetime_date.month
            continue
        
        if prev_month != datetime_date.month:
            prev_month = datetime_date.month
            continue
        
        day_stock_list.remove(day_stock)
    
    serializer = DayStockSerializer(day_stock_list, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='종목별 실시간 데이터 조회(아무나)',
    operation_description='요청한 종목의 실시간 데이터를 조회합니다',
    tags=['주식'],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'time': openapi.Schema(type=openapi.TYPE_STRING, description="조회 기준 시간"),
                'current_price': openapi.Schema(type=openapi.TYPE_STRING, description="현재가"),
                'changes': openapi.Schema(type=openapi.TYPE_STRING, description="변동 가격"),
                'changes_ratio': openapi.Schema(type=openapi.TYPE_STRING, description="변동 퍼센트"),
                'prev': openapi.Schema(type=openapi.TYPE_STRING, description="전일가"),
                'open': openapi.Schema(type=openapi.TYPE_STRING, description="시가"),
                'high': openapi.Schema(type=openapi.TYPE_STRING, description="고가"),
                'low': openapi.Schema(type=openapi.TYPE_STRING, description="저가"),
                'upper_limit': openapi.Schema(type=openapi.TYPE_STRING, description="상한가"),
                'lower_limit': openapi.Schema(type=openapi.TYPE_STRING, description="하한가"),
                'volume': openapi.Schema(type=openapi.TYPE_STRING, description="거래량"),
                'volume_price': openapi.Schema(type=openapi.TYPE_STRING, description="거래 대금"),
            }
        )
    )}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def live_data(request, code_number):
    url = f"https://finance.naver.com/item/main.nhn?code={code_number}"   #삼성전자 종목코드를 포함하는 url

    response = requests.get(url)

    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        temp = soup.dl.text.split()
        current_time = temp[3] + " " + temp[4] + " " + temp[5] + " " + temp[6] + " " + temp[7]
        current_price = temp[16]
        if temp[18] == '상승':
            changes = "+" + temp[19]
        if temp[18] == '하락':
            changes = "-" + temp[19]
        if temp[20] == '플러스':
            changes_ratio = "+" + temp[21] + "%"
        if temp[20] == '마이너스':
            changes_ratio = "-" + temp[21] + "%"
        prev = temp[24]
        open = temp[26]
        high = temp[28]
        low = temp[32]
        upper_limit = temp[30]
        lower_limit = temp[34]
        volume = temp[36]
        volume_price = temp[38]
        
        return Response({'time' : current_time,
                        'current_price' : current_price,
                        'changes' : changes,
                        'changes_ratio' : changes_ratio,
                        'prev' : prev,
                        'open' : open,
                        'high' : high,
                        'low' : low,
                        'upper_limit' : upper_limit,
                        'lower_limit' : lower_limit,
                        'volume' : volume,
                        'volume_price' : volume_price,
                        }, status=status.HTTP_200_OK)
        
    return Response({"message" : "Connection Error"}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='post',
    operation_id='관심종목 등록(유저)',
    operation_description='종목코드를 이용해 관심종목을 등록합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'code_number': openapi.Schema(type=openapi.TYPE_STRING, description="종목 코드"),
        }
    ),
    tags=['주식_관심종목'],
    responses={status.HTTP_201_CREATED: openapi.Response(
        description="HTTP_201_CREATED",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'duplicate': openapi.Schema(type=openapi.TYPE_INTEGER, default=True, description="중복되어 등록되지 않은 종목 수"),
            }
        )
    )}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def interest_stock_create(request):
    # 체크박스를 리스트 형식으로 받아와서 저장
    code_numbers = request.data.getlist('code_number')
    
    duplicate_list = []
    
    # 중복확인
    for code_number in code_numbers:
        interest = Interest.objects.filter(basic_info_id=code_number)
        
        if interest.count() == 0:
            serializer = InterestSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save(user=request.user, basic_info_id=code_number)
        else:
            duplicate_list.append(code_number)            
    
    return Response({'duplicate': len(duplicate_list)},status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='get',
    operation_id='주식 관심 종목 조회(유저)',
    operation_description='주식 관심 종목 전체를 조회 합니다(기본정보 + 재무제표 + 최근 주가)',
    tags=['주식_관심종목'],
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
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def interest_stock_list(request):    
    # 해당하는 유저의 관심종목 전체를 불러옴
    interest_list = Interest.objects.filter(user=request.user)
    
    # 비어있는 쿼리셋 만들기
    stock_list = DayStockInfo.objects.none()
    
    # 관심종목의 상세 정보를 불러와서 합침
    for interest in interest_list:
        stock = DayStockInfo.objects.filter(financial_info_id=interest.basic_info_id, date='2022-03-10')
        stock_list = stock_list | stock

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
    
    paginator = PageNumberPagination()

    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size

    result = paginator.paginate_queryset(stock_list, request)
    serializers = DayStockInfoSerializer(result, many=True)
    return paginator.get_paginated_response(serializers.data)        

@swagger_auto_schema(
    method='post',
    operation_id='관심종목 제거(유저)',
    operation_description='종목코드를 이용해 관심종목을 제거합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'code_number': openapi.Schema(type=openapi.TYPE_STRING, description="종목 코드"),
        }
    ),
    tags=['주식_관심종목'],
    responses={status.HTTP_200_OK: ""}
)    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def interset_stock_delete(request):
    # 체크박스를 리스트 형식으로 받아와서 저장
    code_numbers = request.data.getlist('code_number')
    
    # DB에 있는 값이면 제거 아니면 오류
    for code_number in code_numbers:
        interest = Interest.objects.filter(basic_info_id=code_number, user=request.user)
        if interest.count() == 1:
            interest.delete()
    
    return Response(status=status.HTTP_200_OK)
    
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