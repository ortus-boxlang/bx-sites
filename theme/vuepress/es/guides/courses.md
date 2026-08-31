---
title: Cursos
order: 12.6
icon: phosphor-duotone:graduation-cap
tags: [guides, courses]
---

# Cursos

Un **curso** convierte un conjunto de páginas en una secuencia guiada y
numerada - lección 1, lección 2, lección 3... - con su propio índice
numerado generado automáticamente, su propio "Lección N de M" anterior/
siguiente de ámbito propio (independiente del orden global de página a
página del sitio), y, en cuanto quien lee abre una lección, un progreso
registrado en su propio navegador: qué lecciones ha completado, y un
enlace "Continuar donde lo dejaste" de vuelta a la última que visitó.

## El manifiesto

Añade un archivo `docs/data/courses.yaml` (`.yml`/`.json` también
funcionan - consulta [Archivos de Datos](data-files.md)). Cada clave de
nivel superior es un curso; su array `lessons` enumera las propias
páginas de ese curso, en orden - la posición en el array *es* el número
de lección:

```yaml title="docs/data/courses.yaml"
getting-started:
  title: "Getting Started with BoxLang"
  description: "A guided walkthrough from install to your first deployed site."
  lessons:
    - guides/course/introduction.md
    - guides/course/windows-installation.md
    - guides/course/mac-installation.md
    - guides/course/creating-a-new-site.md
```

Cada entrada de `lessons` es una cadena de ruta relativa a `docs/`, la
misma convención de ruta relativa que ya usa el propio `nav.json`. El
título/resumen propios de una lección provienen *del propio frontmatter
de esa página* - no se duplican en el manifiesto - así que renombrar el
título de una página, o editar su resumen, se refleja automáticamente en
el índice del curso. Varios cursos solo significan varias claves de nivel
superior en el mismo archivo.

## El índice

Coloca una sola línea en cualquier parte de tu Markdown para renderizar
el índice numerado propio de ese curso:

```markdown
::: course id="getting-started" :::
```

Esto renderiza un `<ol>` real y semántico - un enlace numerado por
lección, cada uno con el título y el resumen propios de esa lección -
además de (inicialmente oculta, rellenada del lado del cliente en cuanto
quien lee realmente ha empezado) una barra de progreso y un enlace
"Continuar donde lo dejaste". Un `id` con un error tipográfico, o un
curso cuyas lecciones no existen todas, degrada a una pequeña nota
visible en lugar de hacer fallar la construcción.

## Páginas de lección

