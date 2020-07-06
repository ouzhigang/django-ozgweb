from django.db import models
from django.conf import settings

class User(models.Model):
	id = models.AutoField(primary_key = True)
	name = models.CharField(max_length = 200)
	pwd = models.CharField(max_length = 200)
	add_time = models.IntegerField(default = 0)
	is_admin = models.BooleanField(default = False)
	err_login = models.IntegerField(default = 0)
	
	class Meta:
		db_table = settings.DATABASE_TABLE_PREFIX + 'user'
	