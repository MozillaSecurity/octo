/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

/** Generic tracking object Generates unique identifiers for a given prefix. */
export class tracker {
  /** Recorded tracker entries. */
  private readonly tracker: Record<string, string[]>
  /** Create a new instance. */
  constructor() {
    this.tracker = {}
  }

  /**
   * Add a new tracker value. If the prefix doesn't exist, initialize it.
   *
   * @param prefix - Prefix of item to track.
   * @param value - Optional value to store.
   */
  add(prefix: string, value?: string): string {
    if (!(prefix in this.tracker)) {
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
   * Retrieve an id for the supplied prefix. If the prefix doesn't already exist, return the initial
   * value without initializing it.
   *
   * @param prefix - Prefix of item to track.
   */
  get(prefix: string): string {
    if (!(prefix in this.tracker)) {
      this.tracker[prefix] = [`${prefix}_0`]
    }

    return random.item(this.tracker[prefix])
  }

  /**
   * Returns the number of ids for the supplied prefix.
   *
   * @param prefix - Prefix of item to track.
   */
  length(prefix: string): number {
    return prefix in this.tracker ? this.tracker[prefix].length : 0
  }
}
