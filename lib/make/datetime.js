/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class datetime extends make {
  static object () {
    switch (random.number(2)) {
      case 0:
        return new Date(new Date().getTime() + random.number())
      case 1:
        return new Date(new Date().getTime() - random.number())
    }
  }

  static date () {
    return this.object().toDateString()
  }

  static time () {
    return this.object().toTimeString()
  }

  static iso () {
    return this.object().toISOString()
  }

  static epoch () {
    return Math.floor(this.object() / 1000)
  }
}

module.exports = datetime
