/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { random } = require('../polyfills')

/**
 * Generic tracking object
 * Generates unique identifiers for a given prefix
 */
class tracker {
  /**
   * Create a new instance
   */
  constructor () {
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
  add (prefix, value = null) {
    if (!this.tracker.hasOwnProperty(prefix)) {
      this.tracker[prefix] = []
    }

    if (value) {
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
  get (prefix) {
    if (!this.tracker.hasOwnProperty(prefix)) {
      this.tracker[prefix] = [`${prefix}_0`]
    }

    return random.item(this.tracker[prefix])
  }
}

module.exports = tracker
