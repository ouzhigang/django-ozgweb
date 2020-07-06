from django.db import models
from django.forms.models import model_to_dict
import json, time, html
import commons.commons as commons_util
from commons.models import *
	
#获取分页数据
def get_list(page, page_size, wq = { 'type': 0 }):
	total = Data.objects.filter(**wq).count()
	page_count_s = commons_util.page_count(total, page_size)

	offset = (page - 1) * page_size
	limit = offset + page_size

	data_list = Data.objects.filter(**wq).order_by("-sort", "-id")[offset:limit]
	
	data = []
	for i in data_list:
		item = model_to_dict(i)
		item["add_time_s"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item["add_time"]))
		item["picture"] = json.loads(item["picture"])

		if item["data_cat"] == 0:
			item["dc_name"] = "[无分类]"
		else:
			item["dc_name"] = i.data_cat.name
		
		item["content"] = html.unescape(item["content"])

		data.append(item)

	data = {
		"page_size": page_size,
		"page_count": page_count_s,
		"total": total,
		"page": page,
		"list": data,
	}
	return commons_util.res_success("请求成功", data)

def get(request):		
	try:
		id = request.GET.get("id")
		id = int(id)
		data = Data.objects.get(id = id)
		data = model_to_dict(data)
		data["picture"] = json.loads(data["picture"])
		data["content"] = html.unescape(data["content"])
		return commons_util.res_success("请求成功", data)
	except:
		return commons_util.res_fail(1, "找不到该数据")

def add(request):
	post_data = json.loads(request.body.decode("utf-8"))
	if "id" not in post_data:
		post_data["id"] = 0
	
	if post_data["name"] == "":
		return commons_util.res_fail(1, "名称不能为空")
	elif post_data["content"] == "":
		return commons_util.res_fail(1, "内容不能为空")
	
	data = None
	if post_data["id"] != 0:
		data = Data.objects.get(id = post_data["id"])
		
		if "picture" in post_data:
			data.picture = json.dumps(post_data["picture"])
	else:
		data = Data()
		data.hits = 0
		data.add_time = int(time.time())
		if "picture" in post_data:
			data.picture = json.dumps(post_data["picture"])
		else:
			data.picture = "[]"
	
	data.name = post_data["name"]
	data.content = html.escape(post_data["content"])
	data.data_cat_id = post_data["data_cat_id"] if "data_cat_id" in post_data else 0
	data.sort = post_data["sort"]
	data.type = post_data["type"]
	data.is_index_show = post_data["is_index_show"] if "is_index_show" in post_data else 0
	data.is_index_top = post_data["is_index_top"] if "is_index_top" in post_data else 0
	data.recommend = post_data["recommend"] if "recommend" in post_data else 0
	data.save()
	
	if post_data["id"] != 0:
		return commons_util.res_success("更新成功")
	else:
		return commons_util.res_success("添加成功")

def datadel(request):
	ids = request.GET.get("ids")
	ids = ids.split(",")
	
	if len(ids) == 0:
		return commons_util.res_fail(1, "没有需要删除的数据")
	
	try:
		for id in ids:
			id = int(id)
			
			try:
				data = Data.objects.get(id = id)
				data.delete()
			except:
				return commons_util.res_fail(1, "删除数据id为" + str(id) + "时出现错误")
		
		return commons_util.res_success("删除成功")
	except:
		return commons_util.res_fail(1, "删除数据时出现错误")
