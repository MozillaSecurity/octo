/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from '../index'
import { random } from '../../random'
import { utils } from '../../utils'

/* Interface representing options for ranged datatypes */
interface RangedTypeOptions {
  min?: number | null;
  max?: number | null;
}

/* Interface representing options for <length> datatype */
interface RangedLengthOptions extends RangedTypeOptions {
  noRelative?: boolean;
}

/**
 * Simple helper function for extrapolating ranged types
 *
 * @param {number?} min - Minimum value
 * @param {number?} max - Maximum value
 */
function expandRange (min: number | null, max: number | null) {
  const _min = (min !== null) ? min : -2147483648
  const _max = (max !== null)
    ? max : (_min == null)
      ? 0x7fffffff : 0xffffffff

  return [_min, _max]
}

/**
 * Generate a calc value
 *
 * @param {Function} generator - The value generation function
 * @returns {string}
 */
export function calc (generator: () => string) {
  /* eslint-disable @typescript-eslint/no-use-before-define */
  const values: string[] = []

  const op = random.item(['+', '-', '*', '/'])
  switch (op) {
    case '*':
      // at least one of the arguments must be a <number>
      values.push(...random.shuffled([datatypes.number(), generator()]))
      break
    case '/':
      // right-hand side must be a <number>
      values.push(...[generator(), datatypes.number()])
      break
    default:
      for (let i = 0; i < 2; i++) {
        values.push(random.pick([datatypes.number(), generator()]))
      }
      break
  }

  return `calc(${values.join(` ${op} `)})`
}

export class datatypes {
  /**
   * Generator for CSS <angle> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  static angle (opts: RangedTypeOptions = {}) {
    const [suffix, limit] = random.item([
      ['deg', 360],
      ['grad', 400],
      ['rad', Math.PI * 2],
      ['turn', 1]
    ])

    if (opts.min !== undefined && opts.max !== undefined) {
      const [max, min] = expandRange(opts.min, opts.max)
      return `${make.numbers.frange(min, max)}${suffix}`
    } else if (random.chance(75)) {
      return calc(datatypes.angle)
    }

    return `${make.numbers.frange(0, limit)}${suffix}`
  }

  /**
   * Generator for CSS <decibel> data type
   *
   * @returns {string}
   */
  static decibel () {
    return `${make.numbers.any()}dB`
  }

  /**
   * Generator for CSS <dimension> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  static dimension (opts: RangedTypeOptions = {}) {
    switch (random.number(4)) {
      case 0:
        return datatypes.frequency(opts)
      case 1:
        return datatypes.time(opts)
      case 2:
        return datatypes.resolution(opts)
      default:
        return datatypes.length(opts)
    }
  }

  /**
   * Generator for CSS <expression> data type
   *
   * @returns {string}
   */
  static expression () {
    // ToDo: Deprecated MS only feature - not complete
    return `expression(body.scrollTop + ${datatypes.length()});`
  }

  /**
   * Generator for CSS <flex> data type
   *
   * @returns {string}
   */
  static flex () {
    return `${make.numbers.any()}fr`
  }

  /**
   * Generator for CSS <frequency> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  static frequency (opts: RangedTypeOptions = {}) {
    if (opts.min !== undefined && opts.max !== undefined) {
      // A max of null represents infinity
      const [max, min] = expandRange(opts.min, opts.max)
      const unit = random.item(['Hz', 'kHz'])
      return `${make.numbers.frange(min, max)}${unit}`
    } else if (random.chance(75)) {
      return calc(datatypes.frequency)
    }

    const unit = random.item(['Hz', 'kHz'])
    return `${make.numbers.any()}${unit}`
  }

  /**
   * Generator for CSS <hex-color> data type
   *
   * @returns {string}
   */
  static hexColor () {
    const len = random.item([4, 8])
    return `#${random.hex(len)}`
  }

