---
title: Contribuir
order: 2.3
icon: phosphor-duotone:git-pull-request
summary: Reporta errores, haz preguntas, envía pull requests o apoya el proyecto financieramente.
description: Reporta errores, haz preguntas, envía pull requests o apoya el proyecto financieramente.
tags: [acerca-de, contribuir]
---

# Contribuir

BxSites es de código abierto, y sus mantenedores dedican su tiempo libre a
construirlo y mantenerlo. Por favor sé considerado con los mantenedores al
reportar issues o presentar pull requests - todos seguimos la regla de
oro: trata a los demás como quieres que te traten a ti.

## Código de conducta

Como contribuidores y mantenedores de este proyecto, nos comprometemos a
respetar a todas las personas que contribuyen reportando issues,
publicando solicitudes de funciones, actualizando documentación,
enviando pull requests o parches, y otras actividades.

- Los participantes serán tolerantes con las opiniones divergentes.
- Ejemplos de comportamiento inaceptable incluyen el uso de lenguaje o
  imágenes sexuales, comentarios despectivos o ataques personales,
  trolling, acoso público o privado, insultos u otra conducta poco
  profesional.
- Los mantenedores del proyecto tienen el derecho y la responsabilidad de
  eliminar, editar o rechazar comentarios, commits, código, ediciones de
  wiki, issues y otras contribuciones que no estén alineadas con este
  Código de Conducta.
- Al interpretar las palabras y acciones de otros, los participantes
  deben asumir siempre buenas intenciones.
- Los casos de comportamiento abusivo, acosador o inaceptable pueden
  reportarse abriendo un issue o contactando directamente a uno o más
  mantenedores del proyecto.

## Reportar errores

BoxLang rastrea sus propios issues en Jira; cada módulo - incluido este -
rastrea sus issues en su propio repositorio de GitHub.

::: cards
::: card title="BoxLang Jira" icon="phosphor-duotone:kanban" href="https://ortussolutions.atlassian.net/browse/BL/issues"
Para issues del runtime de BoxLang en sí.
:::
::: card title="Issues de bx-sites" icon="phosphor-duotone:bug" href="https://github.com/ortus-boxlang/bx-sites/issues"
Para issues de este módulo.
:::
:::

Un buen reporte de error tiene un título, una descripción clara del
problema, una forma de reproducirlo, y cualquier archivo de soporte
necesario para reproducirlo. Los issues sin forma de reproducirlos no se
atenderán.

## Preguntas de soporte

Si tienes una pregunta de uso, necesitas soporte profesional, o solo
quieres comentar una idea con los mantenedores, por favor no abras un
issue para eso - usa uno de los siguientes canales de soporte:

::: cards
::: card title="Ortus Community Discourse" icon="phosphor-duotone:chats-circle" href="https://community.ortussolutions.com"
Haz preguntas y explora discusiones existentes.
:::
::: card title="Box Slack Team" icon="phosphor-duotone:slack-logo" href="https://boxteam.slack.com"
Chatea en tiempo real con la comunidad y los mantenedores.
:::
::: card title="Soporte profesional" icon="phosphor-duotone:headset" href="https://www.ortussolutions.com/services/support"
Planes de soporte de pago de Ortus Solutions.
:::
:::

## Guía para pull requests

- La rama `main`/`master` es una instantánea del último lanzamiento
  estable - todo el desarrollo se hace en ramas dedicadas, y los PRs
  contra ella se cierran. Envía tus pull requests contra la rama
  `development` en su lugar.
- Está bien tener varios commits pequeños mientras trabajas - se
  combinan automáticamente antes de fusionar.
- Asegúrate de que las pruebas locales pasen, e incluye pruebas junto
  con tus cambios.
- Enlaza el issue relevante de Jira/GitHub en el título de tu PR cuando
  lo envíes.

## Vulnerabilidades de seguridad

¿Encontraste una vulnerabilidad de seguridad? Por favor no abras un
issue público para ello. Envía un correo al equipo de desarrollo a
[security@ortussolutions.com](mailto:security@ortussolutions.com?subject=security)
y repórtalo también en el canal `#security` del Box Team Slack. Todas
las vulnerabilidades de seguridad se atienden con prontitud.

## Configuración de desarrollo

Clona el repositorio, instala las dependencias con `box install`, y
consulta la
[sección de colaboración del readme](https://github.com/ortus-boxlang/bx-sites#running-tests)
para la configuración local completa y cómo ejecutar las pruebas. Se
requiere JDK 21+.

## Estilos de codificación

Este proyecto sigue los estándares de codificación de Ortus, con
configuraciones de formateador incluidas tanto para código
BoxLang/CFML como para Java:

```bash frame="terminal" title="Terminal"
# Formatear todo
box run-script format

# Iniciar un watcher - formatea automáticamente al guardar
box run-script format:watch
```

Consulta los
[estándares de codificación de Ortus](https://github.com/Ortus-Solutions/coding-standards)
para la referencia completa.

## Contribuciones económicas

Puedes apoyar a BxSites, BoxLang y todas las iniciativas de código
abierto de Ortus Solutions convirtiéndote en patrocinador en Patreon -
los patrocinadores también obtienen beneficios como una cuenta de
cfcasts, una cuenta de ForgeBox Pro y más, según el nivel.

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="https://www.patreon.com/c/ortussolutions">Patrocinar en Patreon</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://www.paypal.com/paypalme/ortussolutions">Donación única vía PayPal</a>
</div>

## Contribuidores

Gracias a todos los que ya han contribuido a BxSites - ¡los queremos!

<a href="https://github.com/ortus-boxlang/bx-sites/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ortus-boxlang/bx-sites" alt="Contribuidores de BxSites">
</a>
