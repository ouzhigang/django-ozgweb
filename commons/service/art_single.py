from django.db import models
from django.forms.models import model_to_dict
import json, time, html
import commons.commons as commons_util
from commons.models import *

def get(request):
	
	id = request.GET.get("id")
	id = int(id)
	
	obj = ArtSingle.objects.get(id = id)
	obj = model_to_dict(obj)
	obj["content"] = html.unescape(obj["content"])
	return commons_util.res_success("请求成功", obj)

def update(request):
	post_data = json.loads(request.body.decode("utf-8"))
	post_data["id"] = int(post_data["id"])
	
	obj = ArtSingle.objects.get(id = post_data["id"])
	obj.content = html.escape(post_data["content"])
	
	obj.save()
	return commons_util.res_success("更新成功")