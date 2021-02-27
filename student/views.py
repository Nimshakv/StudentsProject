from django.shortcuts import render
import requests
from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

API_URL = 'http://localhost:8080/'


def home(request):
    return render(request, 'student/index.html', {})


def load(request):
    draw = request.GET.get('draw', 0)
    start = request.GET.get('start', 0)
    length = request.GET.get('length', 25)

    # for column filtering
    first_name = request.GET.get(f'columns[{get_column_index("first_name")}][search][value]')
    last_name = request.GET.get(f'columns[{get_column_index("last_name")}][search][value]')
    dob = request.GET.get(f'columns[{get_column_index("dob")}][search][value]')
    email = request.GET.get(f'columns[{get_column_index("email")}][search][value]')
    class_no = request.GET.get(f'columns[{get_column_index("class_no")}][search][value]')
    parent = request.GET.get(f'columns[{get_column_index("parent_name")}][search][value]')
    phone_number = request.GET.get(f'columns[{get_column_index("phone_no")}][search][value]')
    year = request.GET.get(f'columns[{get_column_index("year_joined")}][search][value]')
    created = request.GET.get(f'columns[{get_column_index("created")}][search][value]')
    updated = request.GET.get(f'columns[{get_column_index("updated")}][search][value]')

    # getting data from API
    data = get_data({
        "first_name": first_name,
        "last_name": last_name,
        "dob": dob,
        "email": email,
        "class_no": class_no,
        "parent": parent,
        "phone_number": phone_number,
        "year": year,
        "created": created,
        "updated": updated
    }, start, length)

    records = {
        'recordsTotal': data['total_length'],
        'recordsFiltered': data['total_length'],
        'draw': draw,
        'data': data['result'],
    }

    return HttpResponse(json.dumps(records), content_type='application/json')


@csrf_exempt
def add(request):
    params = request.POST.get('params', {})
    params = json.loads(params)
    res = requests.post(f'{API_URL}students/', data=params)

    if res.status_code != 201:
        response = HttpResponse(json.dumps({'message': 'Saving data failed'}),
                                content_type='application/json')
        response.status_code = 400
        return response

    response = HttpResponse(json.dumps({'message': json.dumps(res.json())}),
                            content_type='application/json')
    response.status_code = 200
    return response


@csrf_exempt
def edit(request, pk):
    params = request.POST.get('params', {})
    params = json.loads(params)
    res = requests.put(f'{API_URL}students/{pk}', data=params)

    if res.status_code != 200:
        response = HttpResponse(json.dumps({'message': 'Saving data failed'}),
                                content_type='application/json')
        response.status_code = 400
        return response

    response = HttpResponse(json.dumps({'message': json.dumps(res.json())}),
                            content_type='application/json')
    response.status_code = 200
    return response


@csrf_exempt
def delete(request, pk):
    res = requests.delete(f'{API_URL}students/{pk}')

    if res.status_code != 204:
        response = HttpResponse(json.dumps({'message': 'Deleting item failed'}),
                                content_type='application/json')
        response.status_code = 400
        return response

    response = HttpResponse(json.dumps({'message': 'Successfully deleted item'}),
                            content_type='application/json')
    response.status_code = 200
    return response


def get_data(search_params, start=0, length=10):
    response = requests.get(f'{API_URL}students',
                            params={
                                'start': start,
                                'length': length,
                                'search_params': json.dumps(search_params)
                            })
    response = response.json()
    return response


def get_column_index(column_name):
    return {
        'first_name': 1,
        'last_name': 2,
        'dob': 3,
        'email': 4,
        'class_no': 5,
        'parent_name': 6,
        'phone_no': 7,
        'year_joined': 8,
        'created': 9,
        'updated': 10

    }[column_name]