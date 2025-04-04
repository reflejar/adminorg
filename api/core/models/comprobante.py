from __future__ import unicode_literals
import json
import base64
from functools import reduce
from datetime import date

from django.db.models import Max
from django.db import models
from django.apps import apps
from django_afip.models import (
	Receipt,
	ReceiptType
)
from django_afip.pdf import ReceiptBarcodeGenerator

from utils.models import BaseModel
from core.models.own_receipt import OwnReceipt
from core.models.pdf import PDF


class Comprobante(BaseModel):
	"""
		Modelo de Comprobantes
		Representa TODOS los comprobantes posibles de la entidad
		Todas las operaciones tienen comprobante, si no la tienen el comprobante se llama Asiento Contable
		attr receipt es para realizar envio a afip (solo clientes)
		attr own_receipt se establece SIEMPRE. (Copia la data de receipt en el caso de cliente, en los otros casos se establece directamente aqui) 
	"""

	receipt_afip = models.ForeignKey(Receipt, blank=True, null=True, on_delete=models.PROTECT, related_name="comprobantes") # Solo para "clientes"
	receipt = models.ForeignKey(OwnReceipt, blank=True, null=True, on_delete=models.PROTECT, related_name="comprobantes") # Todos
	destinatario = models.ForeignKey("core.Cuenta", blank=True, null=True, on_delete=models.SET_NULL, related_name="comprobantes")
	pdf = models.ForeignKey("core.PDF", blank=True, null=True, on_delete=models.SET_NULL, related_name="comprobantes")
	descripcion = models.CharField(max_length=150, blank=True, null=True)
	link = models.URLField(max_length=300, blank=True, null=True)
	fecha_operacion = models.DateField()
	fecha_anulacion = models.DateField(blank=True, null=True)

	def __str__(self):
		nombre = str(self.receipt)
		return nombre

	def nombre(self):
		return str(self.receipt)

	def tipo(self):
		return str(self.receipt.receipt_type)

	def numero(self):
		return str(self.receipt.formatted_number)		


	# Funciones serializadoras
	def cargas(self):
		""" Cargas generadas"""
		identifier = self.operaciones.first().asiento
		filtro = {
			'asiento':identifier,
			'cuenta':self.destinatario,
			'vinculo__isnull':True,
		}
		if self.destinatario.direccion == 1:
			filtro.update({'valor__gt': 0})
		else:
			filtro.update({'valor__lt': 0})
		return self.get_model('Operacion').objects.filter(**filtro)


	def cobros(self):
		""" Cobros hechos """
		identifier = self.operaciones.first().asiento
		filtro = {
			'asiento':identifier,
			'cuenta':self.destinatario,
			'vinculo__isnull':False,
		}
		if self.destinatario.direccion == 1:
			filtro.update({'valor__lt': 0})
		else:
			filtro.update({'valor__gt': 0})		
		return self.get_model('Operacion').objects.filter(**filtro).exclude(vinculo__comprobante=self)
	

	def descargas(self):
		""" Formas de pago """		
		identifier = self.operaciones.first().asiento
		filtro = {
			'asiento': identifier,
			'vinculo__isnull': True,
			'cuenta__rubro__nombre__in': ["caja-y-bancos", "ingresos", "gastos"],
		}

		if self.destinatario.direccion == 1:
			filtro.update({'valor__gt': 0})
		else:
			filtro.update({'valor__lt': 0})

		if self.destinatario.rubro.nombre in ["caja-y-bancos", "ingresos", "gastos"]:
			return []
		return self.get_model('Operacion').objects.filter(**filtro)




	def pagos_recibidos(self):
		""" Esto retorna el ultimo pago si es que el saldo es distinto al valor original """
		identifier = self.operaciones.first().asiento	
		deudas_generadas = self.get_model('Operacion').objects.filter(
			asiento=identifier,
			cuenta__rubro__nombre__in=["creditos", "deudas"], 
			vinculo__isnull=True
		)
		if deudas_generadas:
			comprobantes = []

			for d in deudas_generadas:
				if d.saldo() != d.monto:
					for p in d.pagos_capital():
						comprobantes.append(p.comprobante)
			return set(comprobantes)
		return 
		
	def debe(self):
		""" Esto retorna el todas las operaciones que van en el debe """
		identifier = self.operaciones.first().asiento
		return self.get_model('Operacion').objects.filter(
			asiento=identifier,
			valor__gt=0,
		).exclude(descripcion="ANULACION")
	
	def haber(self):
		""" Esto retorna el todas las operaciones que van en el haber """
		identifier = self.operaciones.first().asiento
		return self.get_model('Operacion').objects.filter(
			asiento=identifier,
			valor__lt=0,
		).exclude(descripcion="ANULACION")

	def anulacion_comprobantes(self, comprobantes_relacionados):
		"""
			Genera los comprobantes necesarios de anulacion de los automaticos
			ANOTACION TEMPORAL: Como solo se está usando Facturas tipo X
			No está generando las nc por nd ni viceversa... solo le pone fecha de anulacion
		"""
		comprobantes = {
			'original': self,
			'nc-automatica': None,
			'nd-automatica': None,
			'nc-automatica-anulacion': None,
			'nd-automatica-anulacion': None
		}		
		if len(comprobantes_relacionados) > 1:
			for d in comprobantes_relacionados:
				if d != self:
					d.fecha_anulacion = self.fecha_anulacion
					d.save()


		return comprobantes

	def anular(self, fecha=None):
		fecha = fecha if fecha else date.today()
		""" Esto duplica las operaciones pero reversadas y con la fecha recibida """
		fecha = self.fecha_operacion # Hacemos que impacte el mismo dia de la realizacion del comprobante
		self.fecha_anulacion = fecha # Logica bien hecha... hay que hacer que react envie la fecha
		self.save()
		self.hacer_pdf()
		identifier = self.operaciones.first().asiento
		operaciones = self.get_model('Operacion').objects.filter(asiento=identifier)
		comprobantes_generados = set([o.comprobante for o in operaciones])
		comprobantes = self.anulacion_comprobantes(comprobantes_generados)


		for i in operaciones:
			id_i = int(i.id)
			i.pk = None
			i.valor = -i.valor
			i.fecha = fecha
			i.descripcion = "ANULACION"
			i.save()

	def eliminar_operaciones(self):
		identifier = self.operaciones.first().asiento
		operaciones = self.get_model('Operacion').objects.filter(asiento=identifier)	
		operaciones.delete()

	def eliminar(self):
		""" Esto UNICAMENTE DEUDAS CON PROVEEDORES """
		self.eliminar_operaciones()
		receipt = self.receipt
		self.receipt = None
		self.save()
		receipt.delete()
		self.delete()

	def chequear_numeros(self):
		if not self.receipt.receipt_number:
			if self.receipt_afip:
				self.receipt.receipt_number = self.receipt_afip.receipt_number
			else:
				last = Comprobante.objects.filter(
					comunidad=self.comunidad,
					receipt__receipt_type=self.receipt.receipt_type,
					receipt__point_of_sales=self.receipt.point_of_sales,
					destinatario__rubro=self.destinatario.rubro if self.destinatario else None
				).aggregate(Max('receipt__receipt_number'))['receipt__receipt_number__max'] or 0

				self.receipt.receipt_number = last + 1
			self.receipt.save()		

	@property
	def causante(self):
		if self.destinatario:
			return self.destinatario.rubro.nombre
		if self.receipt.receipt_type.code == "303":
			return "caja-y-bancos"
		if self.receipt.receipt_type.code == "400":
			return "asiento"


	def generate_context_pdf(self):
		
		def fillna(dispatcher):
			return str(dispatcher) if dispatcher else ''

		if self.comunidad.contribuyente.certificate and \
		self.destinatario.rubro.nombre == "creditos" and \
		self.receipt.receipt_type.code in ['11', '12', '13']:

			generator = ReceiptBarcodeGenerator(self.receipt_afip)
			barcode = base64.b64encode(generator.generate_barcode()).decode("utf-8")
		else:
			barcode = None

		header_fields = {
			'DOC_TIPO': fillna(self.receipt.receipt_type),
			'DOC_NUM': fillna(self.receipt.formatted_number),
			'DOC_CODIGO': fillna(self.receipt.receipt_type.code),
			'DOC_FECHA': fillna(self.receipt.issued_date.strftime("%d/%m/%Y")),
			'DOC_TOTAL': fillna(self.receipt.total_amount),
			
			'AFIP_CAE': fillna(self.receipt_afip.validation.cae if self.receipt_afip else None),
			'AFIP_CAE_EXPIRATION': fillna(self.receipt_afip.validation.cae_expiration if self.receipt_afip else None),
			'BARCODE': barcode,

			'COMUNIDAD_LOGO': fillna(self.comunidad.logo if self.comunidad.logo else None),
			'COMUNIDAD_NOMBRE': fillna(self.comunidad),
			'COMUNIDAD_DOMICILIO': fillna(self.comunidad.domicilio),
			'COMUNIDAD_CUIT': fillna(self.comunidad.contribuyente.cuit),
			'COMUNIDAD_ACTIVIDAD': fillna(self.comunidad.contribuyente.active_since.strftime("%d/%m/%Y")),
			
			'TITULAR_NOMBRE': fillna(self.destinatario),
			'TITULAR_DOC_TIPO': fillna(self.destinatario.perfil.tipo_documento if self.destinatario.perfil else None),
			'TITULAR_DOC_NUM': fillna(self.destinatario.perfil.numero_documento if self.destinatario.perfil else None),

			'ANULACION': fillna(self.fecha_anulacion.strftime("%d/%m/%Y") if self.fecha_anulacion else None),
			'FECHA_OP': fillna(self.fecha_operacion.strftime("%d/%m/%Y") if self.fecha_operacion else None),
			'DESCRIPCION': fillna(self.descripcion),
		}

		
		fields_operacion = {
			'cuenta': 'CUENTA',
			'concepto': 'CONCEPTO',
			'periodo': 'PERIODO',
			'monto': 'MONTO',
			'valor': 'VALOR',
			'detalle': "DETALLE",
		}
		content_fields = {
			'CARGAS': [],
			'COBROS': [],
			'DESCARGAS': [],
		}
		for key in content_fields.keys():
			list_objects = []
			try:
				for op in getattr(self, key.lower())():
					new_obj = {}
					for f in fields_operacion.keys():
						if "." in f:
							try:
								dispatcher = reduce(getattr, f.split("."), op)
							except:
								pass
						else:
							try:
								dispatcher = getattr(op, f, None)
							except:
								pass
						if callable(dispatcher):
							dispatcher = dispatcher()
						new_obj[fields_operacion[f]] = fillna(dispatcher)
					list_objects.append(new_obj)

				content_fields[key] = list_objects
			except:
				pass
		result = {**header_fields, **content_fields}
		
		return json.dumps(result)		

	# Funciones Operativas
	def hacer_pdf(self):
		
		if self.pdf:
			self.pdf.delete()

		if self.receipt.receipt_type.code == "400":
			return 

		if self.destinatario:
			if self.destinatario.rubro.nombre == "deudas" and self.receipt.receipt_type.code != "301":
				return 			

		self.pdf = PDF.objects.create(comunidad=self.comunidad,context=self.generate_context_pdf())
		
		self.save()

		
