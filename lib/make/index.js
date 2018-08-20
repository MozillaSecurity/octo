/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

class make {
  static get number () {
    return require('./numbers')
  }

  static get alignment () {
    return require('./alignment')
  }

  static get arrays () {
    return require('./arrays')
  }

  static get colors () {
    return require('./colors')
  }

  static get command () {
    return require('./command')
  }

  static get crypto () {
    return require('./crypto')
  }

  static get files () {
    return require('./files')
  }

  static get font () {
    return require('./fonts')
  }

  static get html () {
    return require('./html')
  }

  static get mime () {
    return require('./mime')
  }

  static get network () {
    return require('./network')
  }

  static get shaders () {
    return require('./shaders')
  }

  static get style () {
    return require('./style')
  }

  static get text () {
    return require('./text')
  }

  static get time () {
    return require('./time')
  }

  static get typed () {
    return require('./typed')
  }

  static get types () {
    return require('./types')
  }

  static get unit () {
    return require('./units')
  }

  static get uri () {
    return require('./uri')
  }

  static get webgl () {
    return require('./webgl')
  }
}

module.exports = make
