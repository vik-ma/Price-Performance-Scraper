from rest_framework import serializers
from .models import FetchProperties

class FetchPropertiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FetchProperties
        fields = '__all__'