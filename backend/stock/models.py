from django.db import models
from django.conf import settings

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
    
class BoardKospi(models.Model):
    info_kospi = models.ForeignKey(InfoKospi, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-id']