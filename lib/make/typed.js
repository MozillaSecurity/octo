/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class typed extends make {
  static byte (limit = null) {
    // [-128, 127]
    let value = (limit !== null) ? random.number(limit) : random.number(129)
    value = random.chance(10) ? -value : value
    return 'new Uint8Array([' + value + '])[0]'
  }

  static octet (limit = null) {
    // [0, 255]
    let value = (limit !== null) ? random.number(limit) : random.number(256)
    return 'new Int8Array([' + value + '])[0]'
  }

  static short (limit = null) {
    // [-32768, 32767]
    let value = (limit !== null) ? random.number(limit) : random.number(32769)
    value = random.chance(10) ? -value : value
    return 'new Int16Array([' + value + '])[0]'
  }

  static unsignedShort (limit = null) {
    // [0, 65535]
    let value = (limit !== null) ? random.number(limit) : random.number(65535)
    return 'new Uint16Array([' + value + '])[0]'
  }

  static long (limit = null) {
    // [-2147483648, 2147483647]
    let value = (limit !== null) ? random.number(limit) : random.number(2147483649)
    value = random.chance(10) ? -value : value
    return 'new Int32Array([' + value + '])[0]'
  }

  static unsignedLong (limit = null) {
    // [0, 4294967295]
    let value = (limit !== null) ? random.number(limit) : random.number(4294967296)
    return 'new Uint32Array([' + value + '])[0]'
  }

  static float (limit = null) {
    let base = (limit !== null) ? random.number(limit) : random.number()
    let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
    return 'new Float32Array([' + value + '])[0]'
  }

  static unrestrictedFloat (limit = null) {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      let base = (limit !== null) ? random.number(limit) : random.number()
      return 'new Float32Array([' + (base + random.float()) + '])[0]'
    }
  }

  static double (limit = null) {
    let base = (limit !== null) ? random.number(limit) : random.number()
    let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
    return 'new Float64Array([' + value + '])[0]'
  }

  static unrestrictedDouble (limit = null) {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      let base = (limit !== null) ? random.number(limit) : random.number()
      let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
      return 'new Float64Array([' + value + '])[0]'
    }
  }

  static any () {
    return random.choose([
      [1, [this.byte, this.octet]],
      [1, [this.short, this.unsignedShort]],
      [1, [this.long, this.unsignedLong]],
      [1, [this.float, this.unrestrictedFloat]],
      [1, [this.double, this.unrestrictedDouble]],
      [1, [make.number.range, make.number.tiny]]
    ])
  }

  static arrayBuffer (byteLength = null) {
    let length = (byteLength !== null) ? byteLength : this.unsignedShort()
    return 'new ArrayBuffer(' + length + ')'
  }

  static dataView (byteLength = null) {
    let length = (byteLength !== null) ? byteLength : this.unsignedShort()
    return 'new DataView(' + this.arrayBuffer(length) + ')'
  }

  static typedArray (byteLength = null) {
    let length = (byteLength !== null) ? byteLength : this.unsignedShort()
    let arrType = random.item([
      'Int8', 'Uint8', 'Uint8Clamped',
      'Int16', 'Uint16',
      'Int32', 'Uint32',
      'Float32', 'Float64'
    ])
    let method = 'new ' + arrType + 'Array'
    switch (random.number(16)) {
      case 0:
        return method + '()'
      case 1:
        return method + '(' + this.typedArray() + ')'
      default:
        return method + '(' + length + ')'
    }
  }

  static bufferSource () {
    switch (random.number(4)) {
      case 0:
        return this.arrayBuffer()
      case 1:
        return this.dataView()
      default:
        return this.typedArray()
    }
  }
}

module.exports = typed
