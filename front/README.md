![Header](../docs/logo-as.png)
# AdminOrg Front (Documentación)

## Índice

* [1. Contexto](#1-contexto)
* [2. Descripción](#2-descripción)
* [3. Tecnologías Utilizadas](#3-tecnologías-utilizadas)
* [4. Diseño del Software](#4-diseño-del-software)

***

## 1. Contexto

Este proyecto es un frontend desarrollado con Next.js, un marco de React para aplicaciones web. El proyecto está diseñado para ser ejecutado en contenedores Docker, lo que facilita su despliegue y gestión de dependencias.


## 2. Descripción

El proyecto consiste en una aplicación frontend que ofrece diferentes módulos y funcionalidades. Entre estos se incluyen la autenticación de usuarios, la gestión de cuentas a cobrar, y la configuración de diversas opciones de la aplicación.

El objetivo es proporcionar una interfaz de usuario amigable y eficiente que permita a los usuarios interactuar con diferentes aspectos del sistema de manera intuitiva y segura.

## 3. Tecnologías Utilizadas

- Lenguajes de Programación: JavaScript
- Frameworks: React, Next.js
- Manejo de Estado: Redux
- Contenedores: Docker

## 4. Diseño del Software

**Estructura del Código**:
- Organización en carpetas y archivos:
  - `app`: Contiene las páginas y componentes específicos.
  - `components`: Contiene componentes compartidos y reutilizables.
  - `public`: Contiene recursos estáticos.
  - `repositories`: Contiene la lógica de acceso a datos.
  - `utils`: Contiene funciones de utilidad.

**Patrones de Diseño Utilizados**:
- Component-Based Architecture (React Components).
- Repositories Pattern para la gestión de datos.

**Detalles sobre las Interfaces y APIs**:
- Google Sheets API para la obtención de datos.

**Estructura del Código**:

- Organización en carpetas y archivos:

  - `docker-compose.yaml`: Configuración para Docker Compose.
  - `Dockerfile`: Definición de la imagen Docker.
  - `jsconfig.json`: Configuración de JavaScript.
  - `package.json`: Dependencias y scripts del proyecto.
  - `package-lock.json`: Versión exacta de las dependencias.
  - `README.md`: Documentación inicial del proyecto.
  - `next.config.js`: Mi Organización específicas de Next.js.
  - `LICENSE`: Licencia del proyecto.
  - `public/img/`: Contiene imágenes y recursos estáticos.
  - `src/app/`: Contiene las páginas y componentes principales de la aplicación.
  - `src/redux/`: Contiene las acciones, reductores, y configuración de la tienda Redux.
  - `src/utility/`: Utilidades y opciones varias.
  - `src/contexts/`: Contextos de React.

**Patrones de Diseño Utilizados**:

- Component-Based Architecture (React Components).
- Redux para la gestión del estado global.

**Detalles sobre las Interfaces y APIs**:

- Uso de servicios API para la autenticación y manejo de datos generales.
