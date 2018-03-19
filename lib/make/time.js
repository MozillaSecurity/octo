/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class time extends make {
  static unit () {
    return random.pick([
      's', 'ms'
    ])
  }

  static any () {
    return make.number.any() + this.unit()
  }
}

module.exports = time
