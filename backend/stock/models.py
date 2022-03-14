from django.db import models
from django.conf import settings

# ====================================================================== 코스피 ======================================================================
class InfoKospi(models.Model):
    code_number = models.CharField(max_length=20, primary_key=True)
    company_name = models.CharField(max_length=50)
    sector = models.CharField(max_length=50)
    main_product = models.CharField(max_length=100, null=True)
    listing_date = models.CharField(max_length=20)
    settlement_month = models.CharField(max_length=10)
    representative = models.CharField(max_length=50)
    homepage = models.CharField(max_length=50, null=True)
    location = models.CharField(max_length=20)
    
    class Meta:
        ordering = ['code_number']

class FinancialKospi(models.Model):
    info_kospi = models.OneToOneField(InfoKospi, on_delete=models.CASCADE, primary_key=True)
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
        ordering = ['info_kospi']
        
# ====================================================================== 코스닥 ======================================================================
class InfoKosdaq(models.Model):
    code_number = models.CharField(max_length=20, primary_key=True)
    company_name = models.CharField(max_length=50)
    sector = models.CharField(max_length=50)
    main_product = models.CharField(max_length=100, null=True)
    listing_date = models.CharField(max_length=20)
    settlement_month = models.CharField(max_length=10)
    representative = models.CharField(max_length=50)
    homepage = models.CharField(max_length=50, null=True)
    location = models.CharField(max_length=20)
    
    class Meta:
        ordering = ['code_number']

class FinancialKosdaq(models.Model):
    info_kosdaq = models.OneToOneField(InfoKosdaq, on_delete=models.CASCADE, primary_key=True)
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
        ordering = ['info_kosdaq']
        
# ====================================================================== 코넥스 ======================================================================
class InfoKonex(models.Model):
    code_number = models.CharField(max_length=20, primary_key=True)
    company_name = models.CharField(max_length=50)
    sector = models.CharField(max_length=50)
    main_product = models.CharField(max_length=100, null=True)
    listing_date = models.CharField(max_length=20)
    settlement_month = models.CharField(max_length=10)
    representative = models.CharField(max_length=50)
    homepage = models.CharField(max_length=50, null=True)
    location = models.CharField(max_length=20)
    
    class Meta:
        ordering = ['code_number']

class FinancialKonex(models.Model):
    info_konex = models.OneToOneField(InfoKonex, on_delete=models.CASCADE, primary_key=True)
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
        ordering = ['info_konex']
        