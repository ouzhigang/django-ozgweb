
from django.urls import path
import mgr.views.index, mgr.views.other, mgr.views.user, mgr.views.art_single, mgr.views.data, mgr.views.data_cat

app_name = 'mgr'

urlpatterns = [
	#登录页面
	path('index/login', mgr.views.index.login),
	
	#验证码
	path('index/getvcode', mgr.views.index.getvcode),
	
	#需要登录的
	path('other/server_info', mgr.views.other.server_info),
	path('other/logout', mgr.views.other.logout),
	path('user/updatepwd', mgr.views.user.updatepwd),
	path('user/show', mgr.views.user.show),
	path('user/add', mgr.views.user.add),
	path('user/del', mgr.views.user.userdel),
	path('art_single/get', mgr.views.art_single.get),
	path('art_single/update', mgr.views.art_single.update),	
	path('data/show', mgr.views.data.show),
	path('data/get', mgr.views.data.get),
	path('data/add', mgr.views.data.add),
	path('data/del', mgr.views.data.datadel),
	path('data/upload', mgr.views.data.upload),
	path('data_cat/show', mgr.views.data_cat.show),
	path('data_cat/get', mgr.views.data_cat.get),
	path('data_cat/add', mgr.views.data_cat.add),
	path('data_cat/del', mgr.views.data_cat.data_cat_del),
]
