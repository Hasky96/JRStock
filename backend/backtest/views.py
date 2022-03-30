from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import BuySell, ConditionInfo, DayHistory, Result, YearHistory
from .serializers import BuySellSerializer, ConditionInfoSerializer, DayHistorySerialilzer, RankResultSerializer, ResultSerializer, YearHistorySerialilzer

from stock.models import BasicInfo

from .common import make_condition
from .tasks import backtest
from .parser import get_serializer

from datetime import datetime, timedelta
from django.db.models import F
from django.db.models.expressions import Window
from django.db.models.functions import Rank

page = openapi.Parameter('page', openapi.IN_QUERY, default=1,
                        description="페이지 번호", type=openapi.TYPE_INTEGER)
size = openapi.Parameter('size', openapi.IN_QUERY, default=5,
                        description="한 페이지에 표시할 객체 수", type=openapi.TYPE_INTEGER)
sort = openapi.Parameter('sort', openapi.IN_QUERY, default="id",
                        description="정렬할 기준 Column, 'id'면 오름차순 '-id'면 내림차순", type=openapi.TYPE_STRING)
title = openapi.Parameter('title', openapi.IN_QUERY, default="제목",
                        description="검색할 글 제목", type=openapi.TYPE_STRING)
name = openapi.Parameter('name', openapi.IN_QUERY, default="이름",
                        description="검색할 이름", type=openapi.TYPE_STRING)
option = openapi.Parameter('option', openapi.IN_QUERY, default="옵션",
                        description="일간=today, 주간=week, 월간=month", type=openapi.TYPE_STRING)

@swagger_auto_schema(
    method='post',
    operation_id='백테스트 시작(유저)',
    operation_description='주어진 조건으로 백테스트를 요청합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description="백테스트 이름"),
            'asset': openapi.Schema(type=openapi.TYPE_STRING, description="시작 금액"),
            'start_date': openapi.Schema(type=openapi.TYPE_STRING, description="테스트 시작일"),
            'end_date': openapi.Schema(type=openapi.TYPE_STRING, description="테스트 종료일"),
            'commission': openapi.Schema(type=openapi.TYPE_STRING, description="수수료"),
            'company_name': openapi.Schema(type=openapi.TYPE_STRING, description="종목명"),
            'company_code': openapi.Schema(type=openapi.TYPE_STRING, description="종목 코드"),
            'buy_strategy': openapi.Schema(type=openapi.TYPE_STRING, description="매수 조건"),
            'sell_strategy': openapi.Schema(type=openapi.TYPE_STRING, description="매도 조건"),
        }
    ),
    tags=['주식_백테스트'],
    responses={status.HTTP_201_CREATED: ResultSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def test_start(request):
    title = request.data.get('title')                               # 백테스트 이름
    asset = int(request.data.get('asset'))                          # 시작 가격
    start_date = request.data.get('start_date')                     # 시작 일자
    end_date = request.data.get('end_date')                         # 종료 일자
    company_name = request.data.get('company_name')                 # 종목 이름
    company_code = request.data.get('company_code')                 # 종목 코드
    basic_info = get_object_or_404(BasicInfo, pk=company_code)      # 종목 정보
    commission = request.data.get('commission')                     # 수수료
    
    buy_strategy = request.data.get('buy_strategy')                 # 매수조건
    buy_standard = request.data.get('buy_standard')                 # 매수비중
    buy_ratio = request.data.get('buy_ratio')                       # 매수비율
    
    sell_strategy = request.data.get('sell_strategy')               # 매도조건
    sell_standard = request.data.get('sell_standard')               # 매수비중
    sell_ratio = request.data.get('sell_ratio')                     # 매수비율
    commission = round((float(commission) / 100) + 1, 3)
    
    result_base = {
        'title' : title,
        'asset' : asset,
        'commission' : commission,
        'test_start_date' : start_date,
        'test_end_date' : end_date,
        'buy_standard' : buy_standard,
        'buy_ratio' : buy_ratio,
        'sell_standard' : sell_standard,
        'sell_ratio' : sell_ratio,
    }
    
    # 이미 백테스트를 신청했음
    if request.user.is_backtest == True:
        return Response({'message' : 'Already Running Backtest'}, status=status.HTTP_403_FORBIDDEN)
    
    # 기본 정보를 DB에 입력
    serializer = ResultSerializer(data=result_base)
    if serializer.is_valid(raise_exception=True):
        result = serializer.save(user=request.user, basic_info=basic_info)

    account = {
        "balance" : asset,
        "start_price" : asset,
        "pre_price" : asset,
        "start_date":start_date,
        "end_date" : end_date,
        "company_name" : company_name, 
        "stocks" : {
            # "005930":{
            #     "amount":100,
            #     "avg_price":70000
            #     },
        },
        "commission" : commission,
        "result" : result,
        "win_cnt" : 0,
        "buy_sell_list" : [],
        "day_history_list" : [],
        "year_history_list" : []
    }
    
    # 매수 관련 정보 받기 및 DB에 저장, 에러 발생시 진행된 값들 제거
    try:
        # 백테스트 활성화
        request.user.is_backtest = True
        request.user.save()
        buy_condition = make_condition(result, True, buy_strategy, buy_standard, buy_ratio)
        sell_condition = make_condition(result, False, sell_strategy, sell_standard, sell_ratio)
        backtest.delay(account, company_code, start_date, end_date, buy_condition, sell_condition, result, request.user) # 비동기로 백테스트 진행
    except Exception as e:
        result.delete()
        request.user.is_backtest = False
        request.user.save()
        return Response({'message' : str(e)}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='get',
    operation_id='내 백테스트 결과 목록 조회(유저)',
    operation_description='내 백테스트 결과 목록을 조회합니다.',
    tags=['주식_백테스트'],
    manual_parameters=[page, size, title],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 백테스트 결과 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("result", "백테스트 결과 정보"),
            }
        )
    )}
)  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_my_backtest_result(request):
    my_backtest_result_list = Result.objects.filter(user=request.user)
    paginator = PageNumberPagination()
    
    if request.GET.get('title'):
        title = request.GET.get('title')
        my_backtest_result_list = my_backtest_result_list.filter(title__contains=title)
    
    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size
    
    result = paginator.paginate_queryset(my_backtest_result_list, request)
    serializer = ResultSerializer(result, many=True)
    return paginator.get_paginated_response(serializer.data)

