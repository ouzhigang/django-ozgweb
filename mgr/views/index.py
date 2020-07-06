from django.shortcuts import render
import django
from django.http import JsonResponse
import os, json, hashlib, platform, time
import commons.commons as commons_util
import commons.service.user as service_user

def login(request):
	res = service_user.login(request)
	return JsonResponse(res)

def getvcode(request):
	ca = commons_util.Captcha(request)
	#ca.words = ['hello', 'world', 'helloworld']
	ca.type = 'number' #or word
	ca.img_width = 150
	ca.img_height = 30
	return ca.display()
