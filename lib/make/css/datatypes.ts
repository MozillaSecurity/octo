/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import cssesc from "cssesc"

import { make } from "../index"
import { random } from "../../random"

/* Interface representing options for ranged datatypes */
interface RangedTypeOptions {
  min: number | null
  max: number | null
}

/**
 * Generate a calc value.
 *
 * @param generator - The value generation function.
 */
export function calc(generator: () => string): string {
  /* eslint-disable @typescript-eslint/no-use-before-define */
  const values: string[] = []

  const op = random.item(["+", "-", "*", "/"])
  switch (op) {
    case "*":
      // at least one of the arguments must be a <number>
      values.push(...random.shuffled([datatypes.number(null), generator()]))
      break
    case "/":
      // right-hand side must be a <number>
      values.push(...[generator(), datatypes.number(null)])
      break
    default:
      for (let i = 0; i < 2; i++) {
        values.push(random.pick([datatypes.number(null), generator()]))
      }
      break
  }

  return `calc(${values.join(` ${op} `)})`
}

/**
 * Simple helper function for extrapolating ranged types.
 *
 * @param min - Minimum value.
 * @param max - Maximum value.
 */
export function expandRange(min: number | null, max: number | null): [number, number] {
  const _min = min !== null ? min : -2147483648
  const _max = max !== null ? max : min == null ? 0x7fffffff : 0xffffffff

  return [_min, _max]
}

/**
 * Class for generating random CSS datatypes.
 */
export class datatypes {
  /**
   * Generate a random <angle> data type.
   *
   * @param opts - Options.
   */
  static angle(opts?: RangedTypeOptions | null): string {
    const [suffix, limit] = random.item([
      ["deg", 360],
      ["grad", 400],
      ["rad", Math.PI * 2],
      ["turn", 1],
    ])

    if (opts) {
      const [min, max] = expandRange(opts.min, opts.max)
      return `${make.numbers.frange(min, max)}${suffix}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.angle(opts))
    }

    return `${make.numbers.frange(0, limit)}${suffix}`
  }

  /**
   * Generate a random <decibel> data type.
   */
  static decibel(): string {
    return `${make.numbers.any()}dB`
  }

  /**
   * Generate a random <dimension> data type.
   *
   * @param opts - Options.
   */
  static dimension(opts?: RangedTypeOptions | null): string {
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
   * Generate a random <expression> data type.
   */
  static expression(): string {
    // ToDo: Deprecated MS only feature - not complete
    return `expression(body.scrollTop + ${datatypes.length()});`
  }

  /**
   * Generate a random <flex> data type.
   */
  static flex(): string {
    return `${make.numbers.any()}fr`
  }

  /**
   * Generate a random <frequency> data type.
   *
   * @param opts - Options.
   */
  static frequency(opts?: RangedTypeOptions | null): string {
    if (opts) {
      const [min, max] = expandRange(opts.min, opts.max)
      const unit = random.item(["Hz", "kHz"])
      return `${make.numbers.frange(min, max)}${unit}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.frequency(opts))
    }

