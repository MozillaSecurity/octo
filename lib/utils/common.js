/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.common = {
  objToString: function (obj) {
    try {
      return '' + obj
    } catch (e) {
      return '[' + e + ']'
    }
  },
  getAllProperties: function (obj) {
    let list = []
    while (obj) {
      list = list.concat(Object.getOwnPropertyNames(obj))
      obj = Object.getPrototypeOf(obj)
    }
    return list
  },
  getKeysFromHash: function (obj) {
    let list = []
    for (let p in obj) {
      list.push(p)
    }
    return list
  },
  quote: function (s) {
    // Taken from DOMfuzz
    function escapeString (s) {
      return ('\"' + // eslint-disable-line no-useless-escape
      s.replace(/\\/g, '\\\\')
      .replace(/\"/g, '\\\"') // eslint-disable-line no-useless-escape
      .replace(/\0/g, '\\0')
      .replace(/\n/g, '\\n') +
      '\"') // eslint-disable-line no-useless-escape
    }

    if (typeof s === 'string') {
      if (/^[\n\x20-\x7f]*$/.exec(s) || !self.uneval) { // eslint-disable-line no-undef
        // Printable ASCII characters and line breaks: try to make it pretty.
        return escapeString(s)
      } else {
        // Non-ASCII: use uneval to get \u escapes.
        return uneval(s) // eslint-disable-line no-undef
      }
    } else {
      // For other things (such as numbers, |null|, and |undefined|), just coerce to string.
      return JSON.stringify(s)
    }
  },
  b64encode: function (str) {
    // Unicode safe b64 encoding
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes (match, p1) {
        // noinspection JSCheckFunctionSignatures
        return String.fromCharCode('0x' + p1)
      }))
  },
  b64decode: function (str) {
    // Unicode safe b64 decoding
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  },
  uniqueList: function (list) {
    let tmp = {}
    let r = []
    for (let i = 0; i < list.length; i++) {
      tmp[list[i]] = list[i]
    }
    for (let i in tmp) {
      r.push(tmp[i])
    }
    return r
  },
  mergeHash: function (obj1, obj2) {
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
}
