from rest_framework import serializers

from django_afip.models import CurrencyType
from core.models import (
	Operacion,
	Cuenta,
	Proyecto
)


class OperacionModelSerializer(serializers.ModelSerializer):
	'''Operacion model serializer'''
	
	class Meta:
		model = Operacion

		fields = (
			'id',
			'detalle',
		)
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.fields['monto'] = serializers.DecimalField(decimal_places=2, max_digits=15)
		self.fields['total_pesos'] = serializers.DecimalField(decimal_places=2, max_digits=15)

		# ReadOnly
		self.fields['moneda'] = serializers.CharField(read_only=True)
		self.fields['tipo_cambio'] = serializers.DecimalField(decimal_places=2, max_digits=15, read_only=True)
		self.fields['saldo'] = serializers.DecimalField(decimal_places=2, max_digits=15, read_only=True)
		


	def to_representation(self, instance):
		representation = super().to_representation(instance)
		representation['moneda'] = instance.moneda.description
		representation['comprobante'] = str(instance.comprobante)
		representation['saldo'] = instance.monto - instance.saldo()
		return representation
