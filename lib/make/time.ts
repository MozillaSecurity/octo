/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from "../make"
import { random } from "../random"

/**
 * Class for generating time related values.
 */
export class time {
  /**
   * Generate a random time unit.
   */
  static unit(): string {
    return random.item(["s", "ms"])
  }

  /**
   * Generate a random datetime object.
   */
  static datetime(): Date {
    if (random.bool()) {
      return new Date(new Date().getTime() + random.number())
    } else {
      return new Date(new Date().getTime() - random.number())
    }
  }

  /**
   * Generate a random date string.
   */
  static date(): string {
    return time.datetime().toDateString()
  }

  /**
   * Generate a random time string.
   */
  static time(): string {
    return time.datetime().toTimeString()
  }

  /**
   * Generate a random ISO string.
   */
  static iso(): string {
    return time.datetime().toISOString()
  }

  /**
   * Generate a random epoch time value.
   */
  static epoch(): number {
    return Math.floor(+time.datetime() / 1000)
  }

  /**
   * Generate a random time value.
   */
  static any(): string {
    return make.numbers.any() + time.unit()
  }
}