  /**
   * Generator for CSS <integer> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  static integer (opts: RangedTypeOptions = {}) {
    if (opts.min !== undefined && opts.max !== undefined) {
      const [max, min] = expandRange(opts.min, opts.max)
      return String(random.range(min, max))
    } else if (random.chance(75)) {
      return calc(datatypes.integer)
    }

    return String(make.numbers.any(false))
  }

  /**
   * Generator for CSS <length> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  // @ts-ignore
  static length (opts: RangedLengthOptions = {}) {
    const units = ['cm', 'mm', 'Q', 'in', 'pc', 'pt', 'px']
    if (!opts.noRelative) {
      units.push('em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax')
    }

    const unit = random.item(units)
    if (opts.min !== undefined && opts.max !== undefined) {
      const [max, min] = expandRange(opts.min, opts.max)
      return `${make.numbers.frange(min, max)}${unit}`
    } else if (random.chance(75)) {
      return calc(datatypes.length)
    }

    return `${make.numbers.any()}${unit}`
  }

  /**
   * Generator for CSS <number> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  static number (opts: RangedTypeOptions = {}) {
    if (opts.min !== undefined && opts.max !== undefined) {
      const [max, min] = expandRange(opts.min, opts.max)
      return String(make.numbers.frange(min, max))
    } else if (random.chance(75)) {
      return calc(datatypes.number)
    }

    return String(make.numbers.any(true))
  }

  /**
   * Generator for CSS <number-one-or-greater> data type
   *
   * @returns {string}
   */
  static numberOneOrGreater () {
    return String(Math.abs(make.numbers.any()))
  }

  /**
   * Generator for CSS <number-zero-one> data type
   *
   * @returns {string}
   */
  static numberZeroOne () {
    return String(make.numbers.frange(0, 1))
  }

  /**
   * Generator for CSS <percentage> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  static percentage (opts: RangedTypeOptions = {}) {
    if (opts.min !== undefined && opts.max !== undefined) {
      const [max, min] = expandRange(opts.min, opts.max)
      return `${random.range(min, max)}%`
    } else if (random.chance(75)) {
      return calc(datatypes.percentage)
    }

    return make.unit.percent()
  }

  /**
   * Generator for CSS <positive-integer> data type
   *
   * @returns {string}
   */
  static positiveInteger () {
    return String(Math.abs(make.numbers.any(false)))
  }

  /**
   * Generator for CSS <progid> data type
   *
   * @returns {string}
   */
  static progid () {
    // ToDo: Deprecated MS only feature - not complete
    switch (random.number(3)) {
      case 0:
        return `progid:DXImageTransform.Microsoft.MotionBlur(strength=${make.numbers.any()})`
      case 1:
        return `progid:DXImageTransform.Microsoft.BasicImage(mirror=1)`
      default:
        return `progid:DXImageTransform.Microsoft.Gradient` +
          `(startColorStr="${datatypes.hexColor()}", endColorStr="${datatypes.hexColor()}", GradientType=${make.numbers.any()})`
    }
  }

  /**
   * Generator for CSS <ratio> data type
   *
   * @returns {string}
   */
  static ratio () {
    if (random.chance(1000)) {
      return `${make.numbers.unsigned()}/${make.numbers.unsigned()}`
    }
    return `${random.range(1, 255)}/${random.range(1, 255)}`
  }

  /**
   * Generator for CSS <resolution> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  static resolution (opts: RangedTypeOptions = {}) {
    const unit = random.item(['dpi', 'dpcm', 'dppx'])
    if (opts.min !== undefined && opts.max !== undefined) {
      const [max, min] = expandRange(opts.min, opts.max)
      return `${make.numbers.frange(min, max)}${unit}`
    } else {
      return `${make.numbers.any()}${unit}`
    }
  }

  /**
   * Generator for CSS <semitones> data type
   *
   * @returns {string}
   */
  static semitones () {
    return `${make.numbers.any()}st`
  }

  /**
   * Generator for CSS <string> data type
   *
   * @returns {string}
   */
  static string () {
    return utils.common.quote(make.text.any())
  }

  /**
   * Generator for CSS <time> data type
   *
   * @param {RangedTypeOptions} opts - Options
   * @returns {string}
   */
  static time (opts: RangedTypeOptions = {}) {
    if (opts.min !== undefined && opts.max !== undefined) {
      const [max, min] = expandRange(opts.min, opts.max)
      const unit = random.item(['s', 'ms'])
      return `${random.range(min, max)}${unit}`
    } else if (random.chance(75)) {
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
   *
   * @returns {string}
   */
  static urange () {
    const convert = (n: number) => (n + 0x10000).toString(16).substr(-4).toUpperCase()
    const end = random.number(65535 + 1)
    const start = random.number(end)
    switch (random.number(3)) {
      case 0:
        return `U+${convert(start)}`
      case 1:
        return `U+${convert(start)}-${convert(end)}`
      default:
        return `U+${convert(start).replace(/..$/, '??')}`
    }
  }
}
