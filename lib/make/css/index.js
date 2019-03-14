/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../index')

class css extends make {
  /**
   * Generator for CSS datatypes
   *
   * @returns {string}
   */
  static get datatypes () {
    return require('./datatypes')
  }

  /**
   * Generator for CSS list-* related properties
   *
   * @returns {string}
   */
  static get list () {
    return require('./list')
  }
}

module.exports = css