Cada página listada en el `lessons` de un curso obtiene automáticamente
un contexto `course` (`page.course` - consulta [Variables de
contexto](variables-and-functions.md#variables-de-contexto)) con su
propia posición, título, y anterior/siguiente *de ámbito propio* -
`page.course.prevLesson`/`.nextLesson` solo se mueven dentro de ese curso
en concreto, a diferencia del propio
[`page.prevPage`/`.nextPage`](variables-and-functions.md#variables-de-contexto)
global del sitio, que recorre todo el árbol de navegación
independientemente de cualquier curso. Una lección no necesita decir a
qué curso pertenece, ni dónde - el manifiesto es el único lugar donde eso
se decide, y una página no puede terminar accidentalmente en dos cursos
(un error de autoría que la construcción detecta con un error claro -
consulta [Errores](#errores)).

Actualmente, el tema bootstrap renderiza esta navegación de ámbito propio
- una insignia "Lección N de M", un paginador anterior/siguiente de
ámbito de curso, y un interruptor "Marcar como completada" - directamente
en la página de la lección. Cualquier otro tema incorporado sigue
calculando `page.course` correctamente (así que un proyecto en uno de
ellos ya puede mostrarlo mediante su propia [sobrescritura de
tema](themes.md#sobrescribir-un-tema)); una interfaz nativa en el resto
de los temas incorporados está en la hoja de ruta.

## Seguimiento del progreso

En cuanto quien lee abre una lección, un marcador oculto propio en la
página le indica a `course-progress.js` (compartido por todos los temas
incorporados, siempre incluido) que registre la visita - sin
configuración, sin necesidad de activarlo. El progreso vive por completo
en el propio `localStorage` de ese navegador, bajo
`bxsites-course-progress-<courseId>`:

```json
{
  "firstStarted": "2026-08-30T14:02:11.000Z",
  "lastVisited": { "url": "/guides/course/mac-installation/", "at": "2026-08-30T14:22:03.000Z" },
  "completed": {
    "/guides/course/introduction/": "2026-08-30T14:05:00.000Z",
    "/guides/course/windows-installation/": "2026-08-30T14:12:44.000Z"
  }
}
```

Una lección se marca como completada automáticamente en el momento en
que se visita su página; el interruptor "Marcar como completada"/"Marcar
como incompleta" permite a quien lee deshacer un marcado automático
accidental, o volver más tarde y volver a marcar una lección. El índice
del curso lee estos mismos datos para rellenar sus marcas de verificación,
su barra de progreso ("N de M completadas"), y el enlace para continuar.

Esto es una mejora puramente del lado del cliente, superpuesta sobre un
curso que ya funciona por completo sin ella - el índice numerado y el
paginador anterior/siguiente de ámbito propio se renderizan ambos en el
servidor, así que quien lee con JavaScript desactivado, o un rastreador
de búsqueda, sigue viendo la función base completa: cada lección,
correctamente numerada, correctamente enlazada. Nada del seguimiento de
progreso es necesario para que un curso funcione; que el almacenamiento
no esté disponible en absoluto (navegación privada, datos del sitio
bloqueados) degrada silenciosamente a "no se recuerda ningún progreso",
nunca a un error.

El progreso es por navegador, sin ninguna cuenta ni backend detrás - no
se sincroniza entre dispositivos, y no hay ningún registro del lado del
servidor de quién ha leído qué. Si eso es un requisito real para tu
proyecto, queda fuera de lo que esta función hace hoy.

## Ampliar esto más adelante

Dos cosas que esta función deliberadamente **no** construye todavía, pero
que está diseñada para poder crecer sin romper un `courses.yaml` ya
existente:

- **Cuestionarios entre lecciones.** Cada lección resuelta ya lleva
  internamente un `type` (actualmente siempre `"lesson"`) - una versión
  futura podrá aceptar una entrada de `lessons` que sea un pequeño objeto
  en lugar de una simple cadena de ruta (por ejemplo,
  `{ path: ..., type: "quiz" }`) junto con las cadenas simples, sin
  necesidad de ningún cambio en un curso que solo enumere rutas simples.
- **Una prueba/evaluación final al terminar un curso.** El esquema del
  manifiesto reserva (pero ignora) una clave opcional de nivel superior
  `finalTest` por curso, específicamente para que esto pueda llegar más
  adelante sin un cambio disruptivo de esquema - no uses esa clave para
  ninguna otra cosa en tu propio manifiesto.

## ¿Por qué un manifiesto y no frontmatter?

Las lecciones de un curso se declaran una sola vez, en `courses.yaml` -
no como un campo `course: getting-started` disperso por el propio
frontmatter de cada lección. Un campo por página sería una segunda fuente
de verdad, no forzada, junto al manifiesto, y que ambas discreparan (el
frontmatter de una lección dice un curso, el manifiesto la enumera en
otro - o en ninguno) es exactamente el tipo de desviación silenciosa que
este diseño evita. El manifiesto es el único lugar donde se decide la
forma de un curso - qué lecciones, en qué orden -; una página de lección
en sí nunca necesita saber de qué curso forma parte, ni dónde.

## Ámbito

- Un curso cuyo `lessons` no exista *por completo* como páginas reales en
  el árbol que se está construyendo en ese momento se omite
  silenciosamente para ese árbol, nunca es un fallo de construcción -
  esto importa porque `docs/data/courses.yaml` se carga una sola vez,
  para todo el proyecto (el mismo ámbito que ya tiene [Archivos de
  Datos](data-files.md#ámbito)), y se reutiliza sin cambios en todos los
  árboles de versión/idioma; una instantánea `docs/versions/<name>/`
  aislada puede no contener en absoluto los archivos de lección de un
  curso.
- Una lección solo puede pertenecer a un curso - enumerar la misma ruta
  bajo dos cursos distintos es un error de autoría real, y lanza un error
  (consulta [Errores](#errores)).
- Sin cursos anidados/de varias rutas, sin manifiestos de curso por
  versión con un orden de lección distinto por versión, en esta primera
  versión.

## Errores

- `BxSites.InvalidConfig` - `docs/data/courses.yaml` tiene un problema de
  forma: el valor de un curso no es un objeto, le falta un `title`, su
  `lessons` no es un array no vacío de cadenas de ruta, o la misma ruta
  de lección aparece listada en más de un curso.
