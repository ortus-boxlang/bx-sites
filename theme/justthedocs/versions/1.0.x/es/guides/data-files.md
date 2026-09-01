---
title: Archivos de Datos
order: 12.5
icon: phosphor-duotone:database
tags: [guías, datos]
---

# Archivos de Datos

Las [variables reutilizables](variables-and-functions.md#variables-reutilizables)
son estupendas para un dato plano y puntual (`company`, `supportEmail`),
pero resultan incómodas para cualquier cosa con forma real - una lista de
equipo, una tabla de precios, una matriz de funciones. Los **archivos de
datos** cubren ese hueco: coloca un archivo `docs/data/*.yaml`/`.yml`/
`.json` en tu proyecto, y todo su contenido - con la forma que prefieras,
un objeto o un array - se vuelve accesible como `data.<archivo>` desde
cualquier página, con la misma sintaxis `{{ }}` que ya usan
`variables`/`page`.

## La convención

Añade una carpeta `docs/data/`. El nombre base de cada archivo (sin la
extensión) se convierte en una clave de nivel superior bajo `data`:

```text title="docs/ layout"
docs/
├── index.md
└── data/
    ├── team.yaml
    └── pricing.json
```

```yaml title="docs/data/team.yaml"
- name: Luis Majano
  role: CEO
- name: Jon Clausen
  role: CTO
```

```json title="docs/data/pricing.json"
{
	"free": { "price": 0, "seats": 3 },
	"pro": { "price": 29, "seats": 20 }
}
```

`data.team` es ahora ese array, `data.pricing.pro.price` ese número
anidado - la raíz analizada de un archivo se usa exactamente tal como se
analizó, tanto si es un objeto como un array, sin ninguna forma fija a la
que ajustarse. No tener ninguna carpeta `docs/data/` significa
simplemente que no hay `data` - la misma forma de activación por
presencia que ya tienen
[`docs/functions.bxs`](variables-and-functions.md#funciones-mágicas)/
[`docs/blog/authors.yml`](blog.md).

Referencia cualquiera de sus valores en Markdown normal, por ruta con
puntos:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo** for up to
{{ data.pricing.pro.seats }} seats.
```

se construye como:

```html
<p>The Pro plan is <strong>$29/mo</strong> for up to 20 seats.</p>
```

Si más de un archivo comparte el mismo nombre base entre extensiones
(existen tanto `products.yaml` como `products.json`), `.yaml` prevalece,
luego `.yml`, luego `.json` - en la práctica, elige un solo formato por
nombre base en lugar de depender de ese orden.

## Consumir datos

Una referencia escalar `{{ data.x.y }}` funciona en cualquier lugar donde
ya funcione `{{ }}`, pero el contenido real - una cuadrícula de equipo,
una tabla de precios - normalmente implica recorrer `data.*` en un bucle.
Hay tres formas de hacerlo, según a dónde pertenezca el bucle:

### En una sobrescritura de tema

Una vez que un proyecto tiene una sobrescritura `theme/` (consulta
[Temas](themes.md#sobrescribir-un-tema)), `data` se enlaza sin prefijo en
`layout.bxm`/`page.bxm` de la misma forma en que ya lo hacen
`page`/`siteConfig` - sin `{{ }}`, solo BoxLang real:

```bx title="theme/layout.bxm (excerpt)"
<ul class="footer-sponsors">
<bx:loop array="#data.sponsors#" index="sponsor">
	<li>#encodeForHTML( sponsor )#</li>
</bx:loop>
</ul>
```

Este es el lugar natural para datos que pertenecen a *cada* página (una
lista de patrocinadores del pie de página, una insignia de navegación de
todo el sitio) en lugar del contenido de una página específica.

### Desde una función mágica

Una [función mágica](variables-and-functions.md#funciones-mágicas)
también puede leer `data` sin prefijo (es una más de las mismas
"variables de soporte" que ya son `page`/`siteConfig`/etc.), y recorrerla
en bucle/ramificarla con BoxLang real, devolviendo un fragmento de
Markdown/HTML:

```bx title="docs/functions.bxs"
function $team() {
	var html = ""
	for ( item, idx in data.team ) {
		html &= "- **" & encodeForHTML( item.name ) & "** - " & encodeForHTML( item.role ) & char( 10 )
	}
	return html
}
```

```markdown title="docs/about.md"
## Our team

{{ $team() }}
```

Esto se renderiza en el servidor, en el momento de la construcción -
visible para un rastreador de búsqueda sin necesidad de JavaScript, a
diferencia de la receta de Alpine de más abajo.

### Directamente en Markdown, con `::: for`/`::: if`

Para un bucle o una simple comprobación de veracidad que no necesita
ninguna función mágica en absoluto,
[`::: for`/`::: if`](content-blocks.md#bucle-y-condicional-basado-en-datos)
funcionan directamente desde Markdown:

```markdown title="docs/team.md" linenums="1"
::: for member, idx in data.team
{{ idx }}. **{{ member.name }}** - {{ member.role }}
:::
```

`::: for <item>, <index> in <dotted.path>` enlaza `<item>`/`<index>`
usando la propia semántica nativa del bucle `for` de dos variables de
BoxLang para lo que sea que resuelva `<dotted.path>` - elemento + índice
en base 1 para un array, o clave + valor para un struct, con la sintaxis
*idéntica* en ambos casos (sin ninguna ramificación array-vs-struct que
tengas que escribir tú):

```markdown title="Iterating a struct" linenums="1"
::: for name, enabled in data.flags
- {{ name }}: {{ enabled }}
:::
```

`::: if <dotted.path>` renderiza su propio contenido solo cuando el
valor resuelto es verdadero (un array/struct/cadena vacío, `0` y `false`
cuentan todos como falso):

```markdown title="Example" linenums="1"
::: if data.flags.betaBanner
Beta features are enabled on this build.
:::
```

Encadena `::: elseif <dotted.path>` (cualquier cantidad) y un
`::: else` final sin condición justo después de un `::: if` para una
semántica real de `if`/`elseif`/`else` - la primera condición verdadera
gana, `::: else` captura lo que quede, y la propia condición de una rama
posterior nunca se resuelve siquiera hasta que le llega su turno. Un
único `:::` final cierra toda la cadena - `::: elseif`/`::: else` marcan
por sí mismos dónde termina la rama anterior, sin necesidad de ningún
`:::` antes de cada uno (aunque también funciona si prefieres escribirlo
así):

```markdown title="Example" linenums="1"
::: if data.flags.darkModeDefault
Dark mode is on by default.
::: elseif data.flags.betaBanner
Beta features are enabled, though dark mode isn't on by default.
::: else
Nothing special about this build.
:::
```

Ambos cuerpos pueden contener Markdown normal e incluso otros bloques de
contenido, incluyendo un `::: for`/`::: if` anidado. Una gramática
deliberadamente estrecha, a juego con el propio `{{ }}` - solo una ruta
con puntos, sin operadores de comparación (`==`, `&&`, ...) en esta
primera versión. Una necesidad de comparación real se dirige en su lugar
a una función mágica (arriba), que ya tiene todo BoxLang a su
disposición.

### En Alpine, del lado del cliente (`x-data`)

[Interactividad](interactivity.md) ya cubre cómo colocar HTML
`x-data`/`x-for` en bruto dentro de Markdown; alimentarlo desde `data.*`
en lugar de un array JS escrito a mano solo necesita convertir `data.*`
en un valor seguro de atributo HTML. `jsonSerialize()` por sí solo no
basta - el resultado todavía necesita una codificación de atributo HTML
para asentarse con seguridad dentro de un atributo entre comillas
`"..."` (la misma receta de dos pasos que usa el propio
`attribute()`/`forAttribute()` de ColdBox) - así que define un ayudante
de una línea, una sola vez, en tu propio `functions.bxs`:

```bx title="docs/functions.bxs"
function $jsonAttr( required any value ) {
	return encodeForHtmlAttribute( jsonSerialize( arguments.value ) )
}
```

`encodeForHtmlAttribute()` proviene de bx-esapi, ya una dependencia de
todo proyecto bx-sites - sin ninguna dependencia nueva, solo esta receta.
Luego, en Markdown:

```markdown title="docs/team.md" linenums="1"
<div x-data="{ team: {{ $jsonAttr(data.team) }} }">
  <template x-for="member in team" :key="member.name">
    <li x-text="member.name + ' - ' + member.role"></li>
  </template>
</div>
```

Las comillas dobles normales funcionan con seguridad alrededor de
`x-data` - `encodeForHtmlAttribute()` ya gestiona el conflicto, sin
necesidad de ningún workaround con comillas simples. Esta es la única
vía que se renderiza solo del lado del cliente (nada para un lector con
JavaScript desactivado o un rastreador de búsqueda) - recurre en su
lugar a una función mágica o a `::: for` cuando el contenido deba ser
visible sin JavaScript.

## ¿Por qué archivos de datos, y no plantillas BoxLang en Markdown?

Al diseñar esto surgió una pregunta relacionada, más de fondo: ¿por qué
no dejar que el propio Markdown se convierta en una plantilla BoxLang
real (bucles, condicionales, lógica arbitraria), en lugar de añadir un
`::: for`/`::: if` estrecho y apoyarse en funciones mágicas para
cualquier cosa más? Dos razones:

- **Límite de confianza.** `docs/**.md` es el único artefacto que
  habitualmente editan muchos colaboradores/externos/menos confiables
  (un PR de documentación). `docs/functions.bxs` es el único artefacto
  que el *dueño del proyecto* redacta explícitamente. Compilar cada
  archivo `.md` como una plantilla BoxLang real colapsaría ese límite -
  cualquier colaborador capaz de abrir un PR de documentación ganaría
  ejecución arbitraria de BoxLang (E/S de archivos, acceso al entorno) en
  lugar de solo texto Markdown.
- **Modo de fallo.** Un `{{ }}` sin coincidencia hoy se deja como texto
  literal - un error tipográfico nunca rompe una construcción. Un error
  de compilación de una plantilla BoxLang es un fallo duro. `::: for`/
  `::: if` mantienen esa misma forma indulgente (una ruta que no se
  puede resolver lanza un error claro que detecta errores tipográficos -
  consulta [Errores](#errores) - en lugar de compilar mal en silencio).

Los archivos de datos cierran la brecha real (contenido estructurado, y
bucles/condicionales sobre él) sin ninguna de las dos contrapartidas: el
propio Markdown sigue siendo inerte hasta que se sustituye con `{{ }}`, y
`functions.bxs` sigue siendo la única vía de escape explícitamente
confiable hacia la lógica BoxLang real.

## Ámbito

- `docs/data/` es de todo el proyecto, cargado una sola vez - el mismo
  ámbito de carga única que ya tiene
  [`functions.bxs`](variables-and-functions.md#ámbito). Cada árbol de
  versión/idioma ve el mismo `data` idéntico; no hay ninguna
  sobrescritura o fusión por versión o por idioma en esta primera
  versión. No dupliques `docs/data/` en `docs/versions/<name>/` ni en
  `docs/i18n/<code>/` - no se lee desde ahí.
- Solo directorio plano - sin recursión en subcarpetas dentro de
  `docs/data/` en esta primera versión, la misma forma de "exactamente
  un archivo" que ya tiene
  [`docs/blog/authors.yml`](blog.md).
- `data` es un nombre `{{ }}` reservado, de la misma forma en que ya lo
  es `page` (consulta
  [Nombres reservados](variables-and-functions.md#nombres-reservados)) -
  una entrada `variables.data` de `bxsites.yaml`, si un proyecto de algún
  modo la declarara, queda eclipsada por el propio struct de
  `docs/data/` en lugar de prevalecer. `docs/functions.bxs` tampoco puede
  declarar una función llamada `data`, por la misma razón.

## Errores

- `BxSites.InvalidDataFile` - un archivo `docs/data/*.yaml`/`.yml`/
  `.json` no pudo analizarse (un error de sintaxis YAML/JSON), nombrando
  el archivo causante.
- `BxSites.UnknownVariable` - un `{{ data.x.y }}` (o una ruta de
  `::: for`/`::: if`) no se resuelve contra lo que realmente hay en
  `docs/data/`.
- `BxSites.InvalidForTarget` - la propia ruta de un `::: for` se resolvió
  en algo que no es ni un array ni un struct (no se puede recorrer en
  bucle).
