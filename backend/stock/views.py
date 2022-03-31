from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from django.db.models.functions import Cast
from django.db.models import IntegerField

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import BasicInfoSerializer, DayStockInfoSerializer, DayStockSerializer, FinancialInfoSerializer, InterestSerializer, MonthStockSerializer, PredictSerializer, WeekStockSerializer

from .models import BasicInfo, DayStock, DayStockInfo, FinancialInfo, Interest, MonthStock, Predict, WeekStock

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .parser import get_serializer

import requests
from bs4 import BeautifulSoup
import re

from django.db.models import Max, Min


page = openapi.Parameter('page', openapi.IN_QUERY, default=1,
                        description="페이지 번호", type=openapi.TYPE_INTEGER)
size = openapi.Parameter('size', openapi.IN_QUERY, default=5,
                        description="한 페이지에 표시할 객체 수", type=openapi.TYPE_INTEGER)
sort = openapi.Parameter('sort', openapi.IN_QUERY, default="id",
                        description="정렬할 기준 Column, 'id'면 오름차순 '-id'면 내림차순", type=openapi.TYPE_STRING)
company_name = openapi.Parameter('company_name', openapi.IN_QUERY, default="삼성",
                        description="검색할 회사 이름", type=openapi.TYPE_STRING)
face_value = openapi.Parameter('face_value', openapi.IN_QUERY, default="-1000_5000",
                        description="액면가 0이상 5000이하", type=openapi.TYPE_STRING)
start = openapi.Parameter('start', openapi.IN_QUERY, default='2015-02-12',
                        description="시작 날짜", type=openapi.TYPE_STRING)
