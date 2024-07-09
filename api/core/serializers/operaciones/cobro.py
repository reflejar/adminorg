from itertools import chain
from .base import *
from .carga import CargaModelSerializer


class CobroModelSerializer(OperacionModelSerializer):
	'''Operacion de debito cobrado a cliente'''

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		if 'cuenta' in self.context.keys():
			self.fields['vinculo'] = serializers.PrimaryKeyRelatedField(
					queryset=Operacion.objects.filter(cuenta=self.context['cuenta'], vinculo__isnull=True), 
					allow_null=True,
				)
			# ReadOnly de los atributos de la operación DEL CREDITO para cuando se está solicitando VER la data
			self.fields['origen'] = CargaModelSerializer(context=self.context, read_only=True, many=False)
