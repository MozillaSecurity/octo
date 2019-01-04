/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class unit extends make {
  static unit () {
    return random.pick([
      'px', 'em', 'ex', 'ch', 'rem', 'mm', 'cm', 'in', 'pt', 'pc', '%'
    ])
  }

  static length () {
    return make.number.any() + make.unit.unit()
  }

  static percent () {
    if (random.chance(100)) {
      return `${make.number.any()}%`
    }

    return `${random.number(100 + 1)}%`
  }
}

module.exports = unit
