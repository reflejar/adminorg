import json
import pandas as pd
from datetime import datetime, date
from django.http import Http404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404 
from decimal import Decimal

from django_afip.models import CurrencyType
from users.permissions import IsAccountOwner, IsComunidadMember, IsOperativoUser
from utils.generics import custom_viewsets

from core.filters.operacion import OperacionFilter

from core.models import (
	Cuenta,
	Operacion,
	Titulo,
	Proyecto
)


class ReportesViewSet(custom_viewsets.CustomModelViewSet):
	"""
		Mayores, estado de saldos y reportes generales
	"""
	
	http_method_names = ['get']

	filterset_class = OperacionFilter


	def get_queryset(self, **kwargs):
		fecha = datetime.strptime(self.request.GET['end_date'], "%Y-%m-%d").date() if 'end_date' in self.request.GET.keys() else date.today()
		objects = self.get_object()
		if self.kwargs['tipo'] == "saldos":
			datos = Operacion.saldos(cuentas=objects, fecha=fecha)
		elif self.kwargs['tipo'] in ["movimientos", "analisis"]:
			datos = Operacion.mayores(cuentas=objects, fecha=fecha)
		return datos

	def get_permissions(self):
		'''Manejo de permisos'''
		permissions = [IsAuthenticated, IsComunidadMember]
		if self.request.user.groups.all()[0].name == "operativo": permissions.append(IsOperativoUser)
		return [p() for p in permissions]

	def get_object(self):
		if 'pk' in self.kwargs.keys():
			if 'titulo' in self.request.GET.keys():
				titulo = Titulo.objects.get(id=self.kwargs["pk"])
				obj = Cuenta.objects.filter(comunidad=self.comunidad, titulo=titulo)
			else:
				obj = Cuenta.objects.filter(comunidad=self.comunidad, pk=self.kwargs["pk"])
		else:
			if 'analizar' in self.request.GET.keys():
				if 'proyecto' in self.request.GET['analizar']:
					obj = Proyecto.objects.filter(comunidad=self.comunidad)
				else: 
					obj = Cuenta.objects.filter(comunidad=self.comunidad, rubro__nombre__in=self.request.GET['analizar'].split(","))
		# self.check_object_permissions(self.request, obj)
		return obj
		

	def retrieve(self, request, pk=None, **kwargs):
		df = self.get_queryset()
		# filtro = self.filter.data
		return Response({'data': json.loads(df.to_json(orient="records"))})
	
	def list(self, request, pk=None, **kwargs):
		df = self.get_queryset()
		totalizar = request.GET['totalizar']
		if "$" in totalizar:
			df = df[df['moneda'] == totalizar]
			totalizar = "valor"
		df['total'] = df.groupby('cuenta')[totalizar].transform('sum')
		if 'proyecto' in request.GET['analizar']:
			columns = ['proyecto']
		else:
			columns = ['cuenta']
		if request.GET['agrupar_por']:
			columns.append(request.GET['agrupar_por'])
		if request.GET['periodo'] != "hoy":
			columns.append("fecha")
		
		df['total'] = df.groupby(columns)[totalizar].transform('sum')
		df['total'] = df['total']*df['direccion']
		df = df.sort_values(by='total', ascending=False)
		
		

		if request.GET['periodo'] != "hoy":
			df = df.groupby(columns, as_index=False)['total_pesos'].sum()
			df['fecha'] = pd.to_datetime(df['fecha'])
			df['fecha'] = df['fecha'].dt.strftime('%Y-%m')		
			df = df.pivot_table(index=columns[:-1], columns=columns[-1], values='total_pesos', aggfunc='sum', fill_value=0).reset_index()
			
			# Obtener solo las columnas de meses (sin los índices de agrupación)
			mes_columns = [col for col in df.columns[1:]]
			# Acumular saldos historicamente
			df[mes_columns] = df[mes_columns].cumsum(axis=1)			
		else:
			df = df.drop_duplicates(columns, keep='first')
			columns.append('total')
			df = df[columns]
			df = df[df['total'] != 0]
		return Response({'data': json.loads(df.to_json(orient="records"))})	
	