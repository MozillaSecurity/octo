/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from '../random'

/**
 * Utility class for MathML generators
 */
export class mathml {
  /**
   * Generate a random MathML pseudo-unit
   *
   * @returns {string}
   */
  static pseudounit () {
    return random.item([
      'depth',
      'height',
      'width'
    ])
  }

  /**
   * Generate a random MathML namedspace
   *
   * @returns {string}
   */
  static namedspace () {
    return random.item([
      'veryverythinmathspace',
      'verythinmathspace',
      'thinmathspace',
      'mediummathspace',
      'thickmathspace',
      'verythickmathspace',
      'veryverythickmathspace',
      'negativeveryverythinmathspace',
      'negativeverythinmathspace',
      'negativethinmathspace',
      'negativemediummathspace',
      'negativethickmathspace',
      'negativeverythickmathspace',
      'negativeveryverythickmathspace'
    ])
  }
}
