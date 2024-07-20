from django.contrib import admin
from core.models import Rubro


class RubroAdmin(admin.ModelAdmin):
	list_display = ['nombre']
	list_filter = ['nombre']

admin.site.register(Rubro, RubroAdmin)