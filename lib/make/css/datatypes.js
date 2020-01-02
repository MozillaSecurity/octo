/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../index')
const random = require('../../random')
const utils = require('../../utils')

/**
 * Generate a calc value
 *
 * @param {Function} generator - The value generation function
 * @returns {string}
 */
function calc (generator) {
  const values = []

  const len = random.range(1, 5)
  for (let i = 0; i < len; i++) {
    // Occasionally, just use a plain number
    // We only do so on even numbers to ensure that we have atleast one value that is direct from the generator
    if (i % 2 === 0 && random.chance(10)) {
      values.push(datatypes.number())
    } else {
      values.push(generator())
    }

    if (i < len - 1) {
      values.push(random.item(['+', '-', '*', '/']))
    }
  }

  return `calc(${values.join(' ')})`
}

class datatypes {
  /**
   * Generator for CSS <angle> data type
   *
   * @returns {string}
   */
  static angle () {
    let [suffix, limit] = random.item([
      ['deg', 360],
      ['grad', 400],
      ['rad', Math.PI * 2],
      ['turn', 1]
    ])

    // Occasionally, exceed the limit
    if (random.chance(100)) {
      limit = limit * make.number.any()
    }

    if (random.chance(75)) {
      return calc(datatypes.angle)
    }

    return `${make.number.frange(0, limit)}${suffix}`
  }

  /**
   * Generator for CSS <decibel> data type
   * @returns {string}
   */
  static decibel () {
    return `${make.number.any()}dB`
  }

  /**
   * Generator for CSS <dimension> data type
   * @returns {string}
   */
  static dimension () {
    switch (random.number(4)) {
      case 0:
        return datatypes.frequency()
      case 1:
        return datatypes.time()
      case 2:
        return datatypes.resolution()
      default:
        return datatypes.length()
    }
  }

  /**
   * Generator for CSS <expression> data type
   * @returns {string}
   */
  static expression () {
    // ToDo: Deprecated MS only feature - not complete
    return `expression(body.scrollTop + ${datatypes.length()});`
  }

  /**
   * Generator for CSS <flex> data type
   * @returns {string}
   */
  static flex () {
    return `${make.number.any()}fr`
  }

  /**
   * Generator for CSS <frequency> data type
   * @returns {string}
   */
  static frequency () {
    if (random.chance(75)) {
      return calc(datatypes.frequency)
    }

    const unit = random.item(['Hz', 'kHz'])
    return `${make.number.any()}${unit}`
  }

  /**
   * Generator for CSS <hex-color> data type
   * @returns {string}
   */
  static hexColor () {
    const len = random.item([4, 8])
    return `#${random.hex(len)}`
  }

  /**
   * Generator for CSS <integer> data type
   * @returns {string}
   */
  static integer () {
    if (random.chance(75)) {
      return calc(datatypes.integer)
    }

    return String(make.number.any(false))
  }

  /**
   * Generator for CSS <length> data type
   * @returns {string}
   */
  static length () {
    if (random.chance(75)) {
      return calc(datatypes.length)
    }

    const unit = random.item(['em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax'])
    return `${make.number.any()}${unit}`
  }

  /**
   * Generator for CSS <number> data type
   * @returns {string}
   */
  static number () {
    if (random.chance(75)) {
      return calc(datatypes.number)
    }

    return String(make.number.any())
  }

  /**
   * Generator for CSS <number-one-or-greater> data type
   * @returns {string}
   */
  static numberOneOrGreater () {
    return String(Math.abs(make.number.any()))
  }

  /**
   * Generator for CSS <number-zero-one> data type
   * @returns {string}
   */
  static numberZeroOne () {
    return String(make.number.frange(0, 1))
  }

  /**
   * Generator for CSS <percentage> data type
   * @returns {string}
   */
  static percentage () {
    if (random.chance(75)) {
      return calc(datatypes.percentage)
    }

    return make.unit.percent()
  }

  /**
   * Generator for CSS <positive-integer> data type
   * @returns {string}
   */
  static positiveInteger () {
    return String(Math.abs(make.number.any(false)))
  }

  /**
   * Generator for CSS <progid> data type
   * @returns {string}
   */
  static progid () {
    // ToDo: Deprecated MS only feature - not complete
    switch (random.number(3)) {
      case 0:
        return `progid:DXImageTransform.Microsoft.MotionBlur(strength=${make.number.any()})`
      case 1:
        return `progid:DXImageTransform.Microsoft.BasicImage(mirror=1)`
      case 2:
        return `progid:DXImageTransform.Microsoft.Gradient` +
          `(startColorStr="${datatypes.hexColor()}", endColorStr="${datatypes.hexColor()}", GradientType=${make.number.any()})`
    }
  }

  /**
   * Generator for CSS <ratio> data type
   * @returns {string}
   */
  static ratio () {
    if (random.chance(1000)) {
      return `${make.number.unsigned()}/${make.number.unsigned()}`
    }
    return `${random.range(1, 255)}/${random.range(1, 255)}`
  }

  /**
   * Generator for CSS <resolution> data type
   * @returns {string}
   */
  static resolution () {
    const unit = random.item(['dpi', 'dpcm', 'dppx'])
    return `${make.number.any()}${unit}`
  }

  /**
   * Generator for CSS <semitones> data type
   * @returns {string}
   */
  static semitones () {
    return `${make.number.any()}st`
  }

  /**
   * Generator for CSS <string> data type
   * @returns {string}
   */
  static string () {
    return utils.common.quote(make.text.any())
  }

  /**
   * Generator for CSS <time> data type
   * @returns {string}
   */
  static time () {
    if (random.chance(75)) {
      return calc(datatypes.time)
    }

    const unit = random.item(['s', 'ms'])
    if (unit === 's') {
      return `${random.range(1, 4)}${unit}`
    } else {
      return `${random.range(0, 4000)}${unit}`
    }
  }

  /**
   * Generator for CSS <urange> data type
   * @returns {string}
   */
  static urange () {
    const convert = (n) => (n + 0x10000).toString(16).substr(-4).toUpperCase()
    const end = random.number(65535 + 1)
    const start = random.number(end)
    switch (random.number(3)) {
      case 0:
        return `U+${convert(start)}`
      case 1:
        return `U+${convert(start)}-${convert(end)}`
      case 2:
        return `U+${convert(start).replace(/..$/, '??')}`
    }
  }
}

module.exports = datatypes
