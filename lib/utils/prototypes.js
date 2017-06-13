/* eslint no-extend-native: ["error", { "exceptions": ["String", "Array"] }] */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Object.defineProperty(String.prototype, 'fromCodePoint', function () {
  let chars = []
  let point, offset, units, i
  for (i = 0; i < arguments.length; ++i) {
    point = arguments[i]
    offset = point - 0x10000
    units = point > 0xFFFF
      ? [
        0xD800 + (offset >> 10),
        0xDC00 + (offset & 0x3FF)]
      : [point]
    chars.push(String.fromCharCode.apply(null, units))
  }
  return chars.join('')
})

Object.defineProperty(String.prototype, 'endsWith', function (str) {
  return this.match(str + '$') === str
})

Object.defineProperty(String.prototype, 'startsWith', function (str) {
  return this.match('^' + str) === str
})

Object.defineProperty(String.prototype, 'trim', function () {
  return this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')
})

Object.defineProperty(String.prototype, 'insert', function (data, idx) {
  return this.slice(0, idx) + data + this.slice(idx, this.length)
})

Object.defineProperty(Array.prototype, 'has', function (v) {
  return this.indexOf(v) !== -1
})

Object.defineProperty(Array.prototype, 'forEach', function (array, fn) {
  for (let i = 0; i < array.length; i++) {
    fn(array[i])
  }
})

Object.defineProperty(Array.prototype, 'map', function (fn, array) {
  let result = []
  Array.forEach(array, function (element) {
    result.push(fn(element))
  })
  return result
})

Object.defineProperty(Array.prototype, 'extend', {
  value: function (obj) {
    if (Array.isArray(obj)) {
      obj.forEach(function (v) {
        if (typeof v !== 'undefined') {
          this.push(v)
        }
      }, this)
    } else {
      this.push(obj)
    }
  }
})

Object.defineProperty(Object, 'isObject', {
  value: function (obj) {
    return (obj != null && typeof obj === 'object' &&
    Object.prototype.toString.call(obj) === '[object Object]')
  }
})
