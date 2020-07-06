import os, sys
from django.utils.deprecation import MiddlewareMixin
import commons.commons as commons_util

class MgrMiddleware(MiddlewareMixin):
	def process_request(self, request):
		#除了不需要登录的页面，其余页面全部都检查一次有没有登录
		if "/index/login" not in request.path and "/index/getvcode" not in request.path:
			if not request.session.get("user", False):
				return commons_util.res_fail(1, "需要登录才可以访问")
 
	def process_response(self, request, response):
		return response