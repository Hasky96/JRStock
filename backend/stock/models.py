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
    face_value = models.CharField(max_length=20)
    capital_stock = models.CharField(max_length=20)
    number_of_listings = models.CharField(max_length=20)
    credit_rate = models.CharField(max_length=20)
    year_high_price = models.CharField(max_length=20)
    year_low_price = models.CharField(max_length=20)
    market_cap = models.CharField(max_length=20)
    foreigner_percent = models.CharField(max_length=20)
    substitute_price = models.CharField(max_length=20)
    per = models.CharField(max_length=20, null=True)
    eps = models.CharField(max_length=20, null=True)
    roe = models.CharField(max_length=20, null=True)
    pbr = models.CharField(max_length=20, null=True)
    ev = models.CharField(max_length=20, null=True)
    bps = models.CharField(max_length=20, null=True)
    sales_revenue = models.CharField(max_length=20, null=True)
    operating_income = models.CharField(max_length=20, null=True)
    net_income = models.CharField(max_length=20, null=True)
    shares_outstanding = models.CharField(max_length=20, null=True)
    shares_outstanding_rate = models.CharField(max_length=20, null=True)
    
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
    face_value = models.CharField(max_length=20)
    capital_stock = models.CharField(max_length=20)
    number_of_listings = models.CharField(max_length=20)
    credit_rate = models.CharField(max_length=20)
    year_high_price = models.CharField(max_length=20)
    year_low_price = models.CharField(max_length=20)
    market_cap = models.CharField(max_length=20)
    foreigner_percent = models.CharField(max_length=20)
    substitute_price = models.CharField(max_length=20)
    per = models.CharField(max_length=20, null=True)
    eps = models.CharField(max_length=20, null=True)
    roe = models.CharField(max_length=20, null=True)
    pbr = models.CharField(max_length=20, null=True)
    ev = models.CharField(max_length=20, null=True)
    bps = models.CharField(max_length=20, null=True)
    sales_revenue = models.CharField(max_length=20, null=True)
    operating_income = models.CharField(max_length=20, null=True)
    net_income = models.CharField(max_length=20, null=True)
    shares_outstanding = models.CharField(max_length=20, null=True)
    shares_outstanding_rate = models.CharField(max_length=20, null=True)
    
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
    face_value = models.CharField(max_length=20)
    capital_stock = models.CharField(max_length=20)
    number_of_listings = models.CharField(max_length=20)
    credit_rate = models.CharField(max_length=20)
    year_high_price = models.CharField(max_length=20)
    year_low_price = models.CharField(max_length=20)
    market_cap = models.CharField(max_length=20)
    foreigner_percent = models.CharField(max_length=20)
    substitute_price = models.CharField(max_length=20)
    per = models.CharField(max_length=20, null=True)
    eps = models.CharField(max_length=20, null=True)
    roe = models.CharField(max_length=20, null=True)
    pbr = models.CharField(max_length=20, null=True)
    ev = models.CharField(max_length=20, null=True)
    bps = models.CharField(max_length=20, null=True)
    sales_revenue = models.CharField(max_length=20, null=True)
    operating_income = models.CharField(max_length=20, null=True)
    net_income = models.CharField(max_length=20, null=True)
    shares_outstanding = models.CharField(max_length=20, null=True)
    shares_outstanding_rate = models.CharField(max_length=20, null=True)
    
    class Meta:
        ordering = ['info_konex']
        