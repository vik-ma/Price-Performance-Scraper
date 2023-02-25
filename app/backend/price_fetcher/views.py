from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest
from .models import Test
from . import prj_fetcher as pf
import datetime

# Create your views here.

def list_test_items(request):
    context = {'test_list' : Test.objects.all()}
    return render(request, 'price_fetcher/test_list.html', context)


def insert_test_item(request:HttpRequest):
    current_datetime = datetime.datetime.now()  

    test = Test()
    test.test_name = request.POST['test_name']
    test.test_num = int(request.POST['test_num'])
    test.test_date = current_datetime
    test.save()

    return redirect('/price_fetcher/test_list')


def delete_test_item(request, test_id):
    test_to_delete = Test.objects.get(id=test_id)
    test_to_delete.delete()

    return redirect('/price_fetcher/test_list')

def test_module_return(request:HttpRequest):
    module_test = pf.test_django()
    response = f"<h1>{' '.join(map(str, module_test))}</h1>"
    return HttpResponse(response)