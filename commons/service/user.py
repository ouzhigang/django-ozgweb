from django.db import models
from django.forms.models import model_to_dict
import json, time, hashlib
import commons.commons as commons_util
from commons.models import *

def get_list(page, page_size):
	total = User.objects.all().count()
	page_count_s = commons_util.page_count(total, page_size)

	offset = (page - 1) * page_size
	limit = offset + page_size
	data_list = User.objects.all().order_by("-id")[offset:limit]

	data_list_json = []
	for data in data_list:		
		item = model_to_dict(data)
		item["add_time_s"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item["add_time"]))
		
		#移除密码
		del item["pwd"]
		data_list_json.append(item)

	data = {
		"page_size": page_size,
		"page_count": page_count_s,
		"total": total,
		"page": page,
		"list": data_list_json,
	}
	return commons_util.res_success("请求成功", data)

def login(request):
	if request.method != 'POST':
		return commons_util.res_fail(1, "请使用POST方式提交")
	
	post_data = json.loads(request.body.decode("utf-8"))
	if "vcode" not in post_data:
		post_data["vcode"] = None
	print(post_data["name"] + "========")
	user = None
	try:
		user = User.objects.get(name = post_data["name"])
	except Exception as e:
		return commons_util.res_fail(1, "没有此用户")
	
	if user.err_login >= 3:
		if post_data["vcode"] == None:
			return commons_util.res_fail(2, "输入错误密码次数过多，需要输入验证码")
		elif post_data["vcode"] == "":
			return commons_util.res_fail(2, "验证码不能为空")
		else:
			ca = commons_util.Captcha(request)
			if ca.check(post_data["vcode"]) == False:
				return commons_util.res_fail(3, "验证码错误")
			
	m = hashlib.md5()
	m.update(post_data["pwd"].encode(encoding = 'UTF-8'))			
	pwd_md5 = m.hexdigest()
			
	if user.pwd == pwd_md5:
		user.err_login = 0
		user.save()
		
		user = model_to_dict(user)
		del(user["pwd"])
		request.session["user"] = user
				
		return commons_util.res_success("登录成功", user)
	else:
		user.err_login += 1
		user.save()
		return commons_util.res_fail(1, "密码错误")

def updatepwd(request):
	
	curr_user = request.session.get("user")
	post_data = json.loads(request.body.decode("utf-8"))
	
	if post_data["old_pwd"] == "":
		return commons_util.res_fail(1, "旧密码不能为空")
	if post_data["pwd"] == "":
		return commons_util.res_fail(1, "新密码不能为空")
	if post_data["pwd"] != post_data["pwd2"]:
		return commons_util.res_fail(1, "确认密码不正确")
	
	m = hashlib.md5()
	m.update(post_data["old_pwd"].encode(encoding = 'UTF-8'))			
	post_data["old_pwd"] = m.hexdigest()
	
	try:
		user = User.objects.get(name = curr_user["name"], pwd = post_data["old_pwd"])
		
		m = hashlib.md5()
		m.update(post_data["pwd"].encode(encoding = 'UTF-8'))			
		post_data["pwd"] = m.hexdigest()
		
		user.pwd = post_data["pwd"]
		user.save()
	
		return commons_util.res_success("修改密码成功")
	except:
		return commons_util.res_fail(1, "旧密码不正确")
	
def add(request):
	post_data = json.loads(request.body.decode("utf-8"))
	
	if post_data["name"] == "":
		return commons_util.res_fail(1, "用户名不能为空")
	if post_data["pwd"] == "":
		return commons_util.res_fail(1, "密码不能为空")
	
	total = User.objects.filter(name = post_data["name"]).count()
	if total > 0:
		return commons_util.res_fail(1, "该用户已存在")
	
	user = User(
		name = post_data["name"],
		pwd = post_data["pwd"],
		add_time = int(time.time())
	)
	user.save()
	
	return commons_util.res_success("添加成功", model_to_dict(user))
	
def userdel(request):
	
	ids = request.GET.get("ids")
	ids = ids.split(",")
	
	if len(ids) == 0:
		return commons_util.res_fail(1, "没有需要删除的数据")
	
	try:
		curr_user = request.session.get("user")
		for id in ids:
			id = int(id)
			if curr_user["id"] == id:
				return commons_util.res_fail(1, "不能删除自己")
			
			try:
				user = User.objects.get(id = id)
				user.delete()
			except:
				return commons_util.res_fail(1, "删除数据id为" + str(id) + "时出现错误")
		
		return commons_util.res_success("删除成功")
	except:
		return commons_util.res_fail(1, "删除数据时出现错误")
