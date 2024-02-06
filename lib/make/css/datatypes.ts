/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import cssesc from "cssesc"

import { Angle, Frequency, Length, Resolution, Time } from "./unit-conversion"
import { make } from "../index"
import { random } from "../../random"

type RangedTypeOption = string | number | null

/** Interface representing options for ranged datatypes. */
export interface RangedTypeOptions {
  /** Minimum value. */
  min: RangedTypeOption
  /** Maximum value. */
  max: RangedTypeOption
}

/**
 * Generate a calc value.
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
 * Normalize suffix for RangedTypeOptions.
 *
 * Both min and max are not required to contain a suffix (i.e. `<time [0, 100s]>`). Ensures the
 * suffix exists on both.
 * @param min - Minimum value.
 * @param max - Maximum value.
 */
export function normalizeSuffix(
  min: RangedTypeOption,
  max: RangedTypeOption,
): [RangedTypeOption, RangedTypeOption] {
  let suffix = typeof min === "string" ? min.match(/[a-zA-Z]+/g) : null
  if (suffix === null && typeof max === "string") {
    suffix = max.match(/[a-zA-Z]+/g)
  }

  // Both min and max are not required to contain a suffix (i.e. <time [0, 100s]>)
  // Ensure the suffix exists on both
  if (suffix) {
    min = min !== null && !String(min).includes(suffix[0]) ? `${min}${suffix[0]}` : min
    max = max !== null && !String(max).includes(suffix[0]) ? `${max}${suffix[0]}` : max
  }

  return [min, max]
}

/**
 * Split length and unit.
 * @param value - The value to split.
 */
export function splitUnit(value: string): [number, string] {
  const match = value.match(/^(-?[0-9]+)([a-z]+$)/)
  if (match && match.length === 3) {
    const digit = Number(match[1])
    const unit = match[2]
    if (!Number.isNaN(digit)) {
      return [digit, unit]
    }
  }

  throw new Error(`Invalid value! (${value})`)
}

/**
 * Simple helper function for extrapolating ranged types.
 * @param min - Minimum value.
 * @param max - Maximum value.
 */
export function expandRange(min: number | null, max: number | null): [number, number] {
  const _min = min !== null ? min : -0x80000000
  const _max = max !== null ? max : min == null ? 0x7fffffff : 0xffffffff

  return [_min, _max]
}

/** Class for generating random CSS datatypes. */
export class datatypes {
  /**
   * Generate a random <angle> data type.
   * @param opts - Options.
   */
  static angle(opts?: RangedTypeOptions | null): string {
    const unit = random.item(["deg", "grad", "rad", "turn"])

    if (opts) {
      const [_min, _max] = normalizeSuffix(opts.min, opts.max)
      // Convert both to a singular base type (degrees)
      const min = typeof _min !== "string" ? _min : Angle.toDeg(...splitUnit(_min))
      const max = typeof _max !== "string" ? _max : Angle.toDeg(...splitUnit(_max))
      const value = make.numbers.frange(...expandRange(min, max))
      return `${Angle.fromDeg(value, unit)}${unit}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.angle(opts))
    }

    return `${make.numbers.frange(-0x80000000, 0x7fffffff)}${unit}`
  }

  /** Generate a random <an-plus-b> data type. */
  static anPlusB(): string {
    switch (random.number(4)) {
      case 0:
        return random.item(["odd", "even"])
      case 1:
        return random.item(["+", "-", ""]) + random.number(4)
      case 2:
        return `${random.pick(["+", "-", ""]) + random.number(4)}n`
      default:
        return `${random.pick(["+", "-", ""])}n${random.pick(["+", "-"])}${random.number(4)}`
    }
  }

  /** Generate a random <decibel> data type. */
  static decibel(): string {
    return `${make.numbers.any()}dB`
  }

  /**
   * Generate a random <dimension> data type.
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

  /** Generate a random <expression> data type. */
  static expression(): string {
    // ToDo: Deprecated MS only feature - not complete
    return `expression(body.scrollTop + ${datatypes.length()});`
  }

  /**
   * Generate a random <flex> data type.
   * @param opts - Options.
   */
  static flex(opts?: RangedTypeOptions | null): string {
    if (opts) {
      const [_min, _max] = normalizeSuffix(opts.min, opts.max)
      const min = typeof _min !== "string" ? _min : splitUnit(_min)[0]
      const max = typeof _max !== "string" ? _max : splitUnit(_max)[0]
      const value = make.numbers.frange(...expandRange(min, max))
      return `${value}fr`
    }
    return `${make.numbers.any()}fr`
  }

  /**
   * Generate a random <frequency> data type.
   * @param opts - Options.
   */
  static frequency(opts?: RangedTypeOptions | null): string {
    const unit = random.item(["Hz", "kHz"])
    if (opts) {
      const [_min, _max] = normalizeSuffix(opts.min, opts.max)
      // Convert both to a singular base type (kHz)
      const min = typeof _min !== "string" ? _min : Frequency.toKhz(...splitUnit(_min))
      const max = typeof _max !== "string" ? _max : Frequency.toKhz(...splitUnit(_max))
      const value = make.numbers.frange(...expandRange(min, max))
      return `${Frequency.fromKhz(value, unit)}${unit}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.frequency(opts))
    }