    const unit = random.item(["Hz", "kHz"])
    return `${make.numbers.any()}${unit}`
  }

  /**
   * Generate a random <hex-color> data type.
   */
  static hexColor(): string {
    const len = random.item([4, 8])
    return `#${random.hex(len)}`
  }

  /**
   * Generate a random <integer> data type.
   *
   * @param opts - Options.
   */
  static integer(opts?: RangedTypeOptions | null): string {
    if (opts) {
      const [min, max] = expandRange(opts.min, opts.max)
      return String(random.range(min, max))
    } else if (random.chance(75)) {
      return calc(datatypes.integer)
    }

    return String(make.numbers.any(false))
  }

  /**
   * Generate a random <length> data type.
   *
   * @param opts - Options.
   * @param allowRelative - Allow relative units.
   */
  // @ts-ignore
  static length(opts?: RangedTypeOptions | null, allowRelative = true): string {
    const units = ["cm", "mm", "Q", "in", "pc", "pt", "px"]
    if (!allowRelative) {
      units.push("em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax")
    }

    const unit = random.item(units)
    if (opts) {
      const [min, max] = expandRange(opts.min, opts.max)
      return `${make.numbers.frange(min, max)}${unit}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.length(opts))
    }

    return `${make.numbers.any()}${unit}`
  }

  /**
   * Generate a random <number> data type.
   *
   * @param opts - Options.
   */
  static number(opts?: RangedTypeOptions | null): string {
    if (opts) {
      const [min, max] = expandRange(opts.min, opts.max)
      return String(make.numbers.frange(min, max))
    } else if (random.chance(75)) {
      return calc(() => datatypes.number(opts))
    }

    return String(make.numbers.any(true))
  }

  /**
   * Generate a random <number-one-or-greater> data type.
   */
  static numberOneOrGreater(): string {
    return String(Math.abs(make.numbers.any()))
  }

  /**
   * Generate a random <number-zero-one> data type.
   */
  static numberZeroOne(): string {
    return String(make.numbers.frange(0, 1))
  }

  /**
   * Generate a random <percentage> data type.
   *
   * @param opts - Options.
   */
  static percentage(opts?: RangedTypeOptions | null): string {
    if (opts) {
      const [min, max] = expandRange(opts.min, opts.max)
      return `${random.range(min, max)}%`
    } else if (random.chance(75)) {
      return calc(datatypes.percentage)
    }

    return make.unit.percent()
  }

  /**
   * Generate a random <positive-integer> data type.
   */
  static positiveInteger(): string {
    return String(Math.abs(make.numbers.any(false)))
  }

  /**
   * Generate a random <progid> data type.
   */
  static progid(): string {
    // ToDo: Deprecated MS only feature - not complete
    switch (random.number(3)) {
      case 0:
        return `progid:DXImageTransform.Microsoft.MotionBlur(strength=${make.numbers.any()})`
      case 1:
        return `progid:DXImageTransform.Microsoft.BasicImage(mirror=1)`
      default:
        return (
          `progid:DXImageTransform.Microsoft.Gradient` +
          `(startColorStr="${datatypes.hexColor()}", endColorStr="${datatypes.hexColor()}", GradientType=${make.numbers.any()})`
        )
    }
  }

  /**
   * Generate a random <ratio> data type.
   */
  static ratio(): string {
    if (random.chance(1000)) {
      return `${make.numbers.unsigned()}/${make.numbers.unsigned()}`
    }
    return `${random.range(1, 255)}/${random.range(1, 255)}`
  }

  /**
   * Generate a random <resolution> data type.
   *
   * @param opts - Options.
   */
  static resolution(opts?: RangedTypeOptions | null): string {
    const unit = random.item(["dpi", "dpcm", "dppx"])
    if (opts) {
      const [min, max] = expandRange(opts.min, opts.max)
      return `${make.numbers.frange(min, max)}${unit}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.resolution(opts))
    }

    return `${make.numbers.any()}${unit}`
  }

  /**
   * Generate a random <semitones> data type.
   */
  static semitones(): string {
    return `${make.numbers.any()}st`
  }

  /**
   * Generate a random <string> data type.
   */
  static string(): string {
    return cssesc(make.text.any(), { wrap: true })
  }

  /**
   * Generate a random <time> data type.
   *
   * @param opts - Options.
   */
  static time(opts?: RangedTypeOptions | null): string {
    if (opts) {
      const [min, max] = expandRange(opts.min, opts.max)
      const unit = random.item(["s", "ms"])
      return `${random.range(min, max)}${unit}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.time(opts))
    }

    const unit = random.item(["s", "ms"])
    if (unit === "s") {
      return `${random.range(1, 4)}${unit}`
    } else {
      return `${random.range(0, 4000)}${unit}`
    }
  }

  /**
   * Generate a random <urange> data type.
   */
  static urange(): string {
    const convert = (n: number) => (n + 0x10000).toString(16).substr(-4).toUpperCase()
    const end = random.number(65535 + 1)
    const start = random.number(end)
    switch (random.number(3)) {
      case 0:
        return `U+${convert(start)}`
      case 1:
        return `U+${convert(start)}-${convert(end)}`
      default:
        return `U+${convert(start).replace(/..$/, "??")}`
    }
  }
}
