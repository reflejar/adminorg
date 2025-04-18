from django.contrib import admin
from core.models import Taxon


class TaxonAdmin(admin.ModelAdmin):
	list_display = ['nombre']
	list_filter = ['rubro']

admin.site.register(Taxon, TaxonAdmin)
