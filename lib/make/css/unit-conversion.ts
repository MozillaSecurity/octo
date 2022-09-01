/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** Configuration options required for relative unit conversions. */
export interface BrowserDisplayOptions {
  /** Target screen resolution. */
  resolution?: number
  /** Target font-size. */
  fontSize?: number
  /** Target line-height. */
  lineHeight?: number
  /** Target viewport width. */
  viewportWidth?: number
  /** Target viewport height. */
  viewportHeight?: number
}

const VIEW_OPTS: Required<BrowserDisplayOptions> = {
  resolution: 96,
  fontSize: 16,
  lineHeight: 1.2,
  viewportWidth: 1024,
  viewportHeight: 768,
}

/** Convert between various angle units. */
export class Angle {
  /**
   * Convert an angle value in degrees to an alternative angle unit.
   *
   * @param value - The value.
   * @param unit - The unit.
   */
  static fromDeg(value: number, unit: string): number {
    switch (unit) {
      case "deg":
        return value
      case "grad":
        return (value / 360) * 400
      case "rad":
        return value * (Math.PI / 180)
      case "turn":
        return value / 360
    }

    throw new Error(`Invalid unit! (${unit})`)
  }

  /**
   * Convert an angle value with a unit to degrees.
   *
   * @param value - The value.
   * @param unit - The unit.
   */
  static toDeg(value: number, unit: string): number {
    switch (unit) {
      case "deg":
        return value
      case "grad":
        return (value / 400) * 360
      case "rad":
        return value * (180 / Math.PI)
      case "turn":
        return value * 360
    }

    throw new Error(`Invalid unit! (${unit})`)
  }
}

/** Convert between various frequency units. */
export class Frequency {
  /**
   * Convert a frequency value in kHz to an alternative frequency unit.
   *
   * @param value - The value.
   * @param unit - The unit.
   */
  static fromKhz(value: number, unit: string): number {
    switch (unit) {
      case "Hz":
        return value / 1000
      case "kHz":
        return value
    }

    throw new Error(`Invalid unit! (${unit})`)
  }

  /**
   * Convert a frequency value with a unit to kHz.
   *
   * @param value - The value.
   * @param unit - The unit.
   */
  static toKhz(value: number, unit: string): number {
    switch (unit) {
      case "Hz":
        return value * 1000
      case "kHz":
        return value
    }

    throw new Error(`Invalid unit! (${unit})`)
  }
}

/** Convert between various length units. */
export class Length {
  /**
   * Convert a length value in px to an alternative time unit.
   *
   * @param value - The value.
   * @param unit - The unit.
   * @param options - Optional resolution, font-size, and viewport values to override.
   */
  static fromPx(value: number, unit: string, options?: BrowserDisplayOptions): number {
    const _options = { ...VIEW_OPTS, ...options }
    switch (unit) {
      // Absolute lengths
      case "cm":
        return (value / _options.resolution) * 2.54
      case "mm":
        return (value / _options.resolution) * 2.54 * 10
      case "Q":
        return (value / _options.resolution) * 2.54 * 40
      case "in":
        return value / _options.resolution
      case "pc":
        return (value / _options.resolution) * 6
      case "pt":
        return (value * 72) / _options.resolution
      case "px":
        return value
      // Font-relative lengths
      case "em":
      case "rem":
        return value / _options.fontSize
      case "ex":
      case "rex":
        // 	In the cases where it is impossible or impractical to determine the
        // 	x-height, a value of 0.5em must be assumed.
        return value / (_options.fontSize * 0.5)
      case "cap":
      case "rcap":
        // This is a guess
        return value / (_options.fontSize * 0.75)
      case "ch":
      case "rch":
        // 	In the cases where it is impossible or impractical to determine the
        // 	cap-height, the font’s ascent must be used.
        return value / (_options.fontSize * 0.5)
      case "ic":
      case "ric":
        // In the cases where it is impossible or impractical to determine the
        // ideographic advance measure, it must be assumed to be 1em.
        return value / _options.fontSize
      case "lh":
      case "rlh":
        // Equal to the computed value of the line-height property of the element on
        // which it is used.
        return value / (_options.fontSize * 1.2)
    }

    throw new Error(`Invalid unit! (${unit})`)
  }

