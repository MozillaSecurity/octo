/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

/**
 * Class for generating MathML related values.
 */
export class mathml {
  /**
   * Generate a random MathML pseudo-unit.
   */
  static pseudounit(): string {
    return random.item(["depth", "height", "width"])
  }

  /**
   * Generate a random MathML namedspace.
   */
  static namedspace(): string {
    return random.item([
      "veryverythinmathspace",
      "verythinmathspace",
      "thinmathspace",
      "mediummathspace",
      "thickmathspace",
      "verythickmathspace",
      "veryverythickmathspace",
      "negativeveryverythinmathspace",
      "negativeverythinmathspace",
      "negativethinmathspace",
      "negativemediummathspace",
      "negativethickmathspace",
      "negativeverythickmathspace",
      "negativeveryverythickmathspace",
    ])
  }
}
