/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const jsesc = require('jsesc')
const utils = require('../utils')

class common extends utils {
  static objToString (obj) {
    try {
      return `${obj}`
    } catch (e) {
      return `[${e}]`
    }
  }

  static getAllProperties (obj) {
    let list = []
    while (obj) {
      list = list.concat(Object.getOwnPropertyNames(obj))
      obj = Object.getPrototypeOf(obj)
    }
    return list
  }

  static getKeysFromHash (obj) {
    let list = []
    for (let p in obj) {
      list.push(p)
    }
    return list
  }

  /**
   * Escape and quote a string
   * @param s {string} - String to be quoted
   * @param html {boolean} - Identifies whether the string must be HTML safe
   * @returns {*}
   */
  static quote (s, html = false) {
    const options = {
      minimal: true,
      isScriptContext: html
    }

    if (typeof s === 'string') {
      return `'${jsesc(s, options)}'`
    } else {
      return jsesc(s, options)
    }
  }

  static b64encode (str) {
    // Unicode safe b64 encoding
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    if (process.browser) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes (match, p1) {
          // noinspection JSCheckFunctionSignatures
          return String.fromCharCode('0x' + p1)
        })
      )
    } else {
      return Buffer.from(str).toString('base64')
    }
  }

  static b64decode (str) {
    // Unicode safe b64 decoding
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    if (process.browser) {
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
      }).join(''))
    } else {
      return Buffer.from(str, 'base64').toString('ascii')
    }
  }

  static uniqueList (list) {
    let tmp = {}
    let r = []
    for (let i = 0; i < list.length; i++) {
      tmp[list[i]] = list[i]
    }
    for (let i in tmp) {
      r.push(tmp[i])
    }
    return r
  }

  static mergeHash (obj1, obj2) {
    for (let p in obj2) {
      try {
        if (obj2[p].constructor === Object) {
          obj1[p] = utils.common.mergeHash(obj1[p], obj2[p])
        } else {
          obj1[p] = obj2[p]
        }
      } catch (e) {
        obj1[p] = obj2[p]
      }
    }
    return obj1
  }

  static mockup (obj) {
    return obj.split('\n').map((ln) => ln.trim()).join('')
  }
}

module.exports = common
