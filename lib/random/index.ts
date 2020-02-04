/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { logger } from '../logging'
import MersenneTwister from 'mersenne-twister'

export class random {
  private static twister: MersenneTwister
  /**
   * Must be called before any other methods can be called to initialize MersenneTwister
   *
   * @param {?number} seed - Value to initialize MersenneTwister
   */
  static init (seed?: number) {
    if (seed === undefined) {
      seed = new Date().getTime()
    }
    random.twister = new MersenneTwister()
    random.twister.init_seed(seed)
  }

  /**
   * Returns an integer in [0, limit) (uniform distribution)
   *
   * @param {number} limit - Maximum number
   * @param {number} factor - Number of iterations to perform (reduces max)
   */
  static number (limit = 0xffffffff, factor = 1): number {
    if (!random.twister) {
      throw new Error('random.init must be called first.')
    }

    const x = (0x100000000 / limit) >>> 0
    const y = (x * limit) >>> 0
    let r
    do {
      r = random.twister.random_int()
    } while (y && r >= y) // eslint-disable-line no-unmodified-loop-condition

    if (--factor) {
      const v = (r / x) >>> 0
      return this.number(v, factor)
    }

    return (r / x) >>> 0
  }

  /**
   * Returns a float in [0, 1) (uniform distribution)
   */
  static float () {
    if (!random.twister) {
      throw new Error('random.init_seed() must be called first.')
    }

    return random.twister.random_long()
  }

  /**
   * Returns an integer in [start, limit) (uniform distribution)
   *
   * @param {number} start - Minimum value
   * @param {number} limit - Maximum value
   * @param {number} factor - Reduce possibility of maximum by factor
   */
  static range (start: number, limit: number, factor = 1) {
    if (isNaN(start) || isNaN(limit)) {
      logger.traceback()
      throw new TypeError(`random.range() received non-number type: (${start}, ${limit})`)
    }

    return random.number(limit - start + 1, factor) + start
  }

  /**
   * Returns a float in [1, limit). The logarithm has uniform distribution.
   *
   * @param {number} limit - Maximum value
   */
  static ludOneTo (limit: number) {
    return Math.exp(random.float() * Math.log(limit))
  }

  /**
   * Returns a random index from a list
   *
   * @param {Array} list - List to choose from
   * @returns {*}
   */
  static item <T> (list: T[]): T {
    return list[random.number(list.length)]
  }

  /**
   * Returns a random key of a provided object
   *
   * @param {object} obj - Source object
   */
  static key (obj: object) {
    return random.item(Object.keys(obj))
  }

  /**
   * Return a random Boolean value
   */
  static bool () {
    return random.item([true, false])
  }

  /**
   * Recursively iterate over array until non-array item identified
   * If item is a function, evaluate it with no args
   *
   * @param {*} obj - Source object
   * @returns {*}
   */
  static pick (obj: any): any {
    if (typeof obj === 'function') {
      return obj()
    } else if (Array.isArray(obj)) {
      return random.pick(random.item(obj))
    }

    return obj
  }

  /**
   * Returns a boolean result based on limit
   *
   * @param {number} limit - Maximum value
   * @returns {boolean}
   */
  static chance (limit = 2) {
    if (isNaN(limit)) {
      logger.traceback()
      throw new TypeError(`random.chance() received non-number type: (${limit})`)
    }

    return random.number(limit) === 1
  }

  /**
   * Return an item from an array of arrays where the first index in each sub-array denotes the weight
   *
   * @param {Array} list - Array of arrays
   * @param {boolean} flat - Indicates whether we should iterate over the arrays recursively
   * @returns {*}
   */
  static choose (list: any[], flat = false) {
    if (!(Array.isArray(list))) {
      logger.traceback()
      throw new TypeError(`random.choose() received non-array type: (${list})`)
    }

    const expanded: any[] = []
    list.forEach(([weight, value]) => {
      for (let w = 0; w < weight; w++) {
        expanded.push(value)
      }
    })

    if (flat) {
      return random.item(expanded)
    }

    return random.pick(expanded)
  }

  /**
   * Return a flattened list of weighted values
   * [{w: 1, v: 'foo'}, {w: 1, v: 'bar'}]
   *
   * @param {Array} list - List of weighted values
   * @returns {Array}
   */
  static weighted (list: any[]) {
    const expanded: any[] = []
    list.forEach((item) => {
      for (let i = 0; i < item.w; i++) {
        expanded.push(item.v)
      }
    })

    return expanded
  }

  static use (obj: any): any | string {
    return random.bool() ? obj : ''
  }

  /**
   * Returns arr shuffled
   *
   * @param {Array} arr - Array to shuffle
   */
  static shuffle (arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const p = random.number(i + 1)
      const t = arr[i]
      arr[i] = arr[p]
      arr[p] = t
    }
  }

  /**
   * Returns a shuffled copy of arr
   *
   * @param {Array} arr - Source Array to shuffle
   * @returns {*}
   */
  static shuffled <T> (arr: T[]): T[] {
    const newArray = arr.slice()
    random.shuffle(newArray)
    return newArray
  }

  /**
   * Select an array containing a subset of 'list'
   *
   * @param {Array} list - List to be parsed
   * @param {?number} limit - Number of elements to be returned
   * @returns {Array}
   */
  static subset <T> (list: T[], limit?: number): any[] {
    if (!(Array.isArray(list))) {
      logger.traceback()
      throw new TypeError(`random.subset() received non-array type: (${list})`)
    }

    if (typeof limit !== 'number' || limit > list.length) {
      limit = random.range(0, list.length)
    }

    // Shallowclone list
    const temp = list.slice(0)
    const result: any[] = []
    for (let i = 0; i < limit; i++) {
      result.push(random.pop(temp))
    }

    return result
  }

  /**
   * Removes and returns a random item from an array.
   *
   * @param {Array} arr - Source array to pop from
   */
  static pop <T> (arr: T[]): T {
    const i = random.number(arr.length)
    const obj = arr[i]
    arr.splice(i, 1)

    return obj
  }

  static hex (len: number) {
    const val = random.number(Math.pow(2, len * 4)).toString(16)
    return '0'.repeat(len - val.length) + val
  }
}
