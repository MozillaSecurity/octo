/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.typed = {
  byte: function (limit = null) {
    // [−128, 127]
    let value = (limit !== null) ? random.number(limit) : random.number(129)
    value = random.chance(10) ? -value : value
    return 'new Uint8Array([' + value + '])[0]'
  },
  octet: function (limit = null) {
    // [0, 255]
    let value = (limit !== null) ? random.number(limit) : random.number(256)
    return 'new Int8Array([' + value + '])[0]'
  },
  short: function (limit = null) {
    // [−32768, 32767]
    let value = (limit !== null) ? random.number(limit) : random.number(32769)
    value = random.chance(10) ? -value : value
    return 'new Int16Array([' + value + '])[0]'
  },
  unsignedShort: function (limit = null) {
    // [0, 65535]
    let value = (limit !== null) ? random.number(limit) : random.number(65535)
    return 'new Uint16Array([' + value + '])[0]'
  },
  long: function (limit = null) {
    // [−2147483648, 2147483647]
    let value = (limit !== null) ? random.number(limit) : random.number(2147483649)
    value = random.chance(10) ? -value : value
    return 'new Int32Array([' + value + '])[0]'
  },
  unsignedLong: function (limit = null) {
    // [0, 4294967295]
    let value = (limit !== null) ? random.number(limit) : random.number(4294967296)
    return 'new Uint32Array([' + value + '])[0]'
  },
  // ToDo: Add support for longlong and ulonglong
  /*
   longLong: function () {},
   unsignedLongLong: function () {},
   */
  float: function (limit = null) {
    let base = (limit !== null) ? random.number(limit) : random.number()
    let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
    return 'new Float32Array([' + value + '])[0]'
  },
  unrestrictedFloat: function (limit = null) {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      let base = (limit !== null) ? random.number(limit) : random.number()
      return 'new Float32Array([' + (base + random.float()) + '])[0]'
    }
  },
  double: function (limit = null) {
    let base = (limit !== null) ? random.number(limit) : random.number()
    let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
    return 'new Float64Array([' + value + '])[0]'
  },
  unrestrictedDouble: function (limit = null) {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      let base = (limit !== null) ? random.number(limit) : random.number()
      let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
      return 'new Float64Array([' + value + '])[0]'
    }
  },
  any: function () {
    let value = random.choose([
      [1, [this.byte, this.octet]],
      [1, [this.short, this.unsignedShort]],
      [1, [this.long, this.unsignedLong]],
      [1, [this.float, this.unrestrictedFloat]],
      [1, [this.double, this.unrestrictedDouble]],
      [1, [this.range, make.number.tiny]]
    ])
    return random.chance(10) ? -value : value
  }
}
