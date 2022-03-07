from rest_framework import serializers
from .models import InfoKospi, BoardKospi

class InfoKospiSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoKospi
        fields = '__all__'
        
class BoardKospiSerializer(serializers.ModelSerializer):
    info_kospi = InfoKospiSerializer(read_only=True)
    
    class Meta:
        model = BoardKospi
        fields = '__all__'