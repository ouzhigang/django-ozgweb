from django.shortcuts import render
import django
from django.conf import settings
from django.http import JsonResponse
import os, json, hashlib, platform, time
import commons.commons as commons_util
import commons.service.user as service_user

def updatepwd(request):
	res = service_user.updatepwd(request)
	return JsonResponse(res)

def show(request):
	#分页索引和每页显示数
	page = 1
	if request.GET.get("page"):
		page = int(request.GET.get("page"))
	page_size = settings.DATABASE_PAGE_SIZE
	if request.GET.get("page_size"):
		page_size = int(request.GET.get("page_size"))
	
	res = service_user.get_list(page, page_size)
	return JsonResponse(res)
	
def add(request):
	res = service_user.add(request)
	return JsonResponse(res)
	
def userdel(request):
	res = service_user.userdel(request)
	return JsonResponse(res)
	