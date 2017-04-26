/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var random = { // eslint-disable-line no-unused-vars
  twister: null,

  /**
   * Must be called before any other methods can be called to initialize MersenneTwister.
   * @param {number|null|undefined} seed Value to initialize MersenneTwister.
   */
  init: function (seed) {
    if (seed === null || seed === undefined) {
      seed = new Date().getTime()
    }
    this.twister = new MersenneTwister()
    this.twister.seed(seed)
  },
  number: function (limit) {
    // Returns an integer in [0, limit). Uniform distribution.
    if (limit === 0) {
      return limit
    }
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
  },
  float: function () {
    // Returns a float in [0, 1). Uniform distribution.
    return this.twister.real2()
  },
  range: function (start, limit) {
    // Returns an integer in [start, limit]. Uniform distribution.
    if (isNaN(start) || isNaN(limit)) {
      logger.traceback()
      throw new TypeError('random.range() received a non number type: \'' + start + '\', \'' + limit + '\')')
    }
    return this.number(limit - start + 1) + start
  },
  ludOneTo: function (limit) {
    // Returns a float in [1, limit]. The logarithm has uniform distribution.
    return Math.exp(this.float() * Math.log(limit))
  },
  item: function (list) {
    if (!(list instanceof Array || (list !== undefined && typeof list !== 'string' && list.hasOwnProperty('length')))) {
      logger.traceback()
      throw new TypeError('this.item() received a non array type: \'' + list + '\'')
    }
    return list[this.number(list.length)]
  },
  key: function (obj) {
    let list = []
    for (let i in obj) {
      list.push(i)
    }
    return this.item(list)
  },
  bool: function () {
    return this.item([true, false])
  },
  pick: function (obj) {
    if (typeof obj === 'function') {
      return obj()
    }
    if (obj instanceof Array) {
      return this.pick(this.item(obj))
    }
    return obj
  },
  chance: function (limit) {
    if (limit === null || limit === undefined) {
      limit = 2
    }
    if (isNaN(limit)) {
      logger.traceback()
      throw new TypeError('random.chance() received a non number type: \'' + limit + '\'')
    }
    return this.number(limit) === 1
  },
  choose: function (list, flat) {
    if (!(list instanceof Array)) {
      logger.traceback()
      throw new TypeError('random.choose() received a non-array type: \'' + list + '\'')
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
  },
  weighted: function (wa) {
    // More memory-hungry but hopefully faster than random.choose$flat
    let a = []
    for (let i = 0; i < wa.length; ++i) {
      for (let j = 0; j < wa[i].w; ++j) {
        a.push(wa[i].v)
      }
    }
    return a
  },
  use: function (obj) {
    return this.bool() ? obj : ''
  },
  shuffle: function (arr) {
    let i = arr.length
    while (i--) {
      let p = this.number(i + 1)
      let t = arr[i]
      arr[i] = arr[p]
      arr[p] = t
    }
  },
  shuffled: function (arr) {
    let newArray = arr.slice()
    this.shuffle(newArray)
    return newArray
  },
  subset: function (list, limit) {
    if (!(list instanceof Array)) {
      logger.traceback()
      throw new TypeError('random.some() received a non-array type: \'' + list + '\'')
    }
    if (typeof limit !== 'number') {
      limit = this.number(list.length + 1)
    }
    let result = []
    for (let i = 0; i < limit; i++) {
      result.push(this.pick(list))
    }
    return result
  },
  pop: function (arr) {
    // Removes and returns a random item from an array
    let i, obj

    i = this.number(arr.length)
    obj = arr[i]
    arr.splice(i, 1)

    return obj
  },
  hex: function (len) {
    return Math.floor(Math.random() * ('0x1' + Array(len + 1).join('0'))).toString(16)
  }
}
