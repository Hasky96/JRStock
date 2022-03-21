from __future__ import absolute_import, unicode_literals

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'JRstock.settings')

import django
django.setup()

from celery import shared_task


from .serializers import DayStockSerializer


@shared_task
def add_day_stocks():
    code_nubmer = '005930'
    current_price ='111111'
    changes = '1234'
    chages_ratio = '7.77'
    start_price = '11111'
    high_price = '111111'
    low_price = '111110'
    volume = '777777'
    trade_price = '123123'
    market_cap = '123123123'
    stock_amount = '123123123'
    date = '2022-07-07'
    
    serializer = DayStockSerializer(data={'code_number' : code_nubmer, 'current_price' : current_price, 'changes' : changes, 'chages_ratio' : chages_ratio, 'start_price' : start_price, 'high_price' : high_price, 'low_price' : low_price, 'volume' : volume, 'trade_price' : trade_price, 'market_cap' : market_cap, 'stock_amount' : stock_amount, 'date' : date})
    if serializer.is_valid(raise_exception=True):
        serializer.save()
