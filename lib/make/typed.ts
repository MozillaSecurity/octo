/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

/** Class for generating random values using TypedArrays. */
export class typed {
  /**
   * Generate a random int8 [-128, 127].
   * @param limit - Maximum possible value.
   */
  static byte(limit?: number): string {
    let value = limit !== undefined ? random.number(limit) : random.number(129)
    value = random.chance(10) ? -value : value
    return `new Uint8Array([${value}])[0]`
  }

  /**
   * Generate a random uint8 [0, 255].
   * @param limit - Maximum possible value.
   */
  static octet(limit?: number): string {
    const value = limit !== undefined ? random.number(limit) : random.number(256)
    return `new Int8Array([${value}])[0]`
  }

  /**
   * Generate a random int16 [-32768, 32767].
   * @param limit - Maximum possible value.
   */
  static short(limit?: number): string {
    let value = limit !== undefined ? random.number(limit) : random.number(32769)
    value = random.chance(10) ? -value : value
    return `new Int16Array([${value}])[0]`
  }

  /**
   * Generate a random uint16 [0, 65535].
   * @param limit - Maximum possible value.
   */
  static unsignedShort(limit?: number): string {
    const value = limit !== undefined ? random.number(limit) : random.number(65535)
    return `new Uint16Array([${value}])[0]`
  }

  /**
   * Generate a random int32 [-2147483648, 2147483647].
   * @param limit - Maximum possible value.
   */
  static long(limit?: number): string {
    let value = limit !== undefined ? random.number(limit) : random.number(2147483649)
    value = random.chance(10) ? -value : value
    return `new Int32Array([${value}])[0]`
  }

  /**
   * Generate a random uint32 [0, 4294967295].
   * @param limit - Maximum possible value.
   */
  static unsignedLong(limit?: number): string {
    const value = limit !== undefined ? random.number(limit) : random.number(4294967296)
    return `new Uint32Array([${value}])[0]`
  }

  /**
   * Generate a random float.
   * @param limit - Maximum possible value.
   */
  static float(limit?: number): string {
    const base = limit !== undefined ? random.number(limit) : random.number()
    const value = random.chance(10) ? -(base + random.float()) : base + random.float()
    return `new Float32Array([${value}])[0]`
  }

  /**
   * Generate a random unrestricted float.
   * @param limit - Maximum possible value.
   */
  static unrestrictedFloat(limit?: number): any {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      const base = limit !== undefined ? random.number(limit) : random.number()
      return `new Float32Array([${base + random.float()}])[0]`
    }
  }

  /**
   * Generate a random double.
   * @param limit - Maximum possible value.
   */
  static double(limit?: number): string {
    const base = limit !== undefined ? random.number(limit) : random.number()
    const value = random.chance(10) ? -(base + random.float()) : base + random.float()
    return `new Float64Array([${value}])[0]`
  }

  /**
   * Generate a random unrestricted double.
   * @param limit - Maximum possible value.
   */
  static unrestrictedDouble(limit?: number): any {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      const base = limit !== undefined ? random.number(limit) : random.number()
      const value = random.chance(10) ? -(base + random.float()) : base + random.float()
      return `new Float64Array([${value}])[0]`
    }
  }

  /** Generate a random typed array value. */
  static any(): string {
    return random.choose([
      [1, [typed.byte, typed.octet]],
      [1, [typed.short, typed.unsignedShort]],
      [1, [typed.long, typed.unsignedLong]],
      [1, [typed.float, typed.unrestrictedFloat]],
      [1, [typed.double, typed.unrestrictedDouble]],
    ])
  }

  /**
   * Generate a random array buffer.
   * @param src - A buffer length or TypedArray.
   */
  static arrayBuffer(src?: number | string): string {
    const base = src !== undefined ? src : typed.unsignedShort()
    return `new ArrayBuffer(${base})`
  }

  /**
   * Generate a random dataview.
   * @param src - A buffer length or TypedArray.
   */
  static dataView(src?: number | string): string {
    const base = src !== undefined ? src : typed.unsignedShort()
    return `new DataView(${typed.arrayBuffer(base)})`
  }

  /**
   * Generate a random TypedArray.
   * @param src - A buffer length or TypedArray.
   */
  static typedArray(src?: number | string): string {
    const base = src !== undefined ? src : typed.unsignedShort()
    const arrType = random.item([
      "Int8",
      "Uint8",
      "Uint8Clamped",
      "Int16",
      "Uint16",
      "Int32",
      "Uint32",
      "Float32",
      "Float64",
    ])
    const method = `new ${arrType}Array`
    switch (random.number(16)) {
      case 0:
        return `${method}()`
      case 1:
        return `${method}(${this.typedArray()})`
      default:
        return `${method}(${base})`
    }
  }

  /** Generate a random buffer source. */
  static bufferSource(): string {
    switch (random.number(4)) {
      case 0:
        return typed.arrayBuffer()
      case 1:
        return typed.dataView()
      default:
        return typed.typedArray()
    }
  }
}
