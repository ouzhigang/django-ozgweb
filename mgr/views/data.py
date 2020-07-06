from django.shortcuts import render
import django
from django.conf import settings
from django.http import JsonResponse
import os, json, hashlib, platform, time
import commons.commons as commons_util
import commons.service.data as service_data

def show(request):
	#分页索引和每页显示数
	page = 1
	if request.GET.get("page"):
		page = int(request.GET.get("page"))
	page_size = settings.DATABASE_PAGE_SIZE
	if request.GET.get("page_size"):
		page_size = int(request.GET.get("page_size"))
	
	wq = {
		"type": int(request.GET.get("type"))
	}
	
	if request.GET.get("name"):
		wq["name__contains"] = request.GET.get("name")
	
	if request.GET.get("data_cat_id"):
		wq["data_cat_id"] = int(request.GET.get("data_cat_id"))
	
	res = service_data.get_list(page, page_size, wq)
	return JsonResponse(res)

def get(request):		
	res = service_data.get(request)
	return JsonResponse(res)

def add(request):
	res = service_data.add(request)
	return JsonResponse(res)

def datadel(request):
	res = service_data.datadel(request)
	return JsonResponse(res)

def handle_uploaded_file(f):
	file_name = None
	
	ext_name = os.path.splitext(f.name)[1]
	
	max_size = settings.MAX_UPLOAD
	
	#允许上传的文件类型
	allow_ext_name = [
		".jpg",
		".jpeg",
		".png",
		".gif",
	];	
	
	if ext_name not in allow_ext_name:
		return {
			"msg": "不允许上传此类文件",
			"filepath": file_name
		}
	
	if f.size > max_size:
		return {
			"msg": "不能上传超过" + str(max_size // 1024 // 1024) + "M的文件",
			"filepath": file_name
		}
	
	try:
		base_path = settings.BASE_DIR
		print(base_path)
		path = base_path + "/static/upload/" + time.strftime('%Y/%m/%d/')
		if not os.path.exists(path):
			os.makedirs(path)
		
		file_exists = True
		while file_exists:
			m = hashlib.md5()
			m.update(str(time.time()).encode(encoding = 'UTF-8'))
			
			file_name = path + m.hexdigest() + ext_name
			file_exists = os.path.exists(file_name)
			if file_exists:
				time.sleep(1)
		
		destination = open(file_name, 'wb+')
		for chunk in f.chunks():
			destination.write(chunk)
		destination.close()
		
		file_name = file_name.replace(base_path + "/static/upload/", "")
		
	except Exception as e:
		return {
			"msg": str(e),
			"filepath": file_name
		}

	return {
		"msg": "上传成功",
		"filepath": file_name
	}

def upload(request):
	f = request.FILES['file']
	res_f = handle_uploaded_file(f)
	if res_f["filepath"] != None:
		res = commons_util.res_success(res_f["msg"], { "filepath": res_f["filepath"] })
		return JsonResponse(res)
	else:
		res = commons_util.res_fail(1, res_f["msg"])
		return JsonResponse(res)
