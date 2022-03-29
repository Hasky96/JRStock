from rest_framework import serializers

from accounts.serializers import UserSerializer
from stock.serializers import BasicInfoSerializer
from .models import BuySell, ConditionInfo, DayHistory, Result, YearHistory

class ResultSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    basic_info = BasicInfoSerializer(read_only=True)
    
    class Meta:
        model = Result
        fields = '__all__'

class BuySellSerializer(serializers.ModelSerializer):
    # result = ResultSerializer(read_only=True)
    
    class Meta:
        model = BuySell
        fields = '__all__'
        
class ConditionInfoSerializer(serializers.ModelSerializer):
    # result = ResultSerializer(read_only=True)
    
    class Meta:
        model = ConditionInfo
        fields = '__all__'
        
class DayHistorySerialilzer(serializers.ModelSerializer):
    # result = ResultSerializer(read_only=True)
    
    class Meta:
        model = DayHistory
        fields = '__all__'
        
class YearHistorySerialilzer(serializers.ModelSerializer):
    # result = ResultSerializer(read_only=True)
    
    class Meta:
        model = YearHistory
        fields = '__all__'