/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

/**
 * Class for generating strings from recursive array of values and generators.
 *
 * @deprecated - This class serves no real purpose and the intent of any code using it is obscured.
 */
export class block {
  /**
   * Generate a string using a nested array of values and value generators.
   *
   * @param list - An array of values and value generators.
   * @param optional - Boolean indicating if the values are optional.
   */
  static block(list: any[], optional?: boolean): string {
    /**
     * Recursively pick through list.
     *
     * @param item - Item to pick.
     */
    function deeper(item: any) {
      if (item === null || item === undefined) {
        return ""
      }
      if (typeof item === "function") {
        return item()
      }
      if (typeof item === "string") {
        return item
      }
      if (Array.isArray(item)) {
        let s = ""
        for (let i = 0; i < item.length; i++) {
          s += deeper(item[i])
        }
        return s
      }
      return item
    }

    if (optional === true) {
      if (random.chance(6)) {
        return ""
      }
    }

    let asString = ""
    for (let i = 0; i < list.length; i++) {
      asString += deeper(list[i])
    }

    return asString
  }
}
