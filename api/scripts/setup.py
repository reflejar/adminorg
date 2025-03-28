# /api/scripts/initial_data.py
import json
from datetime import date
from core.models import *
from django_afip.models import *
from django.contrib.auth.models import Group
from users.models import *
from utils.models import *

def crer_superusuario():
	"""Creación de superusuario"""
	username = input("username: ")
	password = input("password: ")
	nombre = input("nombre: ")
	apellido = input("apellido: ")
	email = input("email: ")
	superuser = User.objects.create(
		username=username,
		first_name=nombre,
		last_name=apellido,
		email=email,
		is_staff=True,
		is_active=True,
		is_superuser=True
	)

	superuser.set_password(password)
	superuser.save()


def crear_cosas_de_afip():
	"""Crear cosas necesarias para el funcionamiento de AFIP"""
	# Tipos de comprobantes
	receipt_types = open('/api/scripts/receipt_types.json', 'r')
	data = json.load(receipt_types)
	for d in data:
		ReceiptType.objects.create(**d)

	# Tipos de conceptos
	concept_types = open('/api/scripts/concept_types.json', 'r')
	data = json.load(concept_types)
	for d in data:
		ConceptType.objects.create(**d)		

	# Tipos de documento
	document_types = open('/api/scripts/document_types.json', 'r')
	data = json.load(document_types)
	for d in data:
		DocumentType.objects.create(**d)		

	# Tipos de moneda
	currency_types = open('/api/scripts/currency_types.json', 'r')
	data = json.load(currency_types)
	for d in data:
		CurrencyType.objects.create(**d)		


def crear_grupos():
	"""Crear grupos operativo, contable y directivo"""
	Group.objects.create(
		name="operativo"
	)	
	Group.objects.create(
		name="contable"
	)
	Group.objects.create(
		name="directivo"
	)

def crear_cosas_core_de_aplicacion():
	"""Crear cosas necesarias para el funcionamiento del core"""
	# Crear Rubros
	rubros = open('/api/scripts/rubros.json', 'r')
	data = json.load(rubros)
	for d in data:
		Rubro.objects.create(**d)

	# Crear Taxones
	taxones = open('/api/scripts/taxones.json', 'r')
	data = json.load(taxones)
	for d in data:
		Taxon.objects.create(**d)				

	# Crear Provincias
	provincias = open('/api/scripts/provincias.json', 'r')
	data = json.load(provincias)
	for d in data:
		Provincia.objects.create(**d)		

	# Crear Tipos de comunidad
	tipos_comunidad = open('/api/scripts/tipos_comunidad.json', 'r')
	data = json.load(tipos_comunidad)
	for d in data:
		TipoComunidad.objects.create(**d)		

