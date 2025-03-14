from django.contrib import admin
from core.models import Operacion
from import_export.admin import ImportExportMixin


class OperacionAdmin(ImportExportMixin, admin.ModelAdmin):
	list_display = ['cuenta', 'comprobante', 'moneda', 'valor', "tipo_cambio", 'total_pesos']
	list_filter = ['comunidad', 'cuenta__rubro']

admin.site.register(Operacion, OperacionAdmin)
