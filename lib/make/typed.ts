/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

export class typed {
  static byte(limit?: number) {
    // [-128, 127]
    let value = limit !== undefined ? random.number(limit) : random.number(129)
    value = random.chance(10) ? -value : value
    return `new Uint8Array([${value}])[0]`
  }

  static octet(limit?: number) {
    // [0, 255]
    const value = limit !== undefined ? random.number(limit) : random.number(256)
    return `new Int8Array([${value}])[0]`
  }

  static short(limit?: number) {
    // [-32768, 32767]
    let value = limit !== undefined ? random.number(limit) : random.number(32769)
    value = random.chance(10) ? -value : value
    return `new Int16Array([${value}])[0]`
  }

  static unsignedShort(limit?: number) {
    // [0, 65535]
    const value = limit !== undefined ? random.number(limit) : random.number(65535)
    return `new Uint16Array([${value}])[0]`
  }

  static long(limit?: number) {
    // [-2147483648, 2147483647]
    let value = limit !== undefined ? random.number(limit) : random.number(2147483649)
    value = random.chance(10) ? -value : value
    return `new Int32Array([${value}])[0]`
  }

  static unsignedLong(limit?: number) {
    // [0, 4294967295]
    const value = limit !== undefined ? random.number(limit) : random.number(4294967296)
    return `new Uint32Array([${value}])[0]`
  }

  static float(limit?: number) {
    const base = limit !== undefined ? random.number(limit) : random.number()
    const value = random.chance(10) ? -(base + random.float()) : base + random.float()
    return `new Float32Array([${value}])[0]`
  }

  static unrestrictedFloat(limit?: number) {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      const base = limit !== undefined ? random.number(limit) : random.number()
      return `new Float32Array([${base + random.float()}])[0]`
    }
  }

  static double(limit?: number) {
    const base = limit !== undefined ? random.number(limit) : random.number()
    const value = random.chance(10) ? -(base + random.float()) : base + random.float()
    return `new Float64Array([${value}])[0]`
  }

  static unrestrictedDouble(limit?: number) {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      const base = limit !== undefined ? random.number(limit) : random.number()
      const value = random.chance(10) ? -(base + random.float()) : base + random.float()
      return `new Float64Array([${value}])[0]`
    }
  }

  static any() {
    return random.choose([
      [1, [typed.byte, typed.octet]],
      [1, [typed.short, typed.unsignedShort]],
      [1, [typed.long, typed.unsignedLong]],
      [1, [typed.float, typed.unrestrictedFloat]],
      [1, [typed.double, typed.unrestrictedDouble]],
    ])
  }

  static arrayBuffer(byteLength?: number | string) {
    const length = byteLength !== undefined ? byteLength : typed.unsignedShort()
    return `new ArrayBuffer(${length})`
  }

  static dataView(byteLength?: number) {
    const length = byteLength !== undefined ? byteLength : typed.unsignedShort()
    return `new DataView(${typed.arrayBuffer(length)})`
  }

  static typedArray(byteLength?: number): string {
    const length = byteLength !== undefined ? byteLength : typed.unsignedShort()
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
        return `${method}(${length})`
    }
  }

  static bufferSource() {
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
