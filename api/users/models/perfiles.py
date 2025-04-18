"""Perfil model."""

# Django
from django.db import models
from django.core.validators import RegexValidator
from django_afip.models import DocumentType
# Utilities
from utils.models import BaseModel


class Perfil(BaseModel):
    """
		Modelo de perfil para cualquier persona (Fisica o Juridica), Cliente, Socio, Proveedores y para Lotes
	"""

    users = models.ManyToManyField('users.User', blank=True)
    nombre = models.CharField(max_length=160, blank=True, null=True)
    razon_social = models.CharField(max_length=80, blank=True, null=True)
    tipo_documento = models.ForeignKey(DocumentType, blank=True, null=True, on_delete=models.SET_NULL)
    numero_documento = models.CharField(max_length=13, blank=True, null=True)
    domicilio = models.ForeignKey("utils.Domicilio", blank=True, null=True, on_delete=models.SET_NULL)
    mail = models.EmailField(blank=True, null=True, max_length=254)
    telefono = models.CharField(max_length=17, blank=True)
    comunidades = models.ManyToManyField("utils.Comunidad", blank=True, related_name="admins")

    def __str__(self):
        if self.razon_social:
            return self.razon_social
        return self.nombre

    def get_emails_destinatarios(self):
        destinatarios = []
        [destinatarios.append(email) for email in [self.mail] + list(self.users.all().values_list('email', flat=True))
         if (email and not email in destinatarios)]
        return destinatarios
