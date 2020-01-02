/* eslint no-extend-native: ["error", { "exceptions": ["String", "Array"] }] */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

class prototypes {
  static enable () {
    if (!Array.prototype.hasOwnProperty('extend')) {
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
    }

    if (!Array.prototype.hasOwnProperty('has')) {
      Object.defineProperty(Array.prototype, 'has', {
        value: function (v) {
          return this.indexOf(v) !== -1
        }
      })
    }

    if (!Object.hasOwnProperty('isObject')) {
      Object.defineProperty(Object, 'isObject', {
        value: function (obj) {
          return (obj !== null && typeof obj === 'object' &&
            Object.prototype.toString.call(obj) === '[object Object]')
        }
      })
    }

    if (!String.prototype.hasOwnProperty('insert')) {
      Object.defineProperty(String.prototype, 'insert', {
        value: function (data, i) {
          return this.slice(0, i) + data + this.slice(i, this.length)
        }
      })
    }
  }
}

module.exports = prototypes
