from rest_framework import serializers

from accounts.serializers import UserSerializer
from stock.serializers import BasicInfoSerializer
from .models import Comment, Post

# ====================================================================== 통합 ======================================================================
class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = '__all__'

class PostDetailSerializer(serializers.ModelSerializer):
    basic_info = BasicInfoSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = '__all__'
        
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = '__all__'

# ====================================================================== 코스피 ======================================================================  
# class BoardKospiSerializer(serializers.ModelSerializer):
#     user = UserSerializer(read_only=True)
    
#     class Meta:
#         model = Kospi
#         fields = '__all__'

# class BoardDetailKospiSerializer(serializers.ModelSerializer):
#     info_kospi = InfoKospiSerializer(read_only=True)
#     user = UserSerializer(read_only=True)
    
#     class Meta:
#         model = Kospi
#         fields = '__all__'

# class CommentKospiSerializer(serializers.ModelSerializer):
#     user = UserSerializer(read_only=True)
    
#     class Meta:
#         model = CommentKospi
#         fields = '__all__'
        