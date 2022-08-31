/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

/** Class for generating CSS style related values. */
export class style {
  /** Generate a random pseudoElement. */
  static pseudoElement(): string {
    return random.item([
      "::after",
      "::before",
      "::cue",
      "::first-letter",
      "::first-line",
      "::selection",
      "::backdrop",
      "::placeholder",
      "::marker",
      "::spelling-error",
      "::grammar-error",
    ])
  }
}
