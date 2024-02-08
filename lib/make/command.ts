/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { colors } from "./colors"
import { font } from "./fonts"
import { html } from "./html"
import { random } from "../random"
import { text } from "./text"
import { uri } from "./uri"

type CommandValue = (() => string | boolean) | string[] | null

interface CommandPair {
  [key: string]: CommandValue
}

/** Class for generating designMode commands. */
export class command {
  /** Returns an object containing all designMode commands and their arguments. */
  static get data(): CommandPair {
    return {
      backColor: () => colors.any(),
      bold: null,
      ClearAuthenticationCache: null,
      contentReadOnly: () => random.bool(),
      copy: null,
      createLink: uri.any,
      cut: null,
      decreaseFontSize: null,
      defaultParagraphSeparator: () => html.tag(),
      delete: null,
      enableAbsolutePositionEditor: () => random.bool(),
      enableInlineTableEditing: () => random.bool(),
      enableObjectResizing: () => random.bool(),
      fontName: () => font.family(),
      fontSize: () => font.relativeSize(),
      foreColor: () => colors.any(),
      formatBlock: [
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ol",
        "ul",
        "pre",
        "address",
        "blockquote",
        "dl",
        "div",
      ],
      forwardDelete: null,
      heading: ["p", "h1", "h2", "h3", "h4", "h5", "h6"],
      hiliteColor: () => colors.any(),
      increaseFontSize: null,
      indent: null,
      insertBrOnReturn: () => random.bool(),
      insertHorizontalRule: null,
      // 'insertHTML: function () { },
      insertImage: () => uri.any(),
      insertLineBreak: null,
      insertOrderedList: null,
      insertParagraph: null,
      insertText: () => text.any(),
      insertUnorderedList: null,
      italic: null,
      justifyCenter: null,
      justifyFull: null,
      justifyLeft: null,
      justifyRight: null,
      outdent: null,
      paste: null,
      redo: null,
      removeFormat: null,
      selectAll: null,
      strikeThrough: null,
      styleWithCSS: () => random.bool(),
      subscript: null,
      superscript: null,
      underline: null,
      undo: null,
      unlink: null,
      useCSS: () => random.bool(),
    }
  }

  /** Generate a random command name. */
  // @ts-ignore
  static name(): string {
    return random.item(Object.keys(command.data))
  }

  /**
   * Generate a random command value.
   * @param name - Command name.
   */
  static value(name: keyof typeof command.data): string | boolean | null {
    // @ts-ignore
    return random.pick(command.data[name])
  }
}
