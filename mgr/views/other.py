from django.shortcuts import render
import django
from django.http import JsonResponse
import os, json, hashlib, platform, time
import commons.commons as commons_util

def server_info(request):
	
	data = {
		"os": platform.system(),
		"django_version": django.get_version(),
		"python_version": platform.python_version(),
		"web_path": os.path.dirname(os.path.dirname(__file__)),
		"now": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())),
	}
	res = commons_util.res_success("请求成功", data)
	return JsonResponse(res)
	
def logout(request):
	del request.session["user"]

	res = commons_util.res_success("退出登录")
	return JsonResponse(res)
