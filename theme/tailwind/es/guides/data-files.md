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
`variables`/`page`. ¿Necesitas los datos *calculados* en lugar de solo
analizados desde un archivo estático - un descuento aplicado al leer, un
valor que no debería vivir duplicado en tres archivos? Coloca una
**clase** `docs/data/*.bx` en su lugar - consulta
[Clases de datos](#clases-de-datos) más abajo.

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
(existen tanto `products.yaml` como `products.json`), `.bx` prevalece
primero (consulta [Clases de datos](#clases-de-datos)), luego `.yaml`,
luego `.yml`, luego `.json` - en la práctica, elige un solo formato por
nombre base en lugar de depender de ese orden.

## Clases de datos

Un archivo `.yaml`/`.json` es estático - se analiza una vez y se usa
exactamente tal como se escribió. Para datos que necesitan calcularse (un
precio con descuento, un valor ensamblado a partir de varias fuentes,
cualquier cosa con lógica real detrás), coloca en su lugar una **clase**
BoxLang real - `docs/data/Pricing.bx` (PascalCase, la misma convención de
archivos de clase que este módulo usa en todas partes) se convierte en
`data.pricing` - la misma forma de clave `data.*` en minúsculas que
cualquier otro archivo, solo con la primera letra del nombre base de la
clase en minúscula:

```bx title="docs/data/Pricing.bx"
class {
	struct function getData() {
		return { "free": { "price": 0 }, "pro": { "price": 29 } }
	}

	numeric function getDiscountedPrice( required string plan, required numeric pct ) {
		var base = getData()[ arguments.plan ].price
		return base - ( base * arguments.pct )
	}
}
```

**`getData()` es obligatoria** - toda clase de datos necesita una (aunque
sea trivial y devuelva `{}`), ya que es lo que se llama automáticamente
cada vez que se usa `data.pricing` sin más, exactamente igual que una
raíz YAML/JSON ya analizada:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo**.

::: for plan, info in data.pricing
- {{ plan }}: ${{ info.price }}
:::
```

**Cualquier otro método público también es invocable**, directamente
desde `{{ }}`, con exactamente la misma sintaxis de argumentos que ya usa
una llamada a una [función mágica](variables-and-functions.md#funciones-mágicas)
(literales o referencias de variables con ruta de puntos, separadas por
comas):

```markdown title="docs/pricing.md"
Discounted for early adopters: **${{ data.pricing.getDiscountedPrice("pro", 0.2) }}/mo**
```

se construye como:

```html
Discounted for early adopters: <strong>$23.2/mo</strong>
```

Esto funciona también desde `::: for`/`::: if`, la misma gramática de
`<dotted.path>` que estas directivas ya resuelven:

```markdown title="Example" linenums="1"
::: if data.pricing.getDiscountedPrice("pro", 0.2)
Discounts are active.
:::
```

Una sobrescritura de tema o una función mágica, que ya tienen todo BoxLang
a su disposición, reciben la propia instancia viva enlazada sin prefijo
como `data.pricing` - invoca `getData()` o cualquier otro método
directamente ahí, sin necesidad de ninguna magia de invocación automática
(consulta [Consumir datos](#consumir-datos) más abajo).

**Solo los métodos públicos son alcanzables de esta forma** - una
`private function` en la misma clase sigue siendo un verdadero detalle de
implementación, inalcanzable desde `{{ }}`, igual que un ayudante sin
prefijo `$` en `functions.bxs` es inalcanzable *directamente* (aunque,
igual que allí, sigue siendo invocable desde otro método del mismo
archivo).

Esto no relaja el límite de confianza [de más abajo](#por-qué-archivos-de-datos-y-no-plantillas-boxlang-en-markdown) -
un archivo `.bx` bajo `docs/data/` es código que escribe el *dueño del
proyecto*, el mismo nivel de confianza que ya tiene `docs/functions.bxs`,
nunca algo que el Markdown de un colaborador ajeno a la documentación
pueda alcanzar.

**Una limitación puntual**, real pero poco frecuente en la práctica:
cargar una clase de datos necesita que su propia ruta resuelta sea
expresable como un nombre de clase BoxLang (sin guiones ni espacios en
ningún punto). Ejecutar `bxSites` desde dentro del propio proyecto - el
caso, con diferencia, más habitual - siempre funciona, ya que nada de la
propia ruta del proyecto (que puede tener todos los guiones que quiera,
p. ej. `my-project/`) necesita expresarse jamás de ese modo. Solo se
convierte en una restricción real con un `--projectRoot` explícito que
apunte a un proyecto fuera del directorio actual, cuya propia ruta (o la
de un directorio superior) contenga un guion o un espacio - consulta
[`BxSites.UnsupportedDataClassPath`](#errores) para ver el error exacto
que se lanza en su lugar, en vez de un fallo críptico.

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
todo el sitio) en lugar del contenido de una página específica. Si
`sponsors` fuera una [clase de datos](#clases-de-datos) en lugar de un
archivo `.yaml`/`.json`, aquí `data.sponsors` es la propia instancia viva
(BoxLang real, sin la comodidad de invocación automática exclusiva de
`{{ }}`) - recorre en su lugar `data.sponsors.getData()` explícitamente.

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
`functions.bxs`/una clase `docs/data/*.bx` siguen siendo las vías de
escape explícitamente confiables hacia la lógica BoxLang real - ambas
código escrito por el dueño del proyecto, nunca algo que pueda añadir el
propio PR de un colaborador de Markdown.

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
  `.json` no pudo analizarse (un error de sintaxis YAML/JSON), o una clase
  `docs/data/*.bx` no pudo compilarse/instanciarse, nombrando el archivo
  causante.
- `BxSites.MissingDataMethod` - una clase `docs/data/*.bx` no tiene ningún
  método público `getData()`.
- `BxSites.UnknownDataMethod` - `{{ data.x.someMethod(...) }}` nombra un
  método que no existe (o no es público) en esa instancia de clase de
  datos.
- `BxSites.NotCallable` - `{{ data.x.someMethod(...) }}` donde `data.x` no
  es en absoluto una instancia de clase de datos (una clave basada en
  `.yaml`/`.json` no tiene métodos que invocar).
- `BxSites.UnsupportedDataClassPath` - una clase `docs/data/*.bx` no pudo
  cargarse porque su ruta resuelta contiene un carácter no válido en un
  nombre de clase BoxLang (un guion o un espacio en algún nombre de
  directorio superior) - consulta la propia nota al respecto en
  [Clases de datos](#clases-de-datos).
- `BxSites.UnknownVariable` - un `{{ data.x.y }}` (o una ruta de
  `::: for`/`::: if`) no se resuelve contra lo que realmente hay en
  `docs/data/`.
- `BxSites.InvalidForTarget` - la propia ruta de un `::: for` se resolvió
  en algo que no es ni un array ni un struct (no se puede recorrer en
  bucle).
