from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from . import common
from . import algorithm

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def test_start(request):
    code_number = request.data.get('code_number')
    option = request.data.get('option')
    start_date = request.data.get('start_date')
    end_date = request.data.get('end_date')
    start_price = request.data.get('start_price')
    buy_percent = request.data.get('buy_percent')
    sell_percent = request.data.get('sell_percent')
    
    day_stocks = common.get_day_stock(code_number, start_date, end_date)
    
    start_price = int(start_price)
    account = {
        "balance":start_price,
        "start_price":start_price,
        "pre_price":start_price, 
        "stocks":{
            # "005930":{
            #     "amount":100,
            #     "avg_price":70000
            #     },
        }
    }
    
    if option == 'RSI':
        high_index = request.data.get('high_index')
        low_index = request.data.get('low_index')
        rsi_period = request.data.get('rsi_period')
        algorithm.RSI_buy_sell(day_stocks, int(rsi_period), int(high_index), int(low_index), account, int(buy_percent), int(sell_percent), start_date)
    
    
    
    
    return Response(status=status.HTTP_201_CREATED)