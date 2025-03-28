from rest_framework import viewsets
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from utils.serializers import ComunidadModelSerializer
from utils.models import Comunidad
from users.permissions import IsOperativoUser

class ComunidadViewSet(viewsets.ModelViewSet):
    '''Comunidad view set.'''

    queryset = Comunidad.objects.all()
    serializer_class = ComunidadModelSerializer

    def get_permissions(self):
        '''Asigna permisos basandose en la accion'''
        if self.action == 'list':
            permissions = [AllowAny]
        else:
            permissions = [IsAuthenticated, IsOperativoUser]
        return [p() for p in permissions]