/* eslint no-extend-native: ["error", { "exceptions": ["String", "Array"] }] */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export class prototypes {
  static enable() {
    if (!Object.hasOwnProperty("isObject")) {
      // eslint-disable-next-line no-extend-native
      Object.prototype.isObject = function (obj) {
        return (
          obj !== null &&
          typeof obj === "object" &&
          Object.prototype.toString.call(obj) === "[object Object]"
        )
      }
    }

    if (!String.prototype.hasOwnProperty("insert")) {
      String.prototype.insert = function (data, i) {
        return this.slice(0, i) + data + this.slice(i, this.length)
      }
    }
  }
}
