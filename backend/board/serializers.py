from rest_framework import serializers

from accounts.serializers import UserSerializer
from stock.serializers import InfoKospiSerializer, InfoKosdaqSerializer, InfoKonexSerializer
from .models import Konex, Kosdaq, CommentKonex, CommentKosdaq, CommentKospi, Kospi

# ====================================================================== 코스피 ======================================================================  
class BoardKospiSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Kospi
        fields = '__all__'

class BoardDetailKospiSerializer(serializers.ModelSerializer):
    info_kospi = InfoKospiSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Kospi
        fields = '__all__'

class CommentKospiSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CommentKospi
        fields = '__all__'
        
# ====================================================================== 코스닥 ======================================================================
class BoardKosdaqSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Kosdaq
        fields = '__all__'
        
class BoardDetailKosdaqSerializer(serializers.ModelSerializer):
    info_kosdaq = InfoKosdaqSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Kosdaq
        fields = '__all__'

class CommentKosdaqSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CommentKosdaq
        fields = '__all__'
        
# ====================================================================== 코넥스 ======================================================================
class BoardKonexSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Konex
        fields = '__all__'
        
class BoardDetailKonexSerializer(serializers.ModelSerializer):
    info_konex = InfoKonexSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Konex
        fields = '__all__'

class CommentKonexSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CommentKonex
        fields = '__all__'