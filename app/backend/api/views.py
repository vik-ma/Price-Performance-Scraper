from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import FetchPropertiesSerializer
from . import test_module

# Create your views here.

@api_view(['POST'])
def test_post(request):
    serializer = FetchPropertiesSerializer(data=request.data)
    if serializer.is_valid():
        test = test_module.test_function(serializer.data)
        return Response(test)
    return Response(serializer.errors)