/* eslint no-extend-native: ["error", { "exceptions": ["String", "Array"] }] */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Determine if an object is a vanilla object.
 *
 * @param obj - The object to evaluate.
 */
function isObject(obj: any) {
  return (
    obj !== null &&
    typeof obj === "object" &&
    Object.prototype.toString.call(obj) === "[object Object]"
  )
}

/** Various polyfills. */
export class prototypes {
  /** Polyfills Object.isObject and String.insert. */
  static enable(): void {
    if (!("isObject" in Object)) {
      ;(Object as any).prototype.isObject = isObject
    }

    if (!("insert" in String)) {
      /**
       * Inserts a string at the supplied position.
       *
       * @param data - The string to insert.
       * @param i - The location to insert it.
       */
      String.prototype.insert = function (data, i) {
        return this.slice(0, i) + data + this.slice(i, this.length)
      }
    }
  }
}
