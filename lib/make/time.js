/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class time {
  static unit () {
    return random.pick([
      's', 'ms'
    ])
  }

  static datetime () {
    switch (random.number(2)) {
      case 0:
        return new Date(new Date().getTime() + random.number())
      case 1:
        return new Date(new Date().getTime() - random.number())
    }
  }

  static date () {
    return time.datetime().toDateString()
  }

  static time () {
    return time.datetime().toTimeString()
  }

  static iso () {
    return time.datetime().toISOString()
  }

  static epoch () {
    return Math.floor(time.datetime() / 1000)
  }

  static any () {
    return make.number.any() + time.unit()
  }
}

module.exports = time