@swagger_auto_schema(
    method='get',
    operation_id='백테스트 결과 조회(모두)',
    operation_description='백테스트 결과를 조회합니다',
    tags=['주식_백테스트'],
    responses={status.HTTP_200_OK: ResultSerializer}
)  
@api_view(['GET'])
@permission_classes([AllowAny])
def get_backtest_result(request, pk):
    backtest_result = get_object_or_404(Result, pk=pk)
    serializer = ResultSerializer(backtest_result)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='백테스트 매수매도 내역(모두)',
    operation_description='해당 백테스트의 매수매도 내역 전체를 조회합니다',
    tags=['주식_백테스트'],
    manual_parameters=[page, size],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 백테스트 결과 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("buysell", "백테스트 매수매도 정보"),
            }
        )
    )}
)  
@api_view(['GET'])
@permission_classes([AllowAny])
def get_backtest_buysell(request, backtest_id):
    buysell_list = BuySell.objects.filter(result_id=backtest_id)
    paginator = PageNumberPagination()
    
    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size
        result = paginator.paginate_queryset(buysell_list, request)
        serializer = BuySellSerializer(result, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    serializer = BuySellSerializer(buysell_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    

@swagger_auto_schema(
    method='get',
    operation_id='백테스트 매도매수 조건(모두)',
    operation_description='해당 백테스트의 매도매수 조건을 조회합니다',
    tags=['주식_백테스트'],
    responses={status.HTTP_200_OK: ConditionInfoSerializer}
)  
@api_view(['GET'])
@permission_classes([AllowAny])
def get_backtest_condition(request, backtest_id):
    condition_list = ConditionInfo.objects.filter(result_id=backtest_id)
    serializer = ConditionInfoSerializer(condition_list, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='백테스트 일별 데이터(모두)',
    operation_description='해당 백테스트의 일별 데이터를 조회합니다',
    tags=['주식_백테스트'],
    responses={status.HTTP_200_OK: DayHistorySerialilzer}
)  
@api_view(['GET'])
@permission_classes([AllowAny])
def get_backtest_day_history(request, backtest_id):
    day_history_list = DayHistory.objects.filter(result_id=backtest_id)
    serializer = DayHistorySerialilzer(day_history_list, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='백테스트 연도별 데이터(모두)',
    operation_description='해당 백테스트의 연도별 데이터를 조회합니다',
    tags=['주식_백테스트'],
    responses={status.HTTP_200_OK: YearHistorySerialilzer}
)  
@api_view(['GET'])
@permission_classes([AllowAny])
def get_backtest_year_history(request, backtest_id):
    year_history_list = YearHistory.objects.filter(result_id=backtest_id)
    serializer = YearHistorySerialilzer(year_history_list, many=True)
    susu = 0.015
    print((susu / 100) + 1)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_id='백테스트 랭킹(모두)',
    operation_description='백테스팅 랭킹을 조회합니다',
    tags=['주식_백테스트'],
    manual_parameters=[page, size, option, name],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 백테스트 결과 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("result", "백테스트 상세 정보"),
            }
        )
    )}
)  
@api_view(['GET'])
@permission_classes([AllowAny])
def get_rank(request):
    result_list = Result.objects.all()
    today = datetime.today()
    start_time = datetime.strptime(str(today.year)+" "+str(today.month)+" "+str(today.day) ,'%Y %m %d')
    end_time = datetime.strptime(str(today.year)+" "+str(today.month)+" "+str(today.day)+" 23:59:59", '%Y %m %d %H:%M:%S')
    
    if request.GET.get('option'):
        option = request.GET.get('option')
        
        if option == 'today':
            start_time = datetime.strptime(str(today.year)+" "+str(today.month)+" "+str(today.day) ,'%Y %m %d')
        elif option == 'week':        
            while today.weekday() != 0:
                today = today - timedelta(days=1)
            start_time = datetime.strptime(str(today.year)+" "+str(today.month)+" "+str(today.day) ,'%Y %m %d')
        elif option == 'month':
            start_time = datetime.strptime(str(today.year)+" "+str(today.month)+" "+str(1) ,'%Y %m %d')
            
    result_list = result_list.filter(created_at__range=(start_time, end_time))
    result_list = result_list.annotate(rank=Window(expression=Rank(), order_by=F('final_rate').desc())).order_by('rank')    
    
    paginator = PageNumberPagination()
    
    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size
    
    # 이름 검색을 했으면 랭크는 유지하며 검색된 값 찾기
    if request.GET.get('name'):
        name = request.GET.get('name')
        name_list = []
        result_list = list(result_list)
        for result in result_list:
            if result.user.name.find(name) != -1:
                name_list.append(result)
        
        result = paginator.paginate_queryset(name_list, request)    
    else:
        result = paginator.paginate_queryset(result_list, request)
    
    serializer = RankResultSerializer(result, many=True)
    return paginator.get_paginated_response(serializer.data)
    