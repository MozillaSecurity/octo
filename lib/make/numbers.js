/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class number extends make {
  /**
   * Returns a number that is more likely to exceed the supplied boundary
   * @param value {number}
   * @private
   */
  static _exceed (value) {
    switch (random.number(4)) {
      case 0:
        // Divisions
        return Math.ceil(value / random.range(2, 4))
      case 1:
        // Powers
        const offset = Math.pow(2, random.range(1, 7))
        return (value > 0) ? (value - offset) : value + offset
      default:
        // Slightly less than limit
        return (value > 0) ? (value - random.number(3)) : value + random.number(3)
    }
  }

  /**
   * Returns a int8 [-128, 127]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static int8 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(random.choose([
        [1, -128],
        [10, 127]
      ]))
    }

    return random.range(-128, 127)
  }

  /**
   * Returns a uint8 [0, 255]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static uint8 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(255)
    }

    return random.range(0, 255)
  }

  /**
   * Returns a int16 [-32768, 32767]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static int16 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(random.choose([
        [1, -32768],
        [10, 32767]
      ]))
    }

    return random.range(-32768, 32767)
  }

  /**
   * Returns a uint16 [0, 65535]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {*}
   */
  static uint16 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(65535)
    }

    return random.range(-0, 65535)
  }

  /**
   * Returns a int32 [-2147483648, 2147483647]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static int32 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(random.choose([
        [1, -2147483648],
        [10, 2147483647]
      ]))
    }

    return random.range(-2147483648, 2147483647)
  }

  /**
   * Returns a uint32 [0, 4294967295]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static uint32 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(4294967295)
    }

    return random.range(0, 4294967295)
  }

  /**
   * Returns a random floating point number
   * @returns {number}
   */
  static float () {
    /* if (random.chance(32)) {
      switch (random.number(4)) {
        case 0:
          return random.range(Number.MIN_VALUE, Number.MAX_VALUE)
        case 1:
          return Math.pow(10, 1) / Math.pow(10, random.number(307))
        case 2:
          return Math.pow(2, random.float() * random.float() * 64)
        case 3:
          return Math.pow(10, random.range(1, 9)) / Math.pow(10, random.range(1, 9))
      }
    } */

    return random.float()
  }

  /**
   * Returns a float value within the supplied range
   * @param {number} min - Start value
   * @param {number} max - End value
   * @param {?number} precision
   * @returns {number}
   */
  static frange (min, max, precision = null) {
    let x = Math.random() * (min - max) + max
    if (precision) {
      let power = Math.pow(10, precision)
      x = Math.round(x * power) / power
    }
    return x
  }

  /**
   * Returns a random power of 2 between 1 and 2048
   * @returns {number}
   */
  static tiny () {
    // Calling random.number twice prefers lower values
    return Math.pow(2, random.number(random.number(13)))
  }

  /**
   * Returns a random number adjacent to the supplied number
   * @param {number} number
   * @returns {number}
   */
  static even (number) {
    return number % 2 === 1 ? ++number : number
  }

  /**
   * Returns a random number that may be interesting
   * @returns {number}
   */
  static interesting () {
    return random.choose([
      [100, [-128, -1, 0, 1, 16, 32, 64, 100, 127]],
      [75, [-32768, -129, 128, 255, 256, 512, 1000, 1024, 4096, 32767]],
      [5, [-2147483648, -100663046, -32769, 32768, 65535, 65536, 100663045, 2147483647]],
      [1, ['NaN']]
    ])
  }

  /**
   * Returns a random signed number
   * @returns {number}
   */
  static signed () {
    return random.choose([
      [50, [number.int8]],
      [30, [number.int16]],
      [1, [number.int32]]
    ])
  }

  /**
   * Returns a random unsigned number
   * @returns {number}
   */
  static unsigned () {
    return random.choose([
      [50, [number.uint8]],
      [30, [number.uint16]],
      [1, [number.uint32]]
    ])
  }

  /**
   * Returns a random number using the type base number generators above
   * @param {boolean} floats
   * @returns {number}
   */
  static any (floats = true) {
    const num = random.choose([
      [50, [number.int8, number.uint8]],
      [30, [number.int16, number.uint16]],
      [1, [number.int32, number.uint32]]
    ])

    if (floats && random.chance(10)) {
      return number.frange(num, num + 1)
    }

    return num
  }
}

module.exports = number
