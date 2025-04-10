from .base import *


class CargaModelSerializer(OperacionModelSerializer):
	'''Operacion de creditos realizada a cliente'''

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		fields = Operacion()._meta
		self.fields['cantidad'] = serializers.DecimalField(decimal_places=2, max_digits=15, min_value=0, allow_null=True)
		self.fields["tipo_cambio"] = serializers.DecimalField(decimal_places=2, max_digits=15, min_value=1, allow_null=True)
		self.fields['concepto'] = serializers.PrimaryKeyRelatedField(
					queryset=Cuenta.objects.filter(
							comunidad=self.context['comunidad'], 
							rubro__nombre__in=["ingresos", "gastos", "caja-y-bancos"]
						).order_by(
							'nombre'
						), 
					allow_null=True
				)
		self.fields['proyecto'] = serializers.PrimaryKeyRelatedField(
					queryset=Proyecto.objects.filter(comunidad=self.context['comunidad']).order_by('nombre'), 
					allow_null=True
				)		