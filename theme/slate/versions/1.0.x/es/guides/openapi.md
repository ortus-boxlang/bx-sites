---
title: OpenAPI / Swagger
order: 4.6
icon: phosphor-duotone:plug
tags: [guías, openapi, api]
---

# OpenAPI / Swagger

Un widget interactivo de [Swagger UI](https://swagger.io/tools/swagger-ui/)
para una especificación OpenAPI/Swagger, usando la misma sintaxis de
contenedor `::: name ... :::` que cualquier bloque en
[Bloques de Contenido](content-blocks.md). `src` se resuelve del mismo modo,
relativo a `docs/assets/`, que el `src` de `::: file` (ver
[Bloques de Contenido](content-blocks.md#archivo)). Tanto las
especificaciones JSON como YAML funcionan; Swagger UI analiza ambas
enteramente del lado del cliente - en ningún lugar de este módulo ocurre
un análisis de OpenAPI en el servidor. Requiere que
[`openapi`](../configuration.md#openapi) de `bxsites.yaml` esté en `true` -
si no lo está, este marcador de posición se renderiza pero permanece
inerte (el propio JS/CSS de Swagger UI nunca se copia a `site/`, así que
el build de cualquier otro proyecto sigue siendo tan pequeño como antes de
esta funcionalidad):

```markdown title="Ejemplo" linenums="1"
::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::
```

::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::

El widget de arriba es esta misma página, en vivo, renderizando la pequeña
especificación de ejemplo que esta guía incluye en
`docs/assets/openapi/example.yaml` - ábrela en tu propio proyecto bajo
`docs/assets/` (o apunta `src` a tu propia especificación ya existente)
para ver lo mismo con tu propia API.

Solo se incluye (vendorizado) el layout base propio de `SwaggerUIBundle` -
sin la barra superior/"Explore" que permitiría a alguien escribir una
especificación distinta (un bloque `::: openapi` debe mostrar siempre la
única especificación a la que su autor lo apuntó), así que cada
operación, junto con sus esquemas de solicitud/respuesta, y "Try it out"
(que llama al `servers[0].url` propio de la especificación directamente
desde el navegador de quien visita la página - asegúrate de que ese
servidor permita CORS desde donde esté alojada tu documentación) se
renderizan directamente desde tu especificación existente, sin necesidad
de reescribir nada.

## Una sola operación en línea

Añade `operation="MÉTODO /ruta"` para insertar solo ese endpoint en una
página normal - útil a mitad de un tutorial, sin mandar al lector a la
referencia completa:

```markdown title="Ejemplo" linenums="1"
::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::
```

::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::

Es exactamente el mismo widget de Swagger UI que el bloque completo de
arriba (la misma especificación, el mismo renderizado únicamente del
lado del cliente - `operation` tampoco desencadena nunca ningún análisis
de OpenAPI de nuestro lado); simplemente se oculta cualquier otra
operación y esta se expande automáticamente, leyendo el propio marcado ya
renderizado de Swagger UI. El método de `operation` no distingue
mayúsculas/minúsculas; su ruta debe coincidir exactamente con la propia
ruta de la especificación (incluidos los marcadores `{param}`).

## Documentar una API sin un archivo de especificación

`::: openapi` siempre necesita un documento OpenAPI/Swagger real en `src`
- no existe una versión manual y sin especificación de este bloque para
describir a mano un único endpoint; importa siempre una especificación
real en su lugar. Si aún no tienes una:

- Escribe solo la especificación necesaria para cubrir la página en la
  que estás. Una única entrada de `paths` con su propio `info`/`servers`
  mínimo (mira `docs/assets/openapi/example.yaml` para ver lo poco que
  hace falta) ya te da el widget interactivo y "Try it out" para ese
  endpoint - amplíala a una especificación completa más adelante; el
  bloque en sí no cambia en nada.
- O prescinde del widget por completo y describe el endpoint como
  contenido normal - una tabla de parámetros, un par de bloques de
  código (```` ```http ````/```` ```json ````) de solicitud/respuesta,
  acompañado de un [stepper](content-blocks.md#stepper) si eso ayuda a
  explicarlo paso a paso. Cualquier otro bloque de contenido o extensión
  de Markdown está disponible en cualquier página, esté o no activado
  `openapi`.
