---
title: Interactividad con Alpine.js
order: 9
icon: phosphor-duotone:lightning
tags: [guías, alpine, interactividad]
---

# Interactividad con Alpine.js

Cada página construida por BxSites ya carga [Alpine.js](https://alpinejs.dev/)
- es lo que impulsa el interruptor de modo oscuro y el desplegable de
idioma incorporados en todos los temas incluidos. Esa misma
instancia de Alpine también está disponible para el contenido de tus
propias páginas, gratis: sin ninguna opción de `bxsites.yaml` que
activar, sin ninguna entrada `extraJs` que añadir, sin ninguna etiqueta
`<script>` adicional que escribir en tu markdown.

Dado que el [HTML en bruto a nivel de bloque pasa sin cambios](images.md#leyendas-alineación-y-marcos)
en tu markdown, puedes colocar los atributos `x-data`/`x-show`/`@click`/
etc. de Alpine directamente en cualquier bloque HTML y simplemente
funciona.

## Antes de recurrir a Alpine

La mayoría de las necesidades "interactivas" ya tienen un bloque de
directiva construido para ese propósito que no requiere escribir nada de
JS por tu cuenta - recurre primero a estos:

- Una sección colapsable → [Expandible](content-blocks.md#expandible) o
  una [admonición colapsable](markdown.md#admoniciones-colapsables)
- Contenido alternativo agrupado detrás de pestañas clicables →
  [Pestañas de Contenido](markdown.md#pestañas-de-contenido)
- Un recorrido numerado paso a paso →
  [Stepper](content-blocks.md#stepper)

Alpine es para el contenido interactivo que esos no cubren - cualquier
cosa con su propio estado del lado del cliente.

## Un botón de copiar al portapapeles

Uno común: un botón junto a un comando de instalación que lo copia y
confirma la copia:

```markdown title="Copy button" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied" x-cloak>Copied!</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="btn btn-sm btn-outline-secondary" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copiar comando de instalación</span>
    <span x-show="copied" x-cloak>¡Copiado!</span>
  </button>
</div>

## Un filtro en vivo

Filtrar una lista del lado del cliente, sin ida y vuelta al servidor:

```markdown title="Live filter" linenums="1"
<div x-data="{ query: '' }">
  <input type="text" x-model="query" placeholder="Filter providers...">
  <ul>
    <li x-show="'local'.includes( query.toLowerCase() )">local (static index, no server)</li>
    <li x-show="'algolia'.includes( query.toLowerCase() )">algolia (hosted DocSearch)</li>
    <li x-show="'pagefind'.includes( query.toLowerCase() )">pagefind (indexed at build time)</li>
  </ul>
</div>
```

`x-model` vincula el valor del campo al estado de Alpine; el `x-show` de
cada `<li>` se reevalúa en cada pulsación de tecla.

## Una tabla ordenable y filtrable

Una [tabla de pipes nativa](tables.md) es estática una vez
construida - para una que el lector realmente pueda ordenar y filtrar del
lado del cliente (lo más parecido que hay aquí a la búsqueda/orden de
tablas de GitBook), deja que Alpine sea el dueño de las filas en su
lugar: coloca los datos en `x-data` y renderízalos con `x-for`, en lugar
de escribir la sintaxis de pipes `| Feature | Status |`:

```markdown title="Sortable table" linenums="1"
<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
```

Lo que se renderiza como (escribe en el cuadro, haz clic en un
encabezado de columna):

<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>

`rows` es un array JS plano incrustado directamente en la página - bien
para el tipo de tabla de referencia pequeña que suelen tener los docs.
`sorted` es un `get`ter de Alpine, así que vuelve a filtrar y a ordenar
en cada pulsación de tecla/clic sin cableado adicional; `sortBy()`
invierte la dirección al hacer un segundo clic en la misma columna. El
`<table>` de aquí es una etiqueta `<table>` real escrita a mano (no hay
sintaxis de tabla de pipes que entregue filas a Alpine directamente), así
que de todas formas se envuelve en `.bxsites-table-wrap` y recibe
automáticamente el tratamiento de [desplazamiento
responsivo/encabezado fijo](tables.md#desplazamiento-responsivo-y-un-encabezado-fijo),
igual que cualquier tabla que el propio bx-markdown renderiza.

## Fundamentos de `x-data`, si eres nuevo en Alpine

`x-data` declara el propio estado reactivo de un ámbito como un objeto
JS simple; cualquier cosa dentro de ese elemento puede leerlo/escribirlo,
y `x-show`/`x-text`/`x-model`/`@click` (abreviatura de `x-on:click`)
reaccionan todos cuando cambia:

```markdown title="Example" linenums="1"
<div x-data="{ count: 0 }">
  <button type="button" @click="count++">Clicked <span x-text="count"></span> times</button>
</div>
```

Consulta la [propia documentación de Alpine](https://alpinejs.dev/start-here)
para la lista completa de directivas (`x-if`, `x-for`, `x-transition`, y
más).

## Cosas que debes saber

- **Es parte del núcleo, no opcional.** El armazón del tema (modo oscuro,
  selector de idioma) depende de Alpine, así que no se puede desactivar
  en `bxsites.yaml` como sí puede hacerse con `mermaid`/`math`.
- **Versión.** Actualmente `alpinejs@3.14.1`, incluida con este módulo y
  servida desde `site/assets/vendor/alpine/` - sin ningún CDN
  involucrado. Consulta el propio `layout.bxm` de un tema para ver la
  etiqueta `<script>` exacta si necesitas saber precisamente qué se
  carga.
- **CSP estricta.** La compilación por defecto de Alpine evalúa las
  expresiones JS dentro de `x-data`/`@click` etc. directamente, lo cual
  necesita `unsafe-eval` bajo una Content-Security-Policy estricta. Si tu
  despliegue no puede permitir eso, no dependas de Alpine en el
  contenido de tus páginas.
- **Mantenlo ligero.** Una página de documentación debe seguir siendo
  rápida y sencilla - pequeños widgets autocontenidos (un botón de
  copiar, un filtro, un interruptor) encajan bien; una aplicación
  completa del lado del cliente no es para lo que sirve esto.
