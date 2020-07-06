from django.db import models
from django.conf import settings

class ArtSingle(models.Model):
	id = models.AutoField(primary_key = True)
	name = models.CharField(max_length = 200)
	content = models.TextField()
	
	class Meta:
		db_table = settings.DATABASE_TABLE_PREFIX + 'art_single'
