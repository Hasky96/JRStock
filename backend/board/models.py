from django.db import models
from django.conf import settings

from stock.models import BasicInfo

# ====================================================================== 통합 ======================================================================
class Post(models.Model):
    basic_info = models.ForeignKey(BasicInfo, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-id']

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    
    class Meta:
        ordering = ['-id']

# ====================================================================== 코스피 ======================================================================
# class Kospi(models.Model):
#     info_kospi = models.ForeignKey(InfoKospi, on_delete=models.CASCADE)
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     title = models.CharField(max_length=50)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         ordering = ['-id']
        
# class CommentKospi(models.Model):
#     board_kospi = models.ForeignKey(Kospi, on_delete=models.CASCADE)
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     content = models.TextField()
    
#     class Meta:
#         ordering = ['-id']