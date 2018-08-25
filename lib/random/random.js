/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const MersenneTwister = require('./mersennetwister')
const logger = require('../logging')

class random {
  /**
   * Must be called before any other methods can be called to initialize MersenneTwister
   * @param {number|null|undefined} seed - Value to initialize MersenneTwister
   */
  static init (seed) {
    if (seed === null || seed === undefined) {
      random.seed = new Date().getTime()
    }

    random.twister = new MersenneTwister()
    random.twister.seed(random.seed)
  }

  /**
   * Returns an integer in [0, limit) (uniform distribution)
   * @param {number} limit
   */
  static number (limit) {
    if (!random.twister) {
      throw new Error('random.init must be called first.')
    }

    if (limit === null || limit === undefined) {
      limit = 0xffffffff
    }

    let x = (0x100000000 / limit) >>> 0
    let y = (x * limit) >>> 0
    let r
    do {
      r = random.twister.int32()
    } while (y && r >= y) // eslint-disable-line no-unmodified-loop-condition
    return (r / x) >>> 0
  }

  /**
   * Returns a float in [0, 1) (uniform distribution)
   */
  static float () {
    if (!random.twister) {
      throw new Error('random.init must be called first.')
    }

    return random.twister.real2()
  }

  /**
   * Returns an integer in [start, limit) (uniform distribution)
   * @param {number} start
   * @param {number} limit
   */
  static range (start, limit) {
    if (!random.twister) {
      throw new Error('random.init must be called first.')
    }

    if (isNaN(start) || isNaN(limit)) {
      logger.traceback()
      throw new TypeError(`random.range() received non-number type: (${start}, ${limit})`)
    }

    return random.number(limit - start + 1) + start
  }

  /**
   * Returns a float in [1, limit). The logarithm has uniform distribution.
   * @param {number} limit
   */
  static ludOneTo (limit) {
    return Math.exp(random.float() * Math.log(limit))
  }

  /**
   * Returns a random index from a list
   * @param {Array} list
   * @returns {*}
   */
  static item (list) {
    if (!Array.isArray(list)) {
      logger.traceback()
      throw new TypeError(`random.item() received invalid object: (${list})`)
    }

    return list[random.number(list.length)]
  }

  /**
   * Returns a random key of a provided object
   * @param {Object} obj
   */
  static key (obj) {
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
   * @param {*} obj
   * @returns {*}
   */
  static pick (obj) {
    if (typeof obj === 'function') {
      return obj()
    } else if (Array.isArray(obj)) {
      return random.pick(random.item(obj))
    }

    return obj
  }

  /**
   * Returns a boolean result based on limit
   * @param limit
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
   * @param {Array} list - Array of arrays
   * @param {Boolean} flat - Indicates whether we should iterate over the arrays recursively
   * @returns {*}
   */
  static choose (list, flat = false) {
    if (!(Array.isArray(list))) {
      logger.traceback()
      throw new TypeError(`random.choose() received non-array type: (${list})`)
    }

    let total = 0
    for (let i = 0; i < list.length; i++) {
      total += list[i][0]
    }

    let n = random.number(total)
    for (let i = 0; i < list.length; i++) {
      if (n < list[i][0]) {
        if (flat === true) {
          return list[i][1]
        } else {
          return random.pick([list[i][1]])
        }
      }
      n = n - list[i][0]
    }

    if (flat) {
      return list[0][1]
    }

    return random.pick([list[0][1]])
  }

  /**
   * More memory-hungry but hopefully faster than random.choose$flat.
   * @param {*} wa
   */
  static weighted (wa) {
    let a = []
    for (let i = 0; i < wa.length; ++i) {
      for (let j = 0; j < wa[i].w; ++j) {
        a.push(wa[i].v)
      }
    }

    return a
  }

  static use (obj) {
    return random.bool() ? obj : ''
  }

  /**
   * Returns arr shuffled
   * @param arr
   */
  static shuffle (arr) {
    let i = arr.length
    while (i--) {
      let p = random.number(i + 1)
      let t = arr[i]
      arr[i] = arr[p]
      arr[p] = t
    }
  }

  /**
   * Returns a shuffled copy of arr
   * @param arr
   * @returns {*}
   */
  static shuffled (arr) {
    let newArray = arr.slice()
    random.shuffle(newArray)
    return newArray
  }

  /**
   * Select an array containing a subset of 'list'
   * @param list
   * @param limit
   * @returns {Array}
   */
  static subset (list, limit) {
    if (!(Array.isArray(list))) {
      logger.traceback()
      throw new TypeError(`random.subset() received non-array type: (${list})`)
    }

    if (typeof limit !== 'number') {
      limit = random.number(list.length + 1)
    }

    // Deepclone list
    const temp = JSON.parse(JSON.stringify(list))
    const result = []
    while (limit--) {
      result.push(random.pop(temp))
    }

    return result
  }

  /**
   * Removes and returns a random item from an array.
   * @param {*} arr
   */
  static pop (arr) {
    let i, obj

    i = random.number(arr.length)
    obj = arr[i]
    arr.splice(i, 1)

    return obj
  }

  static hex (len) {
    return random.number(Math.pow(2, len * 4)).toString(16)
  }
}

module.exports = random
