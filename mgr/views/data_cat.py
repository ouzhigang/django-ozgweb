from django.shortcuts import render
import django
from django.http import JsonResponse
import os, json, hashlib, platform, time
import commons.commons as commons_util
import commons.service.data_cat as service_data_cat

def show(request):
	res = service_data_cat.get_list(request)
	return JsonResponse(res)

def get(request):
	res = service_data_cat.get(request)
	return JsonResponse(res)

def add(request):
	res = service_data_cat.add(request)
	return JsonResponse(res)

def data_cat_del(request):
	res = service_data_cat.data_cat_del(request)
	return JsonResponse(res)