    return `${make.numbers.any()}${unit}`
  }

  /** Generate a random <hex-color> data type. */
  static hexColor(): string {
    const len = random.item([4, 8])
    return `#${random.hex(len)}`
  }

  /**
   * Generate a random <integer> data type.
   * @param opts - Options.
   */
  static integer(opts?: RangedTypeOptions | null): string {
    // Integer options should never be strings
    if (opts && typeof opts.min !== "string" && typeof opts.max !== "string") {
      const [min, max] = expandRange(opts.min, opts.max)
      return String(random.range(min, max))
    } else if (random.chance(75)) {
      return calc(datatypes.integer)
    }

    return String(make.numbers.any(false))
  }

  /**
   * Generate a random <length> data type.
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
      const [_min, _max] = normalizeSuffix(opts.min, opts.max)
      // Convert both to a singular base type (degrees)
      const min = typeof _min !== "string" ? _min : Length.toPx(...splitUnit(_min))
      const max = typeof _max !== "string" ? _max : Length.toPx(...splitUnit(_max))
      const value = make.numbers.frange(...expandRange(min, max))
      return `${Length.fromPx(value, unit)}${unit}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.length(opts))
    }

    return `${make.numbers.any()}${unit}`
  }

  /**
   * Generate a random <number> data type.
   * @param opts - Options.
   */
  static number(opts?: RangedTypeOptions | null): string {
    // Number options should never be strings
    if (opts && typeof opts.min !== "string" && typeof opts.max !== "string") {
      const [min, max] = expandRange(opts.min, opts.max)
      return String(make.numbers.frange(min, max))
    } else if (random.chance(75)) {
      return calc(() => datatypes.number(opts))
    }

    return String(make.numbers.any(true))
  }

  /** Generate a random <number-one-or-greater> data type. */
  static numberOneOrGreater(): string {
    return String(Math.abs(make.numbers.any()))
  }

  /** Generate a random <number-zero-one> data type. */
  static numberZeroOne(): string {
    return String(make.numbers.frange(0, 1))
  }

  /**
   * Generate a random <percentage> data type.
   * @param opts - Options.
   */
  static percentage(opts?: RangedTypeOptions | null): string {
    // Percentage options should never be strings
    if (opts && typeof opts.min !== "string" && typeof opts.max !== "string") {
      const [min, max] = expandRange(opts.min, opts.max)
      return `${random.range(min, max)}%`
    } else if (random.chance(75)) {
      return calc(datatypes.percentage)
    }

    return make.unit.percent()
  }

  /** Generate a random <positive-integer> data type. */
  static positiveInteger(): string {
    return String(Math.abs(make.numbers.any(false)))
  }

  /** Generate a random <progid> data type. */
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

  /** Generate a random <ratio> data type. */
  static ratio(): string {
    if (random.chance(1000)) {
      return `${make.numbers.unsigned()}/${make.numbers.unsigned()}`
    }
    return `${random.range(1, 255)}/${random.range(1, 255)}`
  }

  /**
   * Generate a random <resolution> data type.
   * @param opts - Options.
   */
  static resolution(opts?: RangedTypeOptions | null): string {
    const unit = random.item(["dpi", "dpcm", "dppx"])
    if (opts) {
      const [_min, _max] = normalizeSuffix(opts.min, opts.max)
      // Convert both to a singular base type (dppx)
      const min = typeof _min !== "string" ? _min : Resolution.toDppx(...splitUnit(_min))
      const max = typeof _max !== "string" ? _max : Resolution.toDppx(...splitUnit(_max))
      const value = make.numbers.frange(...expandRange(min, max))
      return `${Resolution.fromDppx(value, unit)}${unit}`
    }

    return `${Math.abs(make.numbers.any())}${unit}`
  }

  /** Generate a random <semitones> data type. */
  static semitones(): string {
    return `${make.numbers.any()}st`
  }

  /** Generate a random <string> data type. */
  static string(): string {
    return cssesc(make.text.any(), { wrap: true })
  }

  /**
   * Generate a random <time> data type.
   * @param opts - Options.
   */
  static time(opts?: RangedTypeOptions | null): string {
    const unit = random.item(["s", "ms"])
    if (opts) {
      const [_min, _max] = normalizeSuffix(opts.min, opts.max)
      // Convert both to a singular base type (dppx)
      const min = typeof _min !== "string" ? _min : Time.toMs(...splitUnit(_min))
      const max = typeof _max !== "string" ? _max : Time.toMs(...splitUnit(_max))
      const value = make.numbers.frange(...expandRange(min, max))
      return `${Time.fromMs(value, unit)}${unit}`
    } else if (random.chance(75)) {
      return calc(() => datatypes.time(opts))
    }

    if (unit === "s") {
      return `${random.range(1, 4)}${unit}`
    } else {
      return `${random.range(0, 4000)}${unit}`
    }
  }

  /** Generate a random <urange> data type. */
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
