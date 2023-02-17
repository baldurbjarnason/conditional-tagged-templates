/* @jsx h */
import { h } from "https://deno.land/x/corfu@v2.0.1/mod.ts";

export function renderCorfu(text: string) {
  return (
    <html>
      <head>
        <title></title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <p>Test text</p>
        <p>{text}</p>
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
    </html>
  );
}
