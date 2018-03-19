/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const random = require('../random')
const utils = require('../utils')

class block extends utils {
  static block (list, optional) {
    if (optional === true) {
      if (random.chance(6)) {
        return ''
      }
    }

    function deeper (item) {
      if (item === null || item === undefined) {
        return ''
      }
      if (typeof (item) === 'function') {
        return item()
      }
      if (typeof (item) === 'string') {
        return item
      }
      if (Array.isArray(item)) {
        let s = ''
        for (let i = 0; i < item.length; i++) {
          s += deeper(item[i])
        }
        return s
      }
      return item
    }

    let asString = ''
    for (let i = 0; i < list.length; i++) {
      asString += deeper(list[i])
    }

    return asString
  }
}

module.exports = block
