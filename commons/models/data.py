from django.db import models
from django.conf import settings
from .data_cat import DataCat

class Data(models.Model):
	id = models.AutoField(primary_key = True)
	name = models.CharField(max_length = 200)
	content = models.TextField()
	
	#on_delete是必须参数，对应的外键就不需要了，外键的命名规则是关联类的小写加上_id，默认情况下关联到关联类的主键，to_field可修改关联类的字段
	data_cat = models.ForeignKey(DataCat, null = True, on_delete = models.CASCADE)
	#关联表后不可以存在外键
	#data_cat_id = models.IntegerField(default = 0)
	sort = models.IntegerField(default = 0)
	type = models.IntegerField(default = 0)	
	hits = models.IntegerField(default = 0)
	picture = models.TextField()
	add_time = models.IntegerField(default = 0)
	is_index_show = models.BooleanField(default = False)
	recommend = models.BooleanField(default = False)
	is_index_top = models.BooleanField(default = False)
	
	class Meta:
		db_table = settings.DATABASE_TABLE_PREFIX + 'data'