def crear_comunidad():
	"""Crear una nueva comunidad"""
	nombre = input("nombre de la comunidad: ")
	cuit = input("CUIT de la comunidad: ")
	provincia = input("Provincia de la comunidad: ")
	localidad = input("Localidad de la comunidad: ")
	calle = input("Domicilio de la comunidad: ")
	logo = input("URL de Logo de la comunidad: ")
	

	contribuyente = TaxPayer.objects.create(
		name=nombre,
		cuit=cuit,
		active_since=date.today(),
		is_sandboxed=True,
	)
	TaxPayerProfile.objects.create(
		taxpayer=contribuyente,
		issuing_name=nombre,
		issuing_address=calle,
		gross_income_condition=cuit,
		sales_terms="Cuenta corriente",
		vat_condition="IVA Exento"

	)
	PointOfSales.objects.create(
		number="0001",
		issuance_type="CAE - Exento",
		blocked=True,
		owner=contribuyente
	)

	domicilio = Domicilio.objects.create(
		provincia = Provincia.objects.get(nombre=provincia),
		localidad=localidad,
		calle=calle
	)

	comunidad = Comunidad.objects.create(
		contribuyente=contribuyente,
		nombre=nombre,
		abreviatura=nombre.lower()[:5],
		tipo=TipoComunidad.objects.get(codigo_afip="0"),
		domicilio=domicilio,
		logo=logo
	)

	# Crear Plan de cuentas basico
	ACTIVO = Titulo.objects.create(comunidad=comunidad, nombre="ACTIVO", numero=100000)
	PASIVO = Titulo.objects.create(comunidad=comunidad, nombre="PASIVO", numero=200000)
	PATRIMONIO_NETO= Titulo.objects.create(comunidad=comunidad, nombre="PATRIMONIO NETO", numero=300000)
	RECURSOS = Titulo.objects.create(comunidad=comunidad, nombre="RECURSOS", numero=400000, predeterminado_id=13)
	GASTOS = Titulo.objects.create(comunidad=comunidad, nombre="GASTOS", numero=500000, predeterminado_id=14)
	TESORERIA = Titulo.objects.create(comunidad=comunidad, nombre="TESORERIA", numero=111101, supertitulo=ACTIVO, predeterminado_id=1)
	CUENTAS_A_COBRAR = Titulo.objects.create(comunidad=comunidad, nombre="CUENTAS A COBRAR", numero=112101, supertitulo=ACTIVO, predeterminado_id=3)
	BIENES_DE_CAMBIO = Titulo.objects.create(comunidad=comunidad, nombre="BIENES DE CAMBIO", numero=113101, supertitulo=ACTIVO, predeterminado_id=4)
	PROVEEDORES = Titulo.objects.create(comunidad=comunidad, nombre="PROVEEDORES", numero=211101, supertitulo=PASIVO, predeterminado_id=10)		
		
	# Crear usuario operativo?
	username = input("Usuario operativo - username: ")
	password = input("Usuario operativo - password: ")
	nombre = input("Usuario operativo - nombre: ")
	apellido = input("Usuario operativo - apellido: ")
	email = input("Usuario operativo - email: ")
	user_admin = User.objects.create(
		username=username,
		first_name=nombre,
		last_name=apellido,
		email=email,
		is_active=True,
		is_verified=True,
	)
	user_admin.set_password(password)
	user_admin.save()
	user_admin.groups.add(Group.objects.get(name='operativo'))

	perfil_admin = Perfil.objects.create(
		comunidad=comunidad,
		nombre=f'{nombre} {apellido}',
	)
	perfil_admin.users.add(user_admin)

	# Creación de cuentas de tesoreria
	## Efectivo en $
	Cuenta.objects.create(
		comunidad=comunidad,
		titulo=TESORERIA,
		rubro_id=1,
		taxon_id=1,
		moneda_id=1,
		nombre="Efectivo",
	)
	## Efectivo en U$D
	Cuenta.objects.create(
		comunidad=comunidad,
		titulo=TESORERIA,
		rubro_id=1,
		taxon_id=1,
		moneda_id=2,
		nombre="Efectivo",
	)	
	
	# Creación de cuentas de resultados
	## Donaciones
	Cuenta.objects.create(
		comunidad=comunidad,
		titulo=RECURSOS,
		rubro_id=13,
		moneda_id=1,
		nombre="Donaciones",
	)
	## Resultado (+) TC
	Cuenta.objects.create(
		comunidad=comunidad,
		titulo=RECURSOS,
		rubro_id=13,
		taxon_id=12,
		moneda_id=1,
		nombre="Resultado (+) TC",
	)
	## Sueldos
	Cuenta.objects.create(
		comunidad=comunidad,
		titulo=GASTOS,
		rubro_id=14,
		moneda_id=1,
		nombre="Sueldos",
	)

	## Gastos Oficina Administración
	Cuenta.objects.create(
		comunidad=comunidad,
		titulo=GASTOS,
		rubro_id=14,
		moneda_id=1,
		nombre="Gastos Oficina Administración",
	)
	
	## Gastos Varios
	Cuenta.objects.create(
		comunidad=comunidad,
		titulo=GASTOS,
		rubro_id=14,
		moneda_id=1,
		nombre="Gastos Varios",
	)	
	## Resultado (-) TC
	Cuenta.objects.create(
		comunidad=comunidad,
		titulo=GASTOS,
		rubro_id=14,
		taxon_id=13,
		moneda_id=1,
		nombre="Resultado (-) TC",
	)	


def run():
	solicitudes = [
		crer_superusuario,
		crear_cosas_de_afip,
		crear_grupos,
		crear_cosas_core_de_aplicacion,
		crear_comunidad,
	]
	for func in solicitudes:
		nombre_funcion = ' '.join(func.__name__.split('_'))
		print("#########################")
		print(func.__doc__)
		consulta = input(f"¿Querés {nombre_funcion}? ('s' para crear / nada para cancelar): ")
		if consulta.lower() == "s":
			func()
		else:
			print(" ".join([nombre_funcion, "cancelada"]))
	print("¡Instalación terminada!")


	


	
	
	# Crear cosas de Utils: Modulos, Provincias, Tipos de Comunidad 

