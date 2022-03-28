from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import ResultSerializer

from stock.models import BasicInfo

from .common import backtest, make_condition
from . import algorithm

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def test_start(request):
    title = request.data.get('title') # 백테스트 이름
    asset = int(request.data.get('asset')) # 시작 가격
    start_date = request.data.get('start_date') # 시작 일자
    end_date = request.data.get('end_date') # 종료 일자
    company_name = request.data.get('company_name') # 종목 이름
    company_code = request.data.get('company_code') # 종목 코드
    basic_info = get_object_or_404(BasicInfo, pk=company_code)
    commission = request.data.get('commission') # 수수료
    
    buy_strategy = request.data.get('buy_strategy')
    buy_standard = request.data.get('buy_standard')
    buy_ratio = request.data.get('buy_ratio')
    
    sell_strategy = request.data.get('sell_strategy')
    sell_standard = request.data.get('sell_standard')
    sell_ratio = request.data.get('sell_ratio')
    
    result_base = {
        'title' : title,
        'asset' : asset,
        'test_start_date' : start_date,
        'test_end_date' : end_date,
        'commission' : commission,
        'buy_standard' : buy_standard,
        'buy_ratio' : buy_ratio,
        'sell_standard' : sell_standard,
        'sell_ratio' : sell_ratio,
    }
    
    serializer = ResultSerializer(data=result_base)
    if serializer.is_valid(raise_exception=True):
        result = serializer.save(user=request.user, basic_info=basic_info)
    print(result)

    account = {
        "user" : request.user,
        "result" : result,
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
        }
    }
    
    
    
    # 매수 관련 정보 받기 및 DB에 저장
    buy_condition = make_condition(result, True, buy_strategy, buy_standard, buy_ratio)
    sell_condition = make_condition(result, False, sell_strategy, sell_standard, sell_ratio)

    # 여기에 받은값을 부여해야함
    # buy_condition=[ [10, 20, 120, 30], [407, 20, 40], [205, 12, 26, 9, 20], 90, 100 ]
    # sell_condition=[ [206, 12, 26, 9, 30], 30, 100 ]
    # backtest(account, company_code, start_date, end_date, buy_condition, sell_condition)
    
    
    
    return Response(status=status.HTTP_201_CREATED)