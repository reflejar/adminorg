from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views.parametros import ParametrosViewSet
from .views.reportes import ReportesViewSet
from .views.comprobantes import ComprobantesViewSet

router = DefaultRouter()
router.register(r'parametros/(?P<rubro>[-a-zA-Z0-0_]+)', ParametrosViewSet, basename='operative')

router.register(r'comprobantes', ComprobantesViewSet, basename='operative')

router.register(r'reportes/(?P<tipo>[-a-zA-Z0-0_]+)', ReportesViewSet, basename='operative')

urlpatterns = [
     path('', include(router.urls))
]