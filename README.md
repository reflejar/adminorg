![Header](docs/logo-as.png)

# AdminOrg

[![GitHub license](https://img.shields.io/github/license/reflejar/adminorg)](https://github.com/reflejar/adminorg/blob/main/LICENSE)

Sistema web creado para la administración, gestión, comunicación y contabilidad de comunidades.

## Setup

La forma de levantar el entorno de desarrollo es a través de Docker debido a que es un software hecho con tecnologías diferntes.
- Python con Django para la API
- Javascript con React y Next para el FRONT

> #### ⚠️ Prerequisitos
> 
> Este entorno virtual requiere de:
> - [Docker](https://docs.docker.com/engine/install/_) y (docker) compose (que en las nuevas versiones ya viene en la instalación de docker)

### Instalación

Abrí una terminal del sistema en el directorio raiz del proyecto y construí la imagen de docker

```bash
$ docker compose build
```

Luego se debe crear una base de datos en mysql que se llame "adminorg".
Para eso necesitamos acceder al contenedor de mysql llamado `ddbb`

```bash
$ docker compose up ddbb -d
$ docker compose exec ddbb bash
```

Una vez adentro, accedemos, a su vez, a la consola de mysql. escribimos `mysql -u root`. Luego, en la consola de mysql escribimos `CREATE DATABASE adminorg;`

```bash
$ bash-5.1# mysql -u root
$ CREATE DATABASE adminorg;
```

Luego cortamos la ejecución 

Luego se debe migrar la base de datos y ejecutar los scripts necesarios para dejar el sistema a punto

```bash
$ docker compose run app python /api/manage.py migrate
$ docker compose run app python /api/manage.py runscript setup
```

### Ejecución

Abrí una terminal del sistema en el directorio raiz del proyecto y ejecutá la imagen en un contenedor

```bash
$ docker compose up
```

### Consideraciones de ddbb

_Si se necesita generar una migración porque se creó o se modificó un modelo hay que hacer lo siguiente_

```bash
$ docker compose run app python /api/manage.py makemigrations
```

_Y luego, al ejecutarse el "up", se migra sola_

## Licencia

El siguiente repositorio es un desarrollo de codigo abierto bajo la licencia GNU General Public License v3.0. Pueden acceder a la haciendo [click aqui](./LICENSE).


---
⌨️ con ❤️ por [reflejar](https://github.com/reflejar/) 😊