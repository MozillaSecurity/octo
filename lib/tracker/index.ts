/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

/**
 * Generic tracking object
 * Generates unique identifiers for a given prefix
 */
export class tracker {
  private readonly tracker: Record<string, string[]>
  /**
   * Create a new instance
   */
  constructor() {
    this.tracker = {}
  }

  /**
   * Generate a new value
   * If the prefix doesn't exist, initialize it
   *
   * @param {string} prefix - Prefix of item to track
   * @param {?string} value - Optional value to store
   * @returns {string}
   */
  add(prefix: string, value?: string) {
    if (!this.tracker.hasOwnProperty(prefix)) {
      this.tracker[prefix] = []
    }

    if (value !== undefined) {
      this.tracker[prefix].push(value)
    } else {
      this.tracker[prefix].push(`${prefix}_${this.tracker[prefix].length}`)
    }

    return this.tracker[prefix][this.tracker[prefix].length - 1]
  }

  /**
   * Retreive an id for the supplied prefix
   * If the prefix doesn't already exist, return the initial value without initializing it
   *
   * @param {string} prefix - Prefix of item to track
   * @returns {string}
   */
  get(prefix: string) {
    if (!this.tracker.hasOwnProperty(prefix)) {
      this.tracker[prefix] = [`${prefix}_0`]
    }

    return random.item(this.tracker[prefix])
  }

  /**
   * Returns the number of ids for the supplied prefix
   *
   * @param {string} prefix - Prefix of item to track
   * @returns {number}
   */
  length(prefix: string) {
    return this.tracker.hasOwnProperty(prefix) ? this.tracker[prefix].length : 0
  }
}
