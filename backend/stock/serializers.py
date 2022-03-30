from rest_framework import serializers
from accounts.serializers import UserSerializer

from .models import BasicInfo, DayStock, DayStockInfo, FinancialInfo, Interest, MonthStock, Predict, WeekStock

# ====================================================================== 통합 ======================================================================  
class BasicInfoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BasicInfo
        fields = '__all__'
        
class FinancialInfoSerializer(serializers.ModelSerializer):
    basic_info = BasicInfoSerializer(read_only=True)
    
    class Meta:
        model = FinancialInfo
        fields = '__all__'

class DayStockInfoSerializer(serializers.ModelSerializer):
    financial_info = FinancialInfoSerializer(read_only=True)
    
    class Meta:
        model = DayStockInfo
        fields = '__all__'
        
class InterestSerializer(serializers.ModelSerializer):
    basic_info = BasicInfoSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Interest
        fields = '__all__'
        
class DayStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayStock
        fields = '__all__'
        
class WeekStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeekStock
        fields = '__all__'
        
class MonthStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthStock
        fields = '__all__'
        
class PredictSerializer(serializers.ModelSerializer):
    class Meta:
        model = Predict
        fields = '__all__'
