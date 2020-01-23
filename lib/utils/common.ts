/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { XmlEntities } from 'html-entities'
import jsesc from 'jsesc'

export class common {
  /**
   * Escape and quote a string
   *
   * @param {*} str - Object to be quoted
   * @param {boolean} html - Identifies whether the string must be HTML safe
   * @returns {string}
   */
  static quote (str: any, html = false) {
    const options = {
      minimal: true,
      isScriptContext: html,
      wrap: true
    }

    return jsesc(str, options)
  }

  /**
   * Remove quotes and escape sequence from string
   *
   * @param {string} str - Object to be unquoted
   * @returns {string}
   */
  static unquote (str: string) {
    return str.replace(/\\'/g, '\'')
      .replace(/\\"/g, '"')
      .replace(/\\0/g, '\0')
      .replace(/\\\\/g, '\\')
      .replace(/(^['|"])(.*)\1$/gm, '$2')
  }

  /**
   * Unicode safe b64 encoding
   *
   * @param {string} str - String to encode
   * @returns {string}
   */
  static b64encode (str: string) {
    return Buffer.from(str).toString('base64')
  }

  /**
   * Unicode safe b64 decoding
   *
   * @param {string} str - String to decode
   * @returns {string}
   */
  static b64decode (str: string) {
    return Buffer.from(str, 'base64').toString('utf8')
  }

  /**
   * Escape special characters using HTML entities
   *
   * @param {string} str - String to escape
   * @returns {string}
   */
  static htmlEscape (str: string) {
    // @ts-ignore - Typescript can't find this definition for some unknown reason
    return XmlEntities.encode(str)
  }

  /**
   * Remove HTML entities from string
   *
   * @param {string} str - String to unescape
   * @returns {string}
   */
  static htmlUnescape (str: string) {
    // @ts-ignore - Typescript can't find this definition for some unknown reason
    return XmlEntities.decode(str)
  }

  /**
   * Merge two objects recursively
   *
   * @param {object} obj1 - Object to merge into
   * @param {object} obj2 - Object to merge from
   * @returns {*}
   */
  static mergeHash (obj1: Record<string, any>, obj2: Record<string, any>) {
    for (const p in obj2) {
      try {
        if (obj2[p].constructor.name === 'Object') {
          obj1[p] = common.mergeHash(obj1[p], obj2[p])
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
   *
   * @param {string} obj - Array of commands to beautify
   * @returns {string}
   */
  static mockup (obj: string) {
    return obj.split('\n').map((ln) => ln.trim()).join('')
  }
}
