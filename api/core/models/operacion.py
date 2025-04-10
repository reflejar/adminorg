from decimal import Decimal
from datetime import date
import pandas as pd

from django.db import models
from django_pandas.io import read_frame
from decimal import Decimal
from django_afip.models import CurrencyType

from utils.models import BaseModel
from core.models import Cuenta, Comprobante, Proyecto

class Operacion(BaseModel):

	"""
		Modelo de de operaciones
		Representa la operacion contable en su minima expresion
		Es la tabla madre donde se vuelcan todas las operaciones de las comunidades
	"""

	fecha = models.DateField(blank=True, null=True) # Fecha principal y contable. Con ella se ordenan las operaciones/evaluar eliminar
	periodo = models.DateField(blank=True, null=True) # Fecha indicativa de periodo para diversas cuestiones/evaluar eliminar
	asiento = models.CharField(max_length=30)
	cuenta = models.ForeignKey(Cuenta, on_delete=models.PROTECT, related_name="operaciones")
	concepto = models.ForeignKey(Cuenta, blank=True, null=True, on_delete=models.PROTECT, related_name="conceptos")
	proyecto = models.ForeignKey(Proyecto, blank=True, null=True, on_delete=models.SET_NULL, related_name="operaciones")
	comprobante = models.ForeignKey(Comprobante, blank=True, null=True, on_delete=models.PROTECT, related_name="operaciones")
	cantidad = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
	valor = models.DecimalField(max_digits=9, decimal_places=2)
	moneda = models.ForeignKey(CurrencyType, on_delete=models.PROTECT, related_name="operaciones")
	tipo_cambio = models.DecimalField(max_digits=9, decimal_places=2)
	total_pesos = models.DecimalField(max_digits=9, decimal_places=2)
	vinculo = models.ForeignKey("self", blank=True, null=True, on_delete=models.SET_NULL, related_name="vinculos")
	fecha_vencimiento = models.DateField(blank=True, null=True)
	detalle = models.CharField(max_length=150, blank=True, null=True)
	descripcion = models.CharField(max_length=150, blank=True, null=True)

	# Funciones Serializadoras
	@property
	def rubro(self):
		return self.cuenta.rubro.nombre

	@property
	def monto(self):
		""" Devuelve el valor en positivo siempre """
		if self.comprobante.receipt.currency != self.moneda:
			return abs(self.valor/self.comprobante.receipt.currency_quote)
		return abs(self.valor)

	@property
	def debe(self):
		""" Devuelve el debe """
		return self.valor if self.valor > 0 else 0
	
	@property
	def haber(self):
		""" Devuelve el haber """
		return -self.valor if self.valor < 0 else 0		

	def destinatario(self):
		""" Devuelve la Cuenta(cliente) por la que se creó el credito """
		return self.cuenta


	def origen(self):
		return self.vinculo

	def causante(self):
		if self.comprobante.destinatario:
			return self.comprobante.destinatario.rubro.nombre
		if self.comprobante.receipt.receipt_type.code == "303":
			return "caja-y-bancos"
		if self.comprobante.receipt.receipt_type.code == "400":
			return "asiento"

	def titulo(self):
		return self.cuenta.titulo


	@classmethod
	def mayores(cls, cuentas, fecha=None):	
		fecha = fecha if fecha else date.today()
		if isinstance(cuentas.first(), Proyecto):
			queryset = cls.get_model('Operacion').objects.filter(
					proyecto__id__in=[cuentas.values_list('id', flat=True)], 
					cuenta__rubro__nombre__in=["creditos"],
					valor__gte=0
					# fecha__lte=fecha,
				).order_by('-fecha', '-comprobante__id')
		else:
			queryset = cls.get_model('Operacion').objects.filter(
					cuenta__id__in=[cuentas.values_list('id', flat=True)], 
					# fecha__lte=fecha,
				).order_by('-fecha', '-comprobante__id')
		df = read_frame(queryset, fieldnames=['fecha', 'cuenta', 'cuenta__rubro', 'comprobante', 'concepto', 'proyecto__nombre', 'periodo', 'valor', 'total_pesos', 'detalle', 'comprobante__id', 'comprobante__receipt__receipt_type', 'cuenta__titulo__numero', 'cantidad', 'moneda__description', "tipo_cambio"])
		df['direccion'] = df['cuenta__titulo__numero'].apply(lambda x: 1 if str(x)[0] in ["1"] else -1)
		df['fecha'] = pd.to_datetime(df['fecha'])
		df['fecha'] = df['fecha'].dt.strftime('%Y-%m-%d')
		df['periodo'] = pd.to_datetime(df['periodo'])
		df['periodo'] = df['periodo'].dt.strftime('%Y-%m')		
		df = df.rename(columns={'comprobante__receipt__receipt_type': 'receipt_type', 'proyecto__nombre': 'proyecto', 'moneda__description': 'moneda'})
		df['saldo'] = df['total_pesos'][::-1].cumsum()
		df['debe'] = df['total_pesos'].apply(lambda x: x if x > 0 else 0)
		df['haber'] = df['total_pesos'].apply(lambda x: x if x < 0 else 0)
		df['monto'] = df['total_pesos']*df['direccion']
		df['saldo'] = df['saldo']*df['direccion']
		return df	

	@classmethod
	def saldos(cls, cuentas, fecha=None):	
		fecha = fecha if fecha else date.today()
		modulo = cuentas[0].rubro.nombre
		df = read_frame(cls.get_model('Operacion').objects.filter(
				cuenta__id__in=[cuentas.values_list('id', flat=True)], 
				comprobante__isnull=False,
				comprobante__fecha_anulacion__isnull=True,
			), fieldnames=['id', 'fecha', 'comprobante', 'concepto', 'proyecto__nombre', 'periodo','valor', 'detalle', 'comprobante__id', 'comprobante__receipt__receipt_type', 'vinculo__id', 'cuenta__titulo__numero', 'cuenta__rubro', 'fecha_vencimiento', 'moneda__description', "tipo_cambio"])
		df['direccion'] = df['cuenta__titulo__numero'].apply(lambda x: 1 if str(x)[0] in ["1"] else -1)
		df['fecha'] = pd.to_datetime(df['fecha'])
		df['fecha'] = df['fecha'].dt.strftime('%Y-%m-%d')
		df['fecha_vencimiento'] = pd.to_datetime(df['fecha_vencimiento'])
		df['fecha_vencimiento'] = df['fecha_vencimiento'].dt.strftime('%Y-%m-%d')		
		df['periodo'] = pd.to_datetime(df['periodo'])
		df['periodo'] = df['periodo'].dt.strftime('%Y-%m')
		df = df.rename(columns={'comprobante__receipt__receipt_type': 'receipt_type', 'proyecto__nombre': 'proyecto', 'moneda__description': 'moneda'})
		
		# Si es cliente o proveedor, el saldo se obtiene desde el vinculo.

		df['detalle'] = df['detalle'].fillna("")
		if modulo in ["creditos", "deudas"]:
			df['identifier'] = df['id'].astype(int).astype(str)
			df['cancela'] = df['vinculo__id'].fillna(0).astype(int).astype(str).replace('0', '')
			pagos_capital = df.groupby('cancela')['valor'].sum().reset_index()
			pagos_capital.columns = ['cancela', 'valor']
			pagos_capital = pagos_capital.rename(columns={'cancela': 'identifier', 'valor': 'pago_capital'})
			df = df.merge(pagos_capital, how='left', on='identifier')
			df = df[df['cancela']==""]

		elif modulo in ["caja-y-bancos"]:
			taxon = cuentas[0].taxon.nombre
			if taxon == "cheques":	
				df['identifier'] = df['detalle']
				df['pago_capital'] = df.groupby('identifier')['valor'].transform('sum')
				df = df.drop_duplicates(subset='identifier', keep='first')
				df['valor'] = 0
			else:
				df['pago_capital'] = df.groupby(['moneda', "tipo_cambio"])['valor'].transform('sum')
				df = df.drop_duplicates(subset=['moneda', "tipo_cambio"], keep='first')
				# df['valor'] = 0
				# suma = df['valor'].sum()
				# df = df.head(1)
				# df['pago_capital'] = suma
				df['valor'] = 0

		df['pago_capital'] = df['pago_capital'].fillna(Decimal(0.00))


		df['saldo'] = df['valor'] + df['pago_capital']
		df['saldo'] = df['saldo'].fillna(df['valor'])
		df['monto'] = df['valor']*df['direccion']
		df = df[df['saldo']!=0]
		df['pago_capital'] = df['pago_capital']*df['direccion']
		df['saldo'] = df['saldo']*df['direccion']
		return df




	# Funciones muestrales
	def pagos_capital(self, fecha=None):
		"""
			Retorna QUERYSET de pagos realizados de capital
		"""
		fecha = fecha if fecha else date.today()
		return Operacion.objects.filter(
				vinculo=self, 
				cuenta=self.cuenta, 
				fecha__lte=fecha, 
				comprobante__fecha_anulacion__isnull=True
			).order_by('fecha')

	def pago_capital(self, fecha=None):
		"""
			Retorna VALOR de Pago total del capital
		"""
		fecha = fecha if fecha else date.today()
		calculo = self.pagos_capital(fecha=fecha).aggregate(calculo=models.Sum('valor'))['calculo'] or 0
		return abs(calculo)

	def saldo(self, fecha=None):
		"""
			Retorna siempre positivo
		"""
		fecha = fecha if fecha else date.today()
		return abs(self.valor) - abs(self.pago_capital(fecha=fecha))
