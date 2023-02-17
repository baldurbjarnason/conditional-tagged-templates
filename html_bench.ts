import { renderCorfu } from "./bench-scripts/corfu.tsx";
import { renderSSR } from "./bench-scripts/ssr.tsx";
import { html, render } from "https://esm.sh/uhtml-ssr@0.9.1";
import { renderPreact } from "./bench-scripts/preact.jsx";
import { html as html2 } from "https://deno.land/x/html_template@0.2.1/mod.ts";
import * as Eta from "https://deno.land/x/eta@v2.0.0/mod.ts";
import { h, html as html3, trusted } from "./html.ts";
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

function renderUhtml(text: string) {
  return render(
    String,
    html`<html>
      <head>
        <title></title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <p>Test text</p>
        <p>${text}</p>
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
    </html>`,
  );
}
const etaTemplate = Eta.compile(`<html>
      <head>
        <title></title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <p>Test text</p>
        <p><% it.text %></p>
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
    </html>`);
function renderEta(text: string) {
  return Eta.render(etaTemplate, { text });
}
function renderTaggedHTML(text: string) {
  return html2`<html>
      <head>
        <title></title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <p>Test text</p>
        <p>${text}</p>
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
const IF = h.if;
const ELIF = h.elif;
const ELSE = h.else;
const ENDIF = h.end;
function renderLocalHTML(text: string, secondary: string) {
  return html3`<html>
      <head>
        <title></title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <p>Test text</p>
${IF(secondary)}
        <p>${trusted(secondary)}</p>
${ELIF(text)}
        <p>${text}</p>
${ELSE()}
        <p>Otherwise</p>
${ENDIF()}
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
const result1 = `<html>
      <head>
        <title></title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <p>Test text</p>

        <p>teststring1!</p>

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
const result2 = `<html>
      <head>
        <title></title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <p>Test text</p>

        <p>anothertest</p>

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
const result3 = `<html>
      <head>
        <title></title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <p>Test text</p>

        <p>Otherwise</p>

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
assertEquals(renderLocalHTML("teststring1!", ""), result1);
assertEquals(renderLocalHTML("teststring2!", "anothertest"), result2);
assertEquals(renderLocalHTML("", ""), result3);

Deno.bench("JSX direct to string sync", () => {
  renderCorfu(
    `Nec malesuada nulla Aenean dignified fermentum porttitor Curabitur aliquet sapien eu libero ullamcorpereu aliquam nibh consequat Cras cursus urna vitae ex placerat aliquam Maecenas eros lacusporta a magna quissodales interdum purus Nulla massa elitconsequat non risus quisvolutpat aliquam risus Curabitur eu ipsum felis Whatever we like`,
  );
});

Deno.bench("Eta template", () => {
  renderEta(
    `Nec malesuada nulla Aenean dignified fermentum porttitor Curabitur aliquet sapien eu libero ullamcorpereu aliquam nibh consequat Cras cursus urna vitae ex placerat aliquam Maecenas eros lacusporta a magna quissodales interdum purus Nulla massa elitconsequat non risus quisvolutpat aliquam risus Curabitur eu ipsum felis Whatever we like`,
  );
});
Deno.bench("JSX indirect async", async () => {
  await renderSSR(
    `Nec malesuada nulla Aenean dignified fermentum porttitor Curabitur aliquet sapien eu libero ullamcorpereu aliquam nibh consequat Cras cursus urna vitae ex placerat aliquam Maecenas eros lacusporta a magna quissodales interdum purus Nulla massa elitconsequat non risus quisvolutpat aliquam risus Curabitur eu ipsum felis Whatever we like`,
  );
});
Deno.bench("Preact async", async () => {
  await renderPreact(
    `Nec malesuada nulla Aenean dignified fermentum porttitor Curabitur aliquet sapien eu libero ullamcorpereu aliquam nibh consequat Cras cursus urna vitae ex placerat aliquam Maecenas eros lacusporta a magna quissodales interdum purus Nulla massa elitconsequat non risus quisvolutpat aliquam risus Curabitur eu ipsum felis Whatever we like`,
  );
});
Deno.bench("Tagged templates uhtml sync", () => {
  renderUhtml(
    `Nec malesuada nulla Aenean dignified fermentum porttitor Curabitur aliquet sapien eu libero ullamcorpereu aliquam nibh consequat Cras cursus urna vitae ex placerat aliquam Maecenas eros lacusporta a magna quissodales interdum purus Nulla massa elitconsequat non risus quisvolutpat aliquam risus Curabitur eu ipsum felis Whatever we like`,
  );
});
Deno.bench("Tagged templates basic html sync", () => {
  renderTaggedHTML(
    `Nec malesuada nulla Aenean dignified fermentum porttitor Curabitur aliquet sapien eu libero ullamcorpereu aliquam nibh consequat Cras cursus urna vitae ex placerat aliquam Maecenas eros lacusporta a magna quissodales interdum purus Nulla massa elitconsequat non risus quisvolutpat aliquam risus Curabitur eu ipsum felis Whatever we like`,
  );
});
Deno.bench("Conditional tagged templates", { baseline: true }, () => {
  renderLocalHTML(
    `Nec malesuada nulla Aenean dignified fermentum porttitor Curabitur aliquet sapien eu libero ullamcorpereu aliquam nibh consequat Cras cursus urna vitae ex placerat aliquam Maecenas eros lacusporta a magna quissodales interdum purus Nulla massa elitconsequat non risus quisvolutpat aliquam risus Curabitur eu ipsum felis Whatever we like`,
    "",
  );
});
