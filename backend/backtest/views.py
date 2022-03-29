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
        "result" : result,
        "win_cnt" : 0,
        "buy_sell_list" : [],
        "day_history_list" : [],
        "year_history_list" : []
    }
    
    # 매수 관련 정보 받기 및 DB에 저장
    buy_condition = make_condition(result, True, buy_strategy, buy_standard, buy_ratio)
    sell_condition = make_condition(result, False, sell_strategy, sell_standard, sell_ratio)

    serializer = backtest(account, company_code, start_date, end_date, buy_condition, sell_condition)
    return Response(serializer.data, status=status.HTTP_201_CREATED)