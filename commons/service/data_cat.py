from django.db import connection
from django.forms.models import model_to_dict
from django.conf import settings
import json, time
import commons.commons as commons_util
from commons.models import *

def delete_by_id(id):
	dc_list = DataCat.objects.filter(parent_id = id)

	for dc in dc_list:
		child_count = DataCat.objects.filter(parent_id = dc.id).count()
		if child_count > 0:
			delete_by_id(dc.id)
	
		#删除该分类下面的对应数据
		cursor = connection.cursor()
		cursor.execute("delete from " + settings.DATABASE_TABLE_PREFIX + "data where data_cat_id = " + str(dc.id))
		cursor.close()
		
		dc.delete()
		
#递归获取父分类的dict
def get_by_id(id):
	data_cat = DataCat.objects.get(id = id)
	data_cat_json = model_to_dict(data_cat)
	if data_cat_json["parent_id"] != 0:
		data_cat_json["parent"] = get_by_id(data_cat_json["parent_id"])	
	return data_cat_json
	
#递归获取该分类下的分类(返回list)
def list_by_id(id):
	dc_list = DataCat.objects.filter(parent_id = id).order_by("-sort", "-id")
	dc_list_json = []
	for dc in dc_list:
		item = model_to_dict(dc)
			
		child_count = DataCat.objects.filter(parent_id = item["id"]).count()
		if child_count > 0:
			item["children"] = list_by_id(item["id"])
		
		dc_list_json.append(item)

	return dc_list_json

def get_list(request):
	type = int(request.GET.get("type"))
	data_cat_list = DataCat.objects.filter(type = type, parent_id = 0).order_by("-sort", "-id")
	data_cat_list_json = []
	for data_cat in data_cat_list:		
		item = model_to_dict(data_cat)
		
		child_count = DataCat.objects.filter(parent_id = item["id"]).count()
		if child_count > 0:
			item["children"] = list_by_id(item["id"])
			
		data_cat_list_json.append(item)
	
	return commons_util.res_success("请求成功", data_cat_list_json)

def get(request):
		
	try:
		id = request.GET.get("id")
		data_cat = DataCat.objects.get(id = id)
		
		#该分类下的数据
		#test = dataclass.data_set.all()
		#print(test.count())
		
		data_cat_json = model_to_dict(data_cat)
		if data_cat_json["parent_id"] != 0:
			data_cat_json["parent"] = get_by_id(data_cat_json["parent_id"])
		
		return commons_util.res_success("请求成功", data_cat_json)
	except:
		return commons_util.res_fail(1, "找不到该数据")

def add(request):
	post_data = json.loads(request.body.decode("utf-8"))
	
	if "id" not in post_data:
		post_data["id"] = 0
			
	data_cat = None
	if post_data["id"] != 0:
		if post_data["id"] == int(post_data["parent_id"]):
			return commons_util.res_fail(1, "父级分类不能为当前选中分类")
		
		data_cat = DataCat.objects.get(id = post_data["id"])
	else:
		data_cat = DataCat()
	
	data_cat.name = post_data["name"]
	data_cat.parent_id = post_data["parent_id"]
	data_cat.sort = post_data["sort"]
	data_cat.type = post_data["type"]
	data_cat.save()
	
	if post_data["id"] != 0:
		return commons_util.res_success("更新成功")
	else:
		return commons_util.res_success("添加成功")

def data_cat_del(request):
	
	id = int(request.GET.get("id"))
	try:
		data_cat = DataCat.objects.get(id = id)
		
		child_count = DataCat.objects.filter(parent_id = data_cat.id).count()
		if child_count > 0:
			delete_by_id(data_cat.id)
		
		#删除该分类下面的对应数据
		Data.objects.filter(data_cat_id = data_cat.id).delete()
		data_cat.delete()
		
		return commons_util.res_success("删除成功")
	except:
		return commons_util.res_fail(1, "该数据不存在")

