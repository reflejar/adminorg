from django.db import models

class Taxon(models.Model):
	rubro = models.ForeignKey("core.Rubro", related_name="taxones", on_delete=models.PROTECT)
	nombre = models.CharField(max_length=100)

	def __str__(self):

		return self.nombre

