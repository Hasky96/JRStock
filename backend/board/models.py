from django.db import models
from django.conf import settings

from stock.models import InfoKospi, InfoKonex, InfoKosdaq

# ====================================================================== 코스피 ======================================================================
class Kospi(models.Model):
    info_kospi = models.ForeignKey(InfoKospi, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-id']
        
class CommentKospi(models.Model):
    board_kospi = models.ForeignKey(Kospi, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    
    class Meta:
        ordering = ['-id']

# ====================================================================== 코스닥 ======================================================================    
class Kosdaq(models.Model):
    info_kosdaq = models.ForeignKey(InfoKosdaq, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-id']
        
class CommentKosdaq(models.Model):
    board_kosdaq = models.ForeignKey(Kosdaq, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    
    class Meta:
        ordering = ['-id']
        
# ====================================================================== 코넥스 ======================================================================
class Konex(models.Model):
    info_konex = models.ForeignKey(InfoKonex, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-id']
        
class CommentKonex(models.Model):
    board_konex = models.ForeignKey(Konex, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    
    class Meta:
        ordering = ['-id']