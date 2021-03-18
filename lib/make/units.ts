/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from "../make"
import { random } from "../random"

/**
 * Class for generating random values with units.
 */
export class unit {
  /**
   * Generate a random length unit.
   */
  static unit(): string {
    return random.item(["px", "em", "ex", "ch", "rem", "mm", "cm", "in", "pt", "pc", "%"])
  }

  /**
   * Generate a random length value.
   */
  // @ts-ignore
  static length(): string {
    return make.numbers.any() + make.unit.unit()
  }

  /**
   * Generate a random percent.
   */
  static percent(): string {
    if (random.chance(100)) {
      return `${make.numbers.any()}%`
    }

    return `${random.number(100 + 1)}%`
  }
}
