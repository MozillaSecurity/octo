/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const { Base64 } = require('js-base64')
const entities = new (require('html-entities').XmlEntities)()
const jsesc = require('jsesc')
const utils = require('../utils')

class common extends utils {
  /**
   * Escape and quote a string
   * @param {*} s - Object to be quoted
   * @param {boolean} html - Identifies whether the string must be HTML safe
   * @returns {string}
   */
  static quote (s, html = false) {
    const options = {
      minimal: true,
      isScriptContext: html
    }

    if (typeof s === 'string') {
      return `'${jsesc(s, options)}'`
    } else if ((!!s) && (s.constructor === Object)) {
      return `{ ${Object.entries(s).map(([k, v]) => `${common.quote(k)}: ${common.quote(v)}`).join(', ')} }`
    } else {
      return jsesc(s, options)
    }
  }

  /**
   * Remove quotes and escape sequence from string
   * @param {string} s
   * @returns {string}
   */
  static unquote (s) {
    return s.replace(/\\'/g, '\'')
      .replace(/\\"/g, '"')
      .replace(/\\0/g, '\0')
      .replace(/\\\\/g, '\\')
      .replace(/(^['|"])(.*)\1$/gm, '$2')
  }

  /**
   * Unicode safe b64 encoding
   * @param {string} str
   * @returns {*}
   */
  static b64encode (str) {
    return Base64.encode(str)
  }

  /**
   * Unicode safe b64 decoding
   * @param {string} str
   * @returns {*}
   */
  static b64decode (str) {
    return Base64.decode(str)
  }

  /**
   * Escape special characters using HTML entities
   * @param {string} str
   * @returns {string}
   */
  static htmlEscape (str) {
    return entities.encode(str)
  }

  /**
   * Remove HTML entities from string
   * @param {string} str
   * @returns {string}
   */
  static htmlUnescape (str) {
    return entities.decode(str)
  }

  /**
   * Merge two objects recursively
   * @param {Object} obj1
   * @param {Object} obj2
   * @returns {*}
   */
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

  /**
   * Template string beautifier
   * @param {Object} obj
   * @returns {string}
   */
  static mockup (obj) {
    return obj.split('\n').map((ln) => ln.trim()).join('')
  }
}

module.exports = common
