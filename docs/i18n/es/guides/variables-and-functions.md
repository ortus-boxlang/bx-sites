---
title: Variables y Funciones Mágicas
order: 12
icon: phosphor-duotone:magic-wand
tags: [guías, variables, funciones]
---

# Variables y Funciones Mágicas

Dos funciones pequeñas y relacionadas para mantener fuera de tu Markdown
tanto los datos repetidos como la lógica repetida: **variables
reutilizables**, definidas una sola vez en `bxsites.yaml` e insertadas en
cualquier página con `{{ }}`, y **funciones mágicas**, pequeños ayudantes
de BoxLang que escribes una sola vez en `docs/functions.bxs` y llamas de
la misma forma - en todas partes, sin import, sin plugin, sin cableado
alguno.

Ambas comparten una única sintaxis:

```text
{{ dotted.path }}          # a reusable variable
{{ $name(arg1, arg2) }}    # a magic function call
```

## Variables reutilizables

Añade un bloque `variables` a `bxsites.yaml` - con la forma que prefieras,
plana o anidada:

```yaml title="bxsites.yaml"
variables:
  company: "Ortus Solutions"
  product:
    name: "BoxLang"
    supportEmail: "support@example.com"
```

Luego referencia cualquiera de sus valores, por ruta con puntos, desde
cualquier página de Markdown:

```markdown title="docs/index.md"
# Welcome to {{ company }}

We build {{ product.name }} tools. Need help? Write us at
{{ product.supportEmail }}.
```

se construye como:

```html
<h1>Welcome to Ortus Solutions</h1>
<p>We build BoxLang tools. Need help? Write us at support@example.com.</p>
```

Una variable `{{ }}` se resuelve una sola vez, en el momento de la
construcción, contra lo que sea que tenga en ese instante el propio
bloque `variables` de `bxsites.yaml` - renombra un producto, actualiza una
dirección de soporte o cambia un año en un solo lugar, y cada página que
lo usa recoge el cambio en la siguiente construcción. Consulta
[`variables`](../configuration.md#variables) en la referencia de
configuración.

## Funciones mágicas

Añade un archivo `docs/functions.bxs` (o `src/functions.bxs`, si tu
proyecto usa `src/` - consulta [Primeros Pasos](../getting-started.md)) -
un script BoxLang plano. Cualquier función que nombres con un `$` inicial
se convierte en una *función mágica*: invocable desde `{{ }}` en
Markdown, e invocable directamente, sin nada más, desde las propias
sobrescrituras `.bxm` de [`theme/`](themes.md#sobrescribir-un-tema) de un
proyecto.

```bx title="docs/functions.bxs" linenums="1"
function $shout( text ) {
	return uCase( arguments.text ) & "!"
}

function $badge( label, kind = "info" ) {
	return '<span class="badge bg-' & arguments.kind & '">' & arguments.label & '</span>'
}
```

```markdown title="docs/index.md"
{{ $shout('this is important') }}

Status: {{ $badge('Stable', 'success') }}
```

se construye como:

```html
<p>THIS IS IMPORTANT!</p>
<p>Status: <span class="badge bg-success">Stable</span></p>
```

Una función mágica puede devolver cualquier cosa convertible con
`toString()` - texto plano, HTML, un número - y se empalma directamente
en el markdown de la página antes de que se convierta, así que devolver
HTML real (como `$badge()` arriba) funciona exactamente como cabría
esperar.

Una función declarada *sin* un `$` inicial en ese mismo `functions.bxs`
es solo un ayudante privado, pensado para ser llamado únicamente desde
tus otras funciones con prefijo `$` en el mismo archivo (todas se cargan
en el mismo ámbito, así que una puede llamar a otra sin prefijo) - `{{ }}`
nunca puede llamar a una directamente (solo un destino de llamada
`$name(...)` se reconoce jamás), y tampoco forma parte de la superficie
pública documentada que una sobrescritura de tema debería llamar, aunque
resulte técnicamente alcanzable también ahí:

```bx title="docs/functions.bxs"
private string function formatPrice( amount ) {
	return "$" & numberFormat( arguments.amount, "9.99" )
}

function $price( amount ) {
	return formatPrice( arguments.amount )
}
```

### Llamar a una función mágica desde una sobrescritura de tema

Como una función mágica queda enlazada directamente en el ámbito de la
plantilla, el propio `theme/page.bxm` (o `layout.bxm`) de un proyecto
puede llamarla sin prefijo, exactamente de la misma forma en que ya lee
`variables.page`/`variables.siteConfig`:

```bx title="theme/page.bxm (excerpt)"
<p class="build-banner">#$shout( 'built with boxlang' )#</p>
```

### Sintaxis de los argumentos

Los argumentos de una llamada a función mágica son literales o
referencias a variables simples, separados por comas - sin llamadas a
función anidadas ni expresiones en esta primera versión:

- Números: `{{ $discount(20) }}`
- Cadenas entre comillas: `{{ $greet('World') }}` o `{{ $greet("World") }}`
- Booleanos: `{{ $badge('Beta', true) }}`
- Una referencia a variable con puntos, sin `{{ }}`: `{{ $greet(product.name) }}`

## Mostrar la sintaxis de forma literal

Un `{{ }}` mostrado dentro de un bloque de código con fence (tres
comillas invertidas o más, como todos los ejemplos de esta página) se
deja completamente intacto en lugar de resolverse - la misma convención
que este módulo ya usa para las matemáticas `$...$` y el contenido de
pestañas `=== "Tab"`. Sin embargo, un `` `{{ example }}` `` mostrado en
código *en línea* no está protegido por el fence, así que si necesitas
mostrar la sintaxis en línea en lugar de en un bloque de código completo,
prefiere un nombre que no sea también una variable/función real en tu
propio proyecto.

Un `{{ }}` cuyo contenido no se parezca ni a una ruta de variable ni a
una llamada `$name(...)` - la propia sintaxis `{{ }}` de otro motor de
plantillas mostrada en el texto, por ejemplo - se deja intacto en lugar
de tratarse como un error. Solo un token que *parezca* una variable o una
llamada a función mágica, pero que no se resuelva, hace fallar la
construcción (consulta [Errores](#errores) más abajo) - eso es
deliberado, para detectar un error tipográfico real sin interpretar
erróneamente texto `{{ }}` no relacionado como sintaxis rota.

## Ámbito

- `functions.bxs` es de todo el proyecto - un solo archivo, cargado una
  vez, con el mismo conjunto de funciones mágicas disponible en cada
  página, tanto en el árbol principal como en cada árbol de
  [versión](versioning.md)/[idioma](i18n.md). No necesitas duplicarlo en
  `docs/versions/<name>/` ni en `docs/i18n/<code>/`.
- `variables` es igualmente un único bloque de `bxsites.yaml` de todo el
  proyecto - no es traducible por idioma en sí mismo. Un proyecto
  multilingüe que quiera texto de variable distinto por idioma puede en
  su lugar recurrir a una función mágica que decida según
  `siteConfig.i18n.defaultLocale.code` (o simplemente mantener el valor
  neutral respecto al idioma - un nombre de producto, un correo de
  soporte).

## Nombres reservados

Una sobrescritura `theme/page.bxm`/`layout.bxm` que llama a una función
mágica sin prefijo (`$name(...)`) funciona porque toda función cargada -
con prefijo `$` o ayudante privado por igual - se enlaza directamente en
ese mismo ámbito de renderizado de la plantilla, justo junto a los
`variables.page`/`variables.siteConfig`/etc. incorporados que ya lee
cualquier tema. Eso significa que una función de `functions.bxs` que
comparta nombre con uno de esos ya tiene uno propio: evita `page`, `nav`,
`siteConfig`, `themeDir`, `basePath`, `moduleAssetsDir`, `versions`,
`currentVersion`, `locales`, `currentLocale`, `currentLocaleDir`,
`strings`, `requiredFiles` y `stringsResolver` como nombre propio para un
ayudante privado (una función mágica con prefijo `$` nunca puede chocar
con ninguno de estos, ya que ninguno de ellos empieza con `$`).

## Errores

- `BxSites.UnknownVariable` - un `{{ dotted.path }}` (o un argumento de
  `$name(...)` que parece una referencia a variable) no coincide con nada
  del bloque `variables` de `bxsites.yaml`.
- `BxSites.UnknownFunction` - una llamada `{{ $name(...) }}` no coincide
  con ninguna función con prefijo `$` en `docs/functions.bxs`.
- `BxSites.InvalidFunctions` - `docs/functions.bxs` no pudo cargarse (un
  error de sintaxis de BoxLang en el propio archivo).
- `BxSites.InvalidConfig` - la clave `variables` de `bxsites.yaml` está
  presente, pero no es un objeto.
