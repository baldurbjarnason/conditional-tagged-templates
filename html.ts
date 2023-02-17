// Originally a rewrite of https://github.com/austincummings/html_template MIT License
import { escape } from "https://esm.sh/html-sloppy-escaper@0.1.0";

/**
 * Holds a string that will be inserted into a template with escaping.
 */
export class TrustedString {
  str: string;

  constructor(str: string) {
    this.str = str;
  }
}

/**
 * Helper function for creating a TrustedString
 *
 * @example
 * const htmlContent = "<h1>Hello world</h1>";
 * const doc = html`
 *  <header>${trusted(htmlContent)}</header>
 * `;
 */
export function trusted(str: string): TrustedString {
  return new TrustedString(str);
}

const IF_TRUE = Symbol("If true");
const IF_FALSE = Symbol("If false");
const ELSEIF_TRUE = Symbol("Else if true");
const ELSEIF_FALSE = Symbol("Else if false");
const ELSECondition = Symbol("Else");
const ENDIF = Symbol("End if");
const NO_COND = Symbol("No condition");

export function IF(cond: unknown) {
  return cond ? IF_TRUE : IF_FALSE;
}
export function ELSEIF(cond: unknown) {
  return cond ? ELSEIF_TRUE : ELSEIF_FALSE;
}
export function END() {
  return ENDIF;
}
export function ELSE() {
  return ELSECondition;
}

export const h = {
  if: IF,
  else: ELSE,
  end: END,
  elif: ELSEIF,
};

class Conditions {
  current: symbol;
  include: boolean;
  ifBlock: boolean;
  ifResolved?: boolean;
  constructor() {
    this.current = NO_COND;
    this.include = true;
    this.ifBlock = false;
  }
  condition(condition: symbol) {
    if (condition === ENDIF) {
      this.current = NO_COND;
      this.include = true;
      this.ifBlock = false;
      this.ifResolved = undefined;
    } else if (condition === IF_TRUE || condition === IF_FALSE) {
      this.handleIf(condition);
    } else if (condition === ELSEIF_TRUE || condition === ELSEIF_FALSE) {
      this.handleElseIf(condition);
    } else if (condition === ELSECondition) {
      this.handleElse(condition);
    }
  }
  handleIf(condition: symbol) {
    if (this.current !== NO_COND) {
      throw new Error("IF called inside an IF block");
    }
    this.current = condition;
    this.include = condition === IF_TRUE || false;
    this.ifBlock = true;
    this.ifResolved = condition === IF_TRUE;
  }
  handleElseIf(condition: symbol) {
    if (!this.ifBlock) throw new Error("ELSEIF called outside of an IF block");
    if (this.ifResolved) {
      this.include = false;
    } else if (!this.ifResolved && condition === ELSEIF_TRUE) {
      this.ifResolved = true;
      this.include = true;
    } else if (condition === ELSEIF_FALSE) {
      this.include = false;
    }
    this.current = condition;
  }
  handleElse(condition: symbol) {
    if (!this.ifBlock) throw new Error("ELSE called outside of an IF block");
    if (this.ifResolved) {
      this.include = false;
    } else {
      this.include = true;
    }
    this.ifResolved = true;
    this.current = condition;
  }
}

/**
 * Creates an HTML template string.
 *
 * @example
 * const doc = html`
 *  <!DOCTYPE html>
 *  <html>
 *    <head>
 *      <title>Hello world</title>
 *    </head>
 *    <body>
 *      Hello world
 *    </body>
 *  </html>
 * `;
 */
export function html(strs: TemplateStringsArray, ...values: unknown[]): string {
  let parts = "";
  // This shit should be done as a proper state machine
  // Text concat is faster in deno than array joins. (Didn't used to be, but IIRC at least V8 optimised this a few years ago.)
  const condition = new Conditions();
  for (let index = 0; index < strs.length; index++) {
    const str = strs[index];
    if (condition.include) parts = parts + str;
    const value = values[index];
    condition.condition(value as symbol);
    if (condition.include && value instanceof TrustedString) {
      parts = parts + value.str;
    } else if (condition.include && typeof value === "string") {
      parts = parts + escape(value);
    }
  }
  return parts;
}
