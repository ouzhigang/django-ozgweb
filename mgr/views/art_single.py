from django.shortcuts import render
import django
from django.http import JsonResponse
import os, json, hashlib, platform, time
import commons.commons as commons_util
import commons.service.art_single as service_art_single

def get(request):
	res = service_art_single.get(request)
	return JsonResponse(res)

def update(request):
	res = service_art_single.update(request)
	return JsonResponse(res)
