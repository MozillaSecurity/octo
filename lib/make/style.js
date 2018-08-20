/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class style extends make {
  static pseudoElement () {
    return random.item([
      '::after',
      '::before',
      '::cue',
      '::first-letter',
      '::first-line',
      '::selection',
      '::backdrop',
      '::placeholder',
      '::marker',
      '::spelling-error',
      '::grammar-error'])
  }
}

module.exports = style
