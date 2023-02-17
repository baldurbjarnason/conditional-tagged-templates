import { ELSE, ELSEIF, END, html, IF, trusted } from "./html.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.168.0/testing/asserts.ts";

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

function ifError() {
  return html`text${IF(true)}text${IF(false)}`;
}
function elseIfError() {
  return html`text${ELSEIF(true)}text${IF(false)}`;
}
function elseError() {
  return html`text${ELSE()}text${IF(false)}`;
}

Deno.test("html tagged template with conditional rendering", function () {
  assertEquals(renderLocalHTML("teststring1!", ""), result1);
  assertEquals(renderLocalHTML("teststring2!", "anothertest"), result2);
  assertEquals(renderLocalHTML("", ""), result3);
});

Deno.test("html tagged template errors", function () {
  assertThrows(ifError);
  assertThrows(elseIfError);
  assertThrows(elseError);
});
