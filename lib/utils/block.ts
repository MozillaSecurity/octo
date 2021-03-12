/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

export class block {
  static block(list: any[], optional?: boolean) {
    if (optional === true) {
      if (random.chance(6)) {
        return ""
      }
    }

    /**
     * Recursively pick through list
     *
     * @param {*} item - Item to pick
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

    let asString = ""
    for (let i = 0; i < list.length; i++) {
      asString += deeper(list[i])
    }

    return asString
  }
}