end = openapi.Parameter('end', openapi.IN_QUERY, default='2016-03-03',
                        description="종료 날짜", type=openapi.TYPE_STRING)

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
    # 어제 날짜에 해당하는 데이터 가져오기
    yesterday = datetime.now() - timedelta(days=1)
    
    # 0 월요일, 6 일요일
    # 어제가 일요일이거나 토요일일 때 금요일 데이터를 가져오게끔 변경
    if yesterday.weekday() == 6:
        yesterday = yesterday - timedelta(days=2)
    if yesterday.weekday() == 5:
        yesterday = yesterday - timedelta(days=1)
    
    yesterday = yesterday.strftime('%Y-%m-%d')
    
    stock_list = DayStockInfo.objects.select_related('financial_info').filter(date=yesterday)
    
    # 코스피 코스닥 제외
    stock_list = stock_list.exclude(financial_info__basic_info__code_number='kospi')
    stock_list = stock_list.exclude(financial_info__basic_info__code_number='kosdaq')
    
    sort = request.GET.get('sort')
    
    if not sort == None:
        if sort[:1] == '-':
            sort = sort[1:]
            stock_list = stock_list.annotate(order_column=Cast(sort, IntegerField())).order_by('-order_column', sort)
        else:
            stock_list = stock_list.annotate(order_column=Cast(sort, IntegerField())).order_by('order_column', sort)
    
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
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__face_value__gte=value[0], financial_info__face_value__lte=value[1])
        
    if request.GET.get('capital_stock'):
        value = request.GET.get('capital_stock')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__capital_stock__gte=value[0], financial_info__capital_stock__lte=value[1])
        
    if request.GET.get('number_of_listings'):
        value = request.GET.get('number_of_listings')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__number_of_listings__gte=value[0], financial_info__number_of_listings__lte=value[1])
        
    if request.GET.get('credit_rate'):
        value = request.GET.get('credit_rate')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__credit_rate__gte=value[0], financial_info__credit_rate__lte=value[1])
        
    if request.GET.get('year_high_price'):
        value = request.GET.get('year_high_price')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__year_high_price__gte=value[0], financial_info__year_high_price__lte=value[1])
        
    if request.GET.get('year_low_price'):
        value = request.GET.get('year_low_price')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__year_low_price__gte=value[0], financial_info__year_low_price__lte=value[1])    
    
    if request.GET.get('market_cap'):
        value = request.GET.get('market_cap')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__market_cap__gte=value[0], financial_info__market_cap__lte=value[1])    
        
    if request.GET.get('foreigner_percent'):
        value = request.GET.get('foreigner_percent')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__foreigner_percent__gte=value[0], financial_info__foreigner_percent__lte=value[1])    
        
    if request.GET.get('substitute_price'):
        value = request.GET.get('substitute_price')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__substitute_price__gte=value[0], financial_info__substitute_price__lte=value[1])    
        
    if request.GET.get('per'):
        value = request.GET.get('per')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__per__gte=value[0], financial_info__per__lte=value[1])    
        
    if request.GET.get('eps'):
        value = request.GET.get('eps')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__eps__gte=value[0], financial_info__eps__lte=value[1])                    
    
    if request.GET.get('roe'):
        value = request.GET.get('roe')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__roe__gte=value[0], financial_info__roe__lte=value[1])  
        
    if request.GET.get('pbr'):
        value = request.GET.get('pbr')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__pbr__gte=value[0], financial_info__pbr__lte=value[1])  
        
    if request.GET.get('ev'):
        value = request.GET.get('ev')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__ev__gte=value[0], financial_info__ev__lte=value[1])  
        
    if request.GET.get('bps'):
        value = request.GET.get('bps')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__bps__gte=value[0], financial_info__bps__lte=value[1])  
        
    if request.GET.get('sales_revenue'):
        value = request.GET.get('sales_revenue')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__sales_revenue__gte=value[0], financial_info__sales_revenue__lte=value[1])                  
    
    
    if request.GET.get('operating_income'):
        value = request.GET.get('operating_income')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__operating_income__gte=value[0], financial_info__operating_income__lte=value[1])                  
        
    if request.GET.get('net_income'):
        value = request.GET.get('net_income')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__net_income__gte=value[0], financial_info__net_income__lte=value[1])                  
        
    if request.GET.get('shares_outstanding'):
        value = request.GET.get('shares_outstanding')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__shares_outstanding__gte=value[0], financial_info__shares_outstanding__lte=value[1])                  
        
    if request.GET.get('shares_outstanding_rate'):
        value = request.GET.get('shares_outstanding_rate')
        value = value.split('_')
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
    serializer = DayStockInfoSerializer(result, many=True)
    return paginator.get_paginated_response(serializer.data)    

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
    week_stock_list = WeekStock.objects.filter(code_number=code_number)
    serializer = WeekStockSerializer(week_stock_list, many=True)
    
    # ========== 전체 날짜에서 월요일만 뽑아내는 방법 ==========
    # day_stock_list = DayStock.objects.filter(code_number=code_number)
    # day_stock_list = list(day_stock_list)
    
    # for day_stock in day_stock_list[:]:
    #     datetime_date = datetime.strptime(day_stock.date, '%Y-%m-%d')
    #     if datetime_date.weekday() != 0: # 월요일이 아닐 때
    #         day_stock_list.remove(day_stock)
    # serializer = DayStockSerializer(day_stock_list, many=True)

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
    month_stock_list = MonthStock.objects.filter(code_number=code_number)
    serializer = MonthStockSerializer(month_stock_list, many=True)
    
    # ========== 전체 날짜에서 매월 첫째날 뽑아내는 방법 ==========
    # day_stock_list = DayStock.objects.filter(code_number=code_number)
    # day_stock_list = list(day_stock_list)
    
    # prev_month = None
    
    # for day_stock in day_stock_list[:]:
    #     datetime_date = datetime.strptime(day_stock.date, '%Y-%m-%d')
    #     if prev_month == None:
    #         prev_month = datetime_date.month
    #         continue
        
    #     if prev_month != datetime_date.month:
    #         prev_month = datetime_date.month
    #         continue
        
    #     day_stock_list.remove(day_stock)
    
    # serializer = DayStockSerializer(day_stock_list, many=True)

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
    code_numbers = request.data.get('code_number')
    print(code_numbers)
    duplicate_list = []
    
    # 중복확인
    for code_number in code_numbers:
        interest = Interest.objects.filter(user=request.user, basic_info_id=code_number)
        
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
    
    # 어제 날짜에 해당하는 데이터 가져오기
    yesterday = datetime.now() - timedelta(days=1)
    
    # 0 월요일, 6 일요일
    # 어제가 일요일이거나 토요일일 때 금요일 데이터를 가져오게끔 변경
    if yesterday.weekday() == 6:
        yesterday = yesterday - timedelta(days=2)
    if yesterday.weekday() == 5:
        yesterday = yesterday - timedelta(days=1)
    
    yesterday = yesterday.strftime('%Y-%m-%d')
    
    # 관심종목의 상세 정보를 불러와서 합침
    for interest in interest_list:
        stock = DayStockInfo.objects.filter(financial_info_id=interest.basic_info_id, date=yesterday)
        stock_list = stock_list | stock
        
    sort = request.GET.get('sort')
    
    if not sort == None:
        if sort[:1] == '-':
            sort = sort[1:]
            stock_list = stock_list.annotate(order_column=Cast(sort, IntegerField())).order_by('-order_column', sort)
        else:
            stock_list = stock_list.annotate(order_column=Cast(sort, IntegerField())).order_by('order_column', sort)

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
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__face_value__gte=value[0], financial_info__face_value__lte=value[1])
        
    if request.GET.get('capital_stock'):
        value = request.GET.get('capital_stock')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__capital_stock__gte=value[0], financial_info__capital_stock__lte=value[1])
        
    if request.GET.get('number_of_listings'):
        value = request.GET.get('number_of_listings')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__number_of_listings__gte=value[0], financial_info__number_of_listings__lte=value[1])
        
    if request.GET.get('credit_rate'):
        value = request.GET.get('credit_rate')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__credit_rate__gte=value[0], financial_info__credit_rate__lte=value[1])
        
    if request.GET.get('year_high_price'):
        value = request.GET.get('year_high_price')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__year_high_price__gte=value[0], financial_info__year_high_price__lte=value[1])
        
    if request.GET.get('year_low_price'):
        value = request.GET.get('year_low_price')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__year_low_price__gte=value[0], financial_info__year_low_price__lte=value[1])    
    
    if request.GET.get('market_cap'):
        value = request.GET.get('market_cap')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__market_cap__gte=value[0], financial_info__market_cap__lte=value[1])    
        
    if request.GET.get('foreigner_percent'):
        value = request.GET.get('foreigner_percent')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__foreigner_percent__gte=value[0], financial_info__foreigner_percent__lte=value[1])    
        
    if request.GET.get('substitute_price'):
        value = request.GET.get('substitute_price')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__substitute_price__gte=value[0], financial_info__substitute_price__lte=value[1])    
        
    if request.GET.get('per'):
        value = request.GET.get('per')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__per__gte=value[0], financial_info__per__lte=value[1])    
        
    if request.GET.get('eps'):
        value = request.GET.get('eps')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__eps__gte=value[0], financial_info__eps__lte=value[1])                    
    
    if request.GET.get('roe'):
        value = request.GET.get('roe')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__roe__gte=value[0], financial_info__roe__lte=value[1])  
        
    if request.GET.get('pbr'):
        value = request.GET.get('pbr')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__pbr__gte=value[0], financial_info__pbr__lte=value[1])  
        
    if request.GET.get('ev'):
        value = request.GET.get('ev')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__ev__gte=value[0], financial_info__ev__lte=value[1])  
        
    if request.GET.get('bps'):
        value = request.GET.get('bps')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__bps__gte=value[0], financial_info__bps__lte=value[1])  
        
    if request.GET.get('sales_revenue'):
        value = request.GET.get('sales_revenue')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__sales_revenue__gte=value[0], financial_info__sales_revenue__lte=value[1])                  
    
    
    if request.GET.get('operating_income'):
        value = request.GET.get('operating_income')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__operating_income__gte=value[0], financial_info__operating_income__lte=value[1])                  
        
    if request.GET.get('net_income'):
        value = request.GET.get('net_income')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__net_income__gte=value[0], financial_info__net_income__lte=value[1])                  
        
    if request.GET.get('shares_outstanding'):
        value = request.GET.get('shares_outstanding')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__shares_outstanding__gte=value[0], financial_info__shares_outstanding__lte=value[1])                  
        
    if request.GET.get('shares_outstanding_rate'):
        value = request.GET.get('shares_outstanding_rate')
        value = value.split('_')
        stock_list = stock_list.filter(financial_info__shares_outstanding_rate__gte=value[0], financial_info__shares_outstanding_rate__lte=value[1])                                  
    
    paginator = PageNumberPagination()

    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size

    result = paginator.paginate_queryset(stock_list, request)
    serializer = DayStockInfoSerializer(result, many=True)
    return paginator.get_paginated_response(serializer.data)        

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
    code_numbers = request.data.get('code_number')
    
    # DB에 있는 값이면 제거 아니면 오류
    for code_number in code_numbers:
        interest = Interest.objects.filter(basic_info_id=code_number, user=request.user)
        if interest.count() == 1:
            interest.delete()
    
    return Response(status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='종목별 최신 뉴스 조회(아무나)',
    operation_description='요청한 종목의 최신 뉴스를 조회합니다',
    tags=['주식_뉴스'],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'date': openapi.Schema(type=openapi.TYPE_STRING, description="날짜"),
                'title': openapi.Schema(type=openapi.TYPE_STRING, description="뉴스 제목"),
                'source': openapi.Schema(type=openapi.TYPE_STRING, description="뉴스 출처"),
                'link': openapi.Schema(type=openapi.TYPE_STRING, description="뉴스 기사 주소"),
            }
        )
    )}
)    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_recent_news(reqeust, code_number):
    news_list = []
    
    if (code_number == 'KOSPI' or code_number == 'KOSDAQ'):
        url = 'https://finance.naver.com/sise/sise_index.naver?code=' + code_number
        source_code = requests.get(url).text
        html = BeautifulSoup(source_code, "lxml")
        
        news_href = html.select('#contentarea_left > div:nth-child(4) > ul > li > span > a')
        news_info1 = html.select('#contentarea_left > div:nth-child(4) > ul > li > p > .paper')
        news_info2 = html.select('#contentarea_left > div:nth-child(4) > ul > li > p > .date')
        
        for i in range(len(news_href)):
            date = news_info2[i].text
            title = news_href[i].text
            source = news_info1[i].text
            link = "https://finance.naver.com"+news_href[i]['href']
            
            result = {'date' : date, 'title' : title, 'source' : source, 'link' : link}
            news_list.append(result)
            
        return Response(news_list, status=status.HTTP_200_OK)
    
    url = 'https://finance.naver.com/item/news_news.nhn?code=' + str(code_number) + '&page=1' 
    source_code = requests.get(url).text
    html = BeautifulSoup(source_code, "lxml")

    title_data = html.select('.title')
    dates = html.select('.date')
    sources = html.select('.info')
    
    for idx in range(0, len(title_data)):        
        # 제목
        title = title_data[idx].get_text() 
        title = re.sub('\n','',title)
        
        # 링크
        link = 'https://finance.naver.com' + title_data[idx].find('a')['href']
        
        # 날짜
        date = dates[idx].get_text()
        
        # 출처
        source = sources[idx].get_text()
        
        result = {'date' : date, 'title' : title, 'source' : source, 'link' : link}
        news_list.append(result)

    return Response(news_list, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='해당종목 시작, 끝 날짜(모두)',
    operation_description='해당 종목의 시작과 끝 날짜를 조회합니다',
    tags=['주식_백테스트'],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'start_date': openapi.Schema(type=openapi.TYPE_STRING, description="데이터 시작 날짜"),
                'end_date': openapi.Schema(type=openapi.TYPE_STRING, description="데이터 종료 날짜"),
            }
        )
    )}
)  
@api_view(['GET'])
@permission_classes([AllowAny])
def get_start_end_date(request, code_number):
    stock_list = DayStock.objects.filter(code_number=code_number)
    start_date = stock_list.aggregate(Min('date'))['date__min']
    end_date = stock_list.aggregate(Max('date'))['date__max']
    
    return Response({'start_date' : start_date,
                    'end_date' : end_date}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='오늘 종가 예측 데이터(모두)',
    operation_description='해당 종목의 종가를 예측한 데이터를 조회합니다',
    tags=['주식'],
    responses={status.HTTP_200_OK: PredictSerializer}
)      
@api_view(['GET'])
@permission_classes([AllowAny])
def get_predict_data(request, code_number):
    today = datetime.now()
    
    # 0 월요일, 6 일요일
    # 오늘이 일요일이거나 토요일일 때는 날짜만 리턴
    if today.weekday() == 5 or today.weekday() == 6:
        return Response({'date' : today.strftime('%Y-%m-%d')}, status=status.HTTP_200_OK)
    
    today = today.strftime('%Y-%m-%d')
    
    financial_info = get_object_or_404(FinancialInfo, pk=code_number)
    predict = Predict.objects.get(date=today, financial_info=financial_info)
    serializer = PredictSerializer(predict)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='해당 종목의 시작날짜와 종료날짜의 데이터를 조회(모두)',
    operation_description='해당 종목의 시작날짜와 종료날짜의 데이터를 조회합니다',
    tags=['주식_백테스트'],
    responses={status.HTTP_200_OK: DayStockSerializer}
)  
@api_view(['GET'])
@permission_classes([AllowAny])
def get_stock_data_with_startend(request, code_number):
    start_date = request.GET.get('start')
    end_date = request.GET.get('end')
    
    day_stock_list = DayStock.objects.filter(code_number=code_number).filter(date__gte=start_date).filter(date__lte=end_date)
    serializer = DayStockSerializer(day_stock_list, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)