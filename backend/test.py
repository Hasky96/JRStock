from stock.tasks import add_day_stocks
from datetime import datetime, timedelta

# add_day_stocks()
yesterday = datetime.now() - timedelta(days=1)
# 0 월요일, 6 일요일
if yesterday.weekday() == 6:
    yesterday = yesterday - timedelta(days=2)
    print(yesterday.weekday())
if yesterday.weekday() == 5:
    yesterday = yesterday - timedelta(days=1)
    
result = yesterday.strftime('%Y-%m-%d')
print(result)