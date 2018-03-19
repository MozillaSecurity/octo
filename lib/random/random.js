/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const MersenneTwister = require('./mersennetwister')
const {logger} = require('../logging')

class random {
  /**
   * Must be called before any other methods can be called to initialize MersenneTwister.
   * @param {number|null|undefined} seed Value to initialize MersenneTwister.
   */
  static init (seed) {
    if (seed === null || seed === undefined) {
      this.seed = new Date().getTime()
    }
    this.twister = new MersenneTwister()
    this.twister.seed(this.seed)
  }

  /**
   * Returns an integer in [0, limit). Uniform distribution.
   * @param limit
   */
  static number (limit) {
    if (limit === null || limit === undefined) {
      limit = 0xffffffff
    }
    let x = (0x100000000 / limit) >>> 0
    let y = (x * limit) >>> 0
    let r
    do {
      r = this.twister.int32()
    } while (y && r >= y) // eslint-disable-line no-unmodified-loop-condition
    return (r / x) >>> 0
  }

  /**
   * Returns a float in [0, 1). Uniform distribution.
   */
  static float () {
    return this.twister.real2()
  }

  /**
   * Returns an integer in [start, limit]. Uniform distribution.
   * @param start
   * @param limit
   */
  static range (start, limit) {
    if (isNaN(start) || isNaN(limit)) {
      logger.traceback()
      throw new TypeError(`random.range() received non-number type: (${start}, ${limit})`)
    }
    return this.number(limit - start + 1) + start
  }

  /**
   * Returns a float in [1, limit]. The logarithm has uniform distribution.
   * @param {*} limit
   */
  static ludOneTo (limit) {
    return Math.exp(this.float() * Math.log(limit))
  }

  static item (list) {
    if (list === undefined || typeof list === 'string' || list.length === undefined) {
      logger.traceback()
      throw new TypeError(`random.item() received invalid object: (${list})`)
    }
    return list[this.number(list.length)]
  }

  /**
   * Returns a random key of a provided object.
   * @param {*} obj
   */
  static key (obj) {
    let list = []
    for (let i in obj) {
      list.push(i)
    }
    return this.item(list)
  }

  /**
   * Return a random Boolean value.
   */
  static bool () {
    return this.item([true, false])
  }

  static pick (obj) {
    if (typeof obj === 'function') {
      return obj()
    }
    if (Array.isArray(obj)) {
      return this.pick(this.item(obj))
    }
    return obj
  }

  static chance (limit) {
    if (limit === null || limit === undefined) {
      limit = 2
    }
    if (isNaN(limit)) {
      logger.traceback()
      throw new TypeError(`random.chance() received non-number type: (${limit})`)
    }
    return this.number(limit) === 1
  }

  static choose (list, flat) {
    if (!(Array.isArray(list))) {
      logger.traceback()
      throw new TypeError(`random.choose() received non-array type: (${list})`)
    }
    let total = 0
    for (let i = 0; i < list.length; i++) {
      total += list[i][0]
    }
    let n = this.number(total)
    for (let i = 0; i < list.length; i++) {
      if (n < list[i][0]) {
        if (flat === true) {
          return list[i][1]
        } else {
          return this.pick([list[i][1]])
        }
      }
      n = n - list[i][0]
    }
    if (flat === true) {
      return list[0][1]
    }
    return this.pick([list[0][1]])
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
    return this.bool() ? obj : ''
  }

  static shuffle (arr) {
    let i = arr.length
    while (i--) {
      let p = this.number(i + 1)
      let t = arr[i]
      arr[i] = arr[p]
      arr[p] = t
    }
  }

  static shuffled (arr) {
    let newArray = arr.slice()
    this.shuffle(newArray)
    return newArray
  }

  static subset (list, limit) {
    if (!(Array.isArray(list))) {
      logger.traceback()
      throw new TypeError(`random.subset() received non-array type: (${list})`)
    }
    if (typeof limit !== 'number') {
      limit = this.number(list.length + 1)
    }
    let result = []
    for (let i = 0; i < limit; i++) {
      result.push(this.pick(list))
    }
    return result
  }

  /**
   * Removes and returns a random item from an array.
   * @param {*} arr
   */
  static pop (arr) {
    let i, obj

    i = this.number(arr.length)
    obj = arr[i]
    arr.splice(i, 1)

    return obj
  }

  static hex (len) {
    return this.number(Math.pow(2, len * 4)).toString(16)
  }
}

module.exports = random
