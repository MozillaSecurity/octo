/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

/**
 * Class for generating random numerical values.
 */
export class numbers {
  /**
   * Returns a number that is more likely to exceed the supplied boundary.
   *
   * @param value - Source value.
   */
  static _exceed(value: number): number {
    switch (random.number(4)) {
      case 0:
        // Divisions
        return Math.ceil(value / random.range(2, 4))
      case 1: {
        // Powers
        const offset = Math.pow(2, random.range(1, 7))
        return value > 0 ? value - offset : value + offset
      }
      case 2: {
        // Slightly more than the limit
        return value < 0 ? value - random.number(3) : value + random.number(3)
      }
      default:
        // Slightly less than limit
        return value > 0 ? value - random.number(3) : value + random.number(3)
    }
  }

  /**
   * Returns a int8 [-128, 127].
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static int8(bypass = false): number {
    if (bypass || random.chance(50)) {
      return numbers._exceed(
        random.choose([
          [1, -128],
          [10, 127],
        ])
      )
    }

    return random.range(-128, 127)
  }

  /**
   * Returns a uint8 [0, 255].
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static uint8(bypass = false): number {
    if (bypass || random.chance(50)) {
      return numbers._exceed(255)
    }

    return random.range(0, 255)
  }

  /**
   * Returns a int16 [-32768, 32767].
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static int16(bypass = false): number {
    if (bypass || random.chance(50)) {
      return numbers._exceed(
        random.choose([
          [1, -32768],
          [10, 32767],
        ])
      )
    }

    return random.range(-32768, 32767)
  }

  /**
   * Returns a uint16 [0, 65535].
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static uint16(bypass = false): number {
    if (bypass || random.chance(50)) {
      return numbers._exceed(65535)
    }

    return random.range(-0, 65535)
  }

  /**
   * Returns a int32 [-2147483648, 2147483647].
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static int32(bypass = false): number {
    if (bypass || random.chance(50)) {
      return numbers._exceed(
        random.choose([
          [1, -2147483648],
          [10, 2147483647],
        ])
      )
    }

    return random.range(-2147483648, 2147483647)
  }

  /**
   * Returns a uint32 [0, 4294967295].
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static uint32(bypass = false): number {
    if (bypass || random.chance(50)) {
      return numbers._exceed(4294967295)
    }

    return random.range(0, 4294967295)
  }

  /**
   * Returns a random floating point number.
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static float(bypass = false): number {
    const min = 1.2 * 10 ** -38
    const max = 3.4 * 10 ** 38

    if (bypass || random.chance(50)) {
      return numbers._exceed(
        random.choose([
          [1, min],
          [10, max],
        ])
      )
    }

    return numbers.frange(min, max)
  }

  /**
   * Returns a random double.
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static double(bypass = false): number {
    const min = Number.MIN_VALUE
    const max = Number.MAX_VALUE
    if (bypass || random.chance(50)) {
      return numbers._exceed(
        random.choose([
          [1, min],
          [10, max],
        ])
      )
    }

    return numbers.frange(min, max)
  }

  /**
   * Returns a float value within the supplied range.
   *
   * @param min - Start value.
   * @param max - End value.
   * @param precision - Precision.
   */
  static frange(min: number, max: number, precision?: number): number {
    let x = random.float() * (max - min) + min
    if (precision !== undefined) {
      const power = Math.pow(10, precision)
      x = Math.round(x * power) / power
    }
    return x
  }

  /**
   * Returns a random power of 2 between 1 and 2048.
   */
  static tiny(): number {
    // Calling random.number twice prefers lower values
    return Math.pow(2, random.number(random.number(13)))
  }

  /**
   * Returns a random number adjacent to the supplied number.
   *
   * @param number - Source value.
   */
  static even(number: number): number {
    return number % 2 === 1 ? ++number : number
  }

  /**
   * Returns a random number that may be interesting.
   */
  static interesting(): number {
    return random.choose([
      [8, [-128, -1, 0, 1, 16, 32, 64, 100, 127, 255]],
      [6, [-32768, -129, 128, 256, 512, 1000, 1024, 4096, 32767, 65535]],
      [4, [-2147483648, -100663046, -32769, 32768, 65536, 100663045, 2147483647, 4294967295]],
      [1, [-2147483649, 2147483648, 4294967296]],
    ])
  }

  /**
   * Returns a random number that may be interesting.
   */
  static interestingUnsigned(): number {
    return random.choose([
      [8, [0, 1, 16, 32, 64, 100, 127, 255]],
      [6, [128, 256, 512, 1000, 1024, 4096, 32767, 65535]],
      [4, [32768, 65536, 100663045, 2147483647, 4294967295]],
      [1, [2147483648, 4294967296]],
    ])
  }

  /**
   * Returns a random signed number.
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static signed(bypass = false): number {
    return random.choose([
      [3, [() => numbers.int8(bypass)]],
      [2, [() => numbers.int16(bypass)]],
      [1, [() => numbers.int32(bypass)]],
    ])
  }

  /**
   * Returns a random unsigned number.
   *
   * @param bypass - Determines if the range should be exceeded.
   */
  static unsigned(bypass = false): number {
    return random.choose([
      [3, [() => numbers.uint8(bypass)]],
      [2, [() => numbers.uint16(bypass)]],
      [1, [() => numbers.uint32(bypass)]],
    ])
  }

  /**
   * Returns a random number using the type base number generators above.
   *
   * @param floats - Allow floats.
   */
  static any(floats = true): number {
    const num = random.choose([
      [50, [numbers.int8, numbers.uint8]],
      [30, [numbers.int16, numbers.uint16]],
      [10, [numbers.int32, numbers.uint32]],
      [1, numbers.double],
    ])

    if (floats && random.chance(10)) {
      return numbers.frange(num, num + 1)
    }

    return num
  }
}
