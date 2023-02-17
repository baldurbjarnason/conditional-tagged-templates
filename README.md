# Experimental conditional tagged templates for generating HTML strings

I had the idea that something like this:

```js
function renderLocalHTML(text: string, secondary: string) {
  return html`<html>
    <head>
      <title></title>
      <meta charset="UTF-8" />
    </head>
    <body>
      <p>Test text</p>
      ${IF(secondary)}
      <p>${trusted(secondary)}</p>
      ${ELSEIF(text)}
      <p>${text}</p>
      ${ELSE()}
      <p>Otherwise</p>
      ${END()}
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect
          stroke="black"
          fill="blue"
          x="45px"
          y="45px"
          width="200px"
          height="100px"
          stroke-width="2"
        />
      </svg>
    </body>
  </html>`;
}
```

Would be more readable than:

```js
function renderLocalHTML(text: string, secondary: string) {
  return html`<html>
    <head>
      <title></title>
      <meta charset="UTF-8" />
    </head>
    <body>
      <p>Test text</p>
      ${secondary
        ? html`<p>${trusted(secondary)}</p>`
        : text
        ? html`<p>${text}</p>`
        : html`<p>Otherwise</p>`}
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect
          stroke="black"
          fill="blue"
          x="45px"
          y="45px"
          width="200px"
          height="100px"
          stroke-width="2"
        />
      </svg>
    </body>
  </html>`;
}
```

It's an experiment, not a project, so don't go expecting this to be published and maintained in any sort of way. I did include tests with full coverage and a naive benchmarking suite comparing it with other tagged templates and `JSX` approaches. It's roughly as fast as other tagged template and string template approaches and 4-40x faster than server-side `JSX` libraries.

> Conditional tagged templates:
>
> - 1.13x slower than Eta template
> - 1.07x slower than Tagged templates uhtml sync
> - 1.09x faster than Tagged templates basic html sync
> - 4.94x faster than JSX direct to string sync
> - 17.71x faster than Preact async
> - 42.98x faster than JSX indirect async

If you like this, feel free to copy it into your own projects (remember to include the tests) and reuse.
