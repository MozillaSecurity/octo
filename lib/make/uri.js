/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class uri extends make {
  static problematic () {
    return random.item([
      'aim:yaz', // Often triggers an 'external protocol request' dialog
      'foop:yaz', // Often triggers an unknown protocol
      'about:memory', // Content is not allowed to link or load
      'ws://localhost/' // WebSocket protocol
    ])
  }

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
      'javascript:"QQQQ' + String.fromCharCode(0) + 'UUUU"',
      'http://a.invalid/',
      'http://localhost:6/',
      'https://localhost:6/',
      'ftp://localhost:6/',
      'http://localhost:25/'
    ])
  }

  static namespace () {
    return random.item([
      'http://www.w3.org/1999/xhtml',
      'http://www.w3.org/2000/svg',
      'http://www.w3.org/1998/Math/MathML'
    ])
  }

  static any () {
    return random.choose([
      [1, this.problematic],
      [10, this.standard],
      [10, this.namespace],
      [10, make.files.any]
    ])
  }
}

module.exports = uri
