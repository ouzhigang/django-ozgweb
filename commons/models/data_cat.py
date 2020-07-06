from django.db import models
from django.conf import settings

class DataCat(models.Model):
	id = models.AutoField(primary_key = True)
	name = models.CharField(max_length = 200)
	parent_id = models.IntegerField(default = 0)
	sort = models.IntegerField(default = 0)
	type = models.IntegerField(default = 0)
	
	class Meta:
		db_table = settings.DATABASE_TABLE_PREFIX + 'data_cat'
	