---
title: Importar un tema
order: 6.5
icon: phosphor-duotone:arrows-left-right
tags: [guías, temas, migración]
---

# Importar un tema

`bxSites theme:import` convierte un tema del ecosistema de otro generador
de sitios estáticos en un scaffold de tema bx-sites bajo `themes/<name>/`
- un punto de partida de mejor esfuerzo, no una migración sin pérdidas en
un solo comando. Maneja los tres ecosistemas cuya estructura de tema se
corresponde con el propio contrato `layout.bxm`+`page.bxm` de bx-sites
(consulta [Temas](themes.md#el-contrato-de-themeprovider)):

- **`mkdocs`** - plantillas Jinja2 (tanto mkdocs nativo como
  mkdocs-material usan `base.html`+`main.html`)
- **`jekyll`** - plantillas Liquid (`_layouts/default.html`+
  `_layouts/page.html`)
- **`hugo`** - plantillas Go (`layouts/_default/baseof.html`+
  `layouts/_default/single.html`)

Un tema basado en componentes React/Vue (Docusaurus, VuePress, Gatsby,
...) no tiene equivalente aquí - no hay ningún *archivo* de plantilla que
traducir mecánicamente, ya que el tema son componentes de interfaz
compilados en lugar de marcado renderizado en el servidor. Portar uno de
esos significa reescribirlo como un tema bx-sites desde cero (consulta
[Escribir un tema desde cero](themes.md#escribir-un-tema-desde-cero)), no
convertirlo.

```bash frame="terminal" title="Terminal"
bxSites theme:import --source=mkdocs --path=/path/to/mkdocs-theme --name=my-imported-theme
```

- `--source` (obligatorio) - `mkdocs`, `jekyll` o `hugo`
- `--path` (obligatorio) - la propia carpeta raíz del tema de origen (la
  que contiene su plantilla de layout, no todo el *proyecto*
  mkdocs/jekyll/hugo - consulta
  [Migrar desde mkdocs](migrating-from-mkdocs.md)/
  [Migrar desde GitBook](migrating-from-gitbook.md) para convertir el
  *contenido* de un proyecto, una tarea distinta de convertir su *tema*)
- `--name` (obligatorio) - el nombre de destino, escrito en
  `themes/<name>/` (la misma
  [convención de tema instalado](themes.md#instalar-un-tema-publicado)
  que usa `install:theme`) - establece el `theme.name` de
  `bxsites.json` una vez que estés satisfecho con el resultado

Volver a ejecutarlo contra el mismo `--name` es seguro - `layout.bxm`/
`page.bxm` se sobrescriben y cualquier carpeta de recursos recién
encontrada se combina, así que iterar (ajustar el origen, o el mapeo,
volver a ejecutar) es el flujo de trabajo normal, no una operación de un
solo uso.

## Qué se convierte realmente

La salida del comando informa exactamente qué ocurrió - qué archivo de
origen se convirtió en `layout.bxm`/`page.bxm` (o una nota indicando que
no se encontró ninguno, si el tema de origen no usa uno de los nombres de
archivo convencionales de arriba), qué carpetas de recursos (`css/`,
`js/`, `static/`, ...) se copiaron tal cual en `themes/<name>/assets/`, y
una lista numerada de todo lo que necesita revisión manual.

Dentro de un archivo de plantilla, esto es un **traductor mecánico de
mejor esfuerzo** (`JinjaLikeTranslator.bx` para la sintaxis Jinja2/Liquid
compartida de mkdocs/jekyll, `GoTemplateTranslator.bx` para las plantillas
Go de hugo) - no un analizador real de ninguno de los dos lenguajes. Lo
que maneja:

- Salida de variables (`{{ page.title }}` / el `{{ .Title }}` de Hugo),
  mapeada contra una tabla pequeña y fija de los campos comunes (título/
  contenido/descripción de la página, nombre/descripción del sitio, URL
  base, navegación) - cualquier cosa fuera de esa tabla se deja como un
  marcador `<!--- TODO: ... --->` en lugar de adivinarse.
- `if`/`elif`/`else`/`endif` (mkdocs/jekyll) o `if`/`else if`/`else`/`end`
  (hugo), traducido a una estructura `<bx:if>`/`<bx:elseif>`/`<bx:else>`
  real - siempre estructuralmente válida incluso cuando la propia
  *condición* referencia algo fuera de la tabla de mapeo (marcada como
  advertencia en su lugar, ya que dejar el `if` circundante roto sería
  peor que una condición que un humano todavía necesita revisar).
- `for x in list`/`endfor` (mkdocs/jekyll) o `range`/`end` (hugo),
  traducido a `<bx:loop>` de la misma forma. El `range` de Hugo reasigna
  `.` a cada elemento sin ninguna variable de bucle con nombre en el caso
  común - el `<bx:loop>` generado siempre usa un nombre sintético `item`,
  y una advertencia permanente señala que un `.Field` suelto *dentro* del
  cuerpo del bucle significa el propio campo del elemento del range en
  Go, que no puede redirigirse automáticamente a `item.Field`.
- Comentarios (`{# ... #}`/`{% comment %}` para Jinja2/Liquid,
  `{{/* ... */}}` para Go), eliminados por completo.

Lo que deliberadamente **no** se traduce, siempre dejado como un marcador
TODO (o, dentro de una condición donde dejar la sintaxis sin traducir en
bruto produciría BoxLang inválido, sustituido por un marcador de posición
sintácticamente seguro - `false` para una condición, `[]` para la
expresión de lista de un bucle - marcado de la misma forma):

- Un filtro/pipeline (`{{ page.title | upper }}`, `{{ .Title | truncate 100 }}`)
  - la semántica de los filtros varía demasiado como para adivinarla con
  seguridad - de todos modos vale la pena verificarlo manualmente, ya que
  un filtro con un equivalente BoxLang claramente seguro (`upper` →
  `ucase()`) es lo bastante común como para ser un arreglo manual rápido.
- La herencia de plantillas (`{% extends %}`/`{% block %}` de Jinja2,
  `{{ block }}`/`{{ define }}` de Hugo) e includes/parciales
  (`{% include %}`) - no hay forma automática de mapear esto al propio
  contrato de archivo único `layout.bxm`+`page.bxm` de bx-sites.
- El `{{ with .X }}` de Hugo - reasigna `.` a un nuevo contexto para su
  propio cuerpo, sin ningún equivalente en bx-sites en absoluto, así que
  se deja sin traducir en lugar de emitirse como un `<bx:if>`
  estructuralmente válido pero semánticamente incorrecto.
- Una condición de Go que no es una única referencia a un campo (Go
  escribe la lógica booleana como llamadas a función en notación prefija
  - `{{ if and .A .B }}`, `{{ if eq .Type "post" }}` - que no tienen un
  equivalente infijo en BoxLang; sustituir solo los tokens `.Field`
  dentro de una de ellas seguiría dejando texto BoxLang inválido detrás,
  así que toda la condición se reemplaza por el marcador de posición en
  su lugar).
- Cualquier referencia de variable que no esté en la tabla de mapeo fija.

## Después de importar

El scaffold es un punto de partida, no un tema terminado - trabaja los
marcadores TODO y las advertencias reportados, y luego verifícalo contra
el [contrato de ThemeProvider](themes.md#el-contrato-de-themeprovider) de
la misma forma en que lo necesita un tema escrito a mano (`layout.bxm`+
`page.bxm` obligatorios, `search.bxm` opcional). Ninguna de las
convenciones de funciones de página que implementa cada tema incorporado
(modo oscuro, migas de pan, anterior/siguiente, el cuadro de búsqueda,
...) viene incluida automáticamente - el propio marcado del tema de
origen para esas, si lo tenía, pasó por la misma traducción mecánica que
todo lo demás y necesita la misma revisión.
