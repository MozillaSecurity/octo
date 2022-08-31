/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from "../make"
import { random } from "../random"

/** Class for performing generic value mutation. */
export class mutate {
  /**
   * Mutate a string.
   *
   * @param src - Source string to mutate.
   */
  static text(src: string): string {
    return src.replace(/[a-zA-Z]+?/g, (m: string) => {
      return random.chance(4) ? m : make.text.any()
    })
  }

  /**
   * Mutate a number.
   *
   * @param src - Source number to mutate.
   */
  static numbers(src: string): string {
    return src.replace(/-?\d+(\.\d+)?/g, (m: string) => {
      return random.chance(4) ? m : String(make.numbers.any())
    })
  }

  /**
   * Mutate the unit in a length value.
   *
   * @param src - The source length to mutate.
   */
  static units(src: string): string {
    return src.replace(/(\d+)(px|em|ex|ch|rem|mm|cm|in|pt|pc|%')/g, (m: string, p1: string) => {
      if (random.chance(4)) {
        return m
      } else {
        return p1 + make.unit.unit()
      }
    })
  }

  /**
   * Randomly mutate the supplied string.
   *
   * @param src - The source string to mutate.
   */
  static random(src: string): string {
    return src.replace(/./g, (m: string) => {
      if (random.chance(20)) {
        if (src.match(/[0-9]/g)) {
          return String(make.numbers.any())
        } else {
          return make.text.any()
        }
      } else {
        return m
      }
    })
  }

  /**
   * Applies a single mutation to the supplied string.
   *
   * @param src - The source string to mutate.
   */
  static any(src: string): string {
    switch (random.number(4)) {
      case 0:
        return mutate.text(src)
      case 1:
        return mutate.numbers(src)
      case 2:
        return mutate.units(src)
      default:
        return mutate.random(src)
    }
  }
}
