/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class uri extends make {
  /**
   * Generate a random URI that is known to cause issues
   *
   * @returns {string}
   */
  static problematic () {
    return random.item([
      'aim:yaz', // Often triggers an 'external protocol request' dialog
      'foop:yaz', // Often triggers an unknown protocol
      'about:memory', // Content is not allowed to link or load
      'ws://localhost/' // WebSocket protocol
    ])
  }

  /**
   * Generate a random URI that should be valid in all environments
   *
   * @returns {string}
   */
  static standard () {
    return random.item([
      'about:blank',
      'about:srcdoc',
      'about:mozilla',
      'about:rights',
      'data:text/html,',
      'data:image/png,',
      'data:',
      'javascript:5555',
      `javascript:"QQQQ${String.fromCharCode(0)}UUUU"`,
      'http://a.invalid/',
      'http://localhost:6/',
      'https://localhost:6/',
      'ftp://localhost:6/',
      'http://localhost:25/',
      'http://username:password@localhost',
      'http://:password@localhost'
    ])
  }

  /**
   * Generate a random namespaceURI
   *
   * @returns {string}
   */
  static namespace () {
    return random.item([
      'http://www.w3.org/1999/xhtml',
      'http://www.w3.org/2000/svg',
      'http://www.w3.org/1998/Math/MathML'
    ])
  }

  /**
   * Generate a random URI
   *
   * @returns {string}
   */
  static any () {
    switch (random.chance(20)) {
      case 0:
        return this.problematic()
      default:
        if (random.chance(4)) {
          // Return a standard URI
          return this.standard()
        }

        const base = (random.chance(4)) ? `${make.network.protocol()}://${make.network.hostname()}$` : ''
        const path = make.network.path()
        const hash = make.network.hash()
        const search = make.network.search()
        return `${base}${path}${hash}${search}`
    }
  }
}

module.exports = uri