  /**
   * Convert a length value with a unit to px.
   *
   * @param value - The value.
   * @param unit - The unit.
   * @param options - Optional resolution, font-size, and viewport values to override.
   */
  static toPx(value: number, unit: string, options?: BrowserDisplayOptions): number {
    const _options = { ...VIEW_OPTS, ...options }
    switch (unit) {
      // Absolute units
      case "cm":
        return (value * _options.resolution) / 2.54
      case "mm":
        return (value * _options.resolution) / (2.54 * 10)
      case "Q":
        return (value * _options.resolution) / (2.54 * 40)
      case "in":
        return value * _options.resolution
      case "pc":
        return (value / 6) * _options.resolution
      case "pt":
        return (value / 72) * _options.resolution
      case "px":
        return value
      // Font-relative lengths
      case "em":
      case "rem":
        return value * _options.fontSize
      case "ex":
      case "rex":
        // 	In the cases where it is impossible or impractical to determine the
        // 	x-height, a value of 0.5em must be assumed.
        return value * (_options.fontSize * 0.5)
      case "cap":
      case "rcap":
        // This is a guess
        return value * (_options.fontSize * 0.75)
      case "ch":
      case "rch":
        // 	In the cases where it is impossible or impractical to determine the
        // 	cap-height, the font’s ascent must be used.
        return value * (_options.fontSize * 0.5)
      case "ic":
      case "ric":
        // In the cases where it is impossible or impractical to determine the
        // ideographic advance measure, it must be assumed to be 1em.
        return value * _options.fontSize
      case "lh":
      case "rlh":
        // Equal to the computed value of the line-height property of the element on
        // which it is used.  Line-height `normal` is typically 1.2em.
        return value * _options.fontSize * 1.2
    }

    throw new Error(`Invalid unit! (${unit})`)
  }
}

/** Convert between various resolution units. */
export class Resolution {
  /**
   * Convert a resolution value in dppx to an alternative resolution unit.
   *
   * @param value - The value.
   * @param unit - The unit.
   * @param options - Optional resolution to override.
   */
  static fromDppx(value: number, unit: string, options?: BrowserDisplayOptions): number {
    const _options = { ...VIEW_OPTS, ...options }
    switch (unit) {
      case "dppx":
        return value
      case "dpi":
        return value / _options.resolution
      case "dpcm":
        return value / _options.resolution / 2.54
    }

    throw new Error(`Invalid unit! (${unit})`)
  }

  /**
   * Convert a resolution value with a unit to dppx.
   *
   * @param value - The value.
   * @param unit - The unit.
   * @param options - Optional resolution to override.
   */
  static toDppx(value: number, unit: string, options?: BrowserDisplayOptions): number {
    const _options = { ...VIEW_OPTS, ...options }
    switch (unit) {
      case "dppx":
        return value
      case "dpi":
        return value * _options.resolution
      case "dpcm":
        return value * 2.54 * _options.resolution
    }

    throw new Error(`Invalid unit! (${unit})`)
  }
}

/** Convert between various time units. */
export class Time {
  /**
   * Convert a time value in ms to an alternative time unit.
   *
   * @param value - The value.
   * @param unit - The unit.
   */
  static fromMs(value: number, unit: string): number {
    switch (unit) {
      case "ms":
        return value
      case "s":
        return value / 1000
    }

    throw new Error(`Invalid unit! (${unit})`)
  }

  /**
   * Convert a time value with a unit to ms.
   *
   * @param value - The value.
   * @param unit - The unit.
   */
  static toMs(value: number, unit: string): number {
    switch (unit) {
      case "ms":
        return value
      case "s":
        return value * 1000
    }

    throw new Error(`Invalid unit! (${unit})`)
  }
}
