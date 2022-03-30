from django.db import models
from django.db.models.functions import Cast
from django.conf import settings

# ====================================================================== 통합 ======================================================================
class BasicInfo(models.Model):
    code_number = models.CharField(max_length=10, primary_key=True)
    market = models.CharField(max_length=10, null=True)
    company_name = models.CharField(max_length=50)
    sector = models.CharField(max_length=50)
    main_product = models.CharField(max_length=100, null=True)
    listing_date = models.CharField(max_length=20)
    settlement_month = models.CharField(max_length=10)
    representative = models.CharField(max_length=50)
    homepage = models.CharField(max_length=50, null=True)
    location = models.CharField(max_length=20)
    
    class Meta:
        ordering = ['company_name']
        
class FinancialInfo(models.Model):
    basic_info = models.OneToOneField(BasicInfo, on_delete=models.CASCADE, primary_key=True)
    face_value = models.FloatField()
    capital_stock = models.FloatField()
    number_of_listings = models.FloatField()
    credit_rate = models.FloatField()
    year_high_price = models.FloatField()
    year_low_price = models.FloatField()
    market_cap = models.FloatField()
    foreigner_percent = models.FloatField()
    substitute_price = models.FloatField()
    per = models.FloatField(null=True)
    eps = models.FloatField(null=True)
    roe = models.FloatField(null=True)
    pbr = models.FloatField(null=True)
    ev = models.FloatField(null=True)
    bps = models.FloatField(null=True)
    sales_revenue = models.FloatField(null=True)
    operating_income = models.FloatField(null=True)
    net_income = models.FloatField(null=True)
    shares_outstanding = models.FloatField(null=True)
    shares_outstanding_rate = models.FloatField(null=True)
    
    class Meta:
        ordering = ['basic_info']

# 조인이 가능한 일일 데이터        
class DayStockInfo(models.Model):
    stock_seq = models.AutoField(primary_key=True)
    financial_info = models.ForeignKey(FinancialInfo, on_delete=models.CASCADE, null=True, db_column='code_number')
    current_price = models.CharField(max_length=20, blank=True, null=True)
    changes = models.CharField(max_length=20, blank=True, null=True)
    chages_ratio = models.CharField(max_length=20, blank=True, null=True)
    start_price = models.CharField(max_length=20, blank=True, null=True)
    high_price = models.CharField(max_length=20, blank=True, null=True)
    low_price = models.CharField(max_length=20, blank=True, null=True)
    volume = models.CharField(max_length=20, blank=True, null=True)
    trade_price = models.CharField(max_length=50, blank=True, null=True)
    market_cap = models.CharField(max_length=50, blank=True, null=True)
    stock_amount = models.CharField(max_length=20, blank=True, null=True)
    date = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        ordering = [
            Cast('market_cap', output_field=models.BigIntegerField()).desc(),
        ]
        
class Interest(models.Model):
    basic_info = models.ForeignKey(BasicInfo, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-id']
        
# 조인이 불가능한 데이터들       
class DayStock(models.Model):
    stock_seq = models.AutoField(primary_key=True)
    code_number = models.CharField(max_length=10)
    current_price = models.CharField(max_length=20, blank=True, null=True)
    changes = models.CharField(max_length=20, blank=True, null=True)
    chages_ratio = models.CharField(max_length=20, blank=True, null=True)
    start_price = models.CharField(max_length=20, blank=True, null=True)
    high_price = models.CharField(max_length=20, blank=True, null=True)
    low_price = models.CharField(max_length=20, blank=True, null=True)
    volume = models.CharField(max_length=20, blank=True, null=True)
    trade_price = models.CharField(max_length=50, blank=True, null=True)
    market_cap = models.CharField(max_length=50, blank=True, null=True)
    stock_amount = models.CharField(max_length=20, blank=True, null=True)
    date = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        ordering = ['date']
        db_table = 'day_stock'
        
class WeekStock(models.Model):
    stock_seq = models.AutoField(primary_key=True)
    code_number = models.CharField(max_length=10)
    current_price = models.CharField(max_length=20, blank=True, null=True)
    changes = models.CharField(max_length=20, blank=True, null=True)
    chages_ratio = models.CharField(max_length=20, blank=True, null=True)
    start_price = models.CharField(max_length=20, blank=True, null=True)
    high_price = models.CharField(max_length=20, blank=True, null=True)
    low_price = models.CharField(max_length=20, blank=True, null=True)
    volume = models.CharField(max_length=20, blank=True, null=True)
    trade_price = models.CharField(max_length=50, blank=True, null=True)
    market_cap = models.CharField(max_length=50, blank=True, null=True)
    stock_amount = models.CharField(max_length=20, blank=True, null=True)
    date = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        ordering = ['date']
        db_table = 'week_stock'
        
class MonthStock(models.Model):
    stock_seq = models.AutoField(primary_key=True)
    code_number = models.CharField(max_length=10)
    current_price = models.CharField(max_length=20, blank=True, null=True)
    changes = models.CharField(max_length=20, blank=True, null=True)
    chages_ratio = models.CharField(max_length=20, blank=True, null=True)
    start_price = models.CharField(max_length=20, blank=True, null=True)
    high_price = models.CharField(max_length=20, blank=True, null=True)
    low_price = models.CharField(max_length=20, blank=True, null=True)
    volume = models.CharField(max_length=20, blank=True, null=True)
    trade_price = models.CharField(max_length=50, blank=True, null=True)
    market_cap = models.CharField(max_length=50, blank=True, null=True)
    stock_amount = models.CharField(max_length=20, blank=True, null=True)
    date = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        ordering = ['date']
        db_table = 'month_stock'
        
class Predict(models.Model):
    financial_info = models.ForeignKey(FinancialInfo, on_delete=models.CASCADE, null=True, db_column='code_number')
    date = models.CharField(max_length=20)
    result_close = models.FloatField()
    
    class Meta:
        ordering = ['-id']