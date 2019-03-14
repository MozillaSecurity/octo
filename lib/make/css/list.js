/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const css = require('./index')
const random = require('../random')

class list extends css {
  /**
   * Generate random list-style-types
   * https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#Browser_compatibility
   *
   * @returns {string}
   */
  static styles () {
    return random.item([
      'arabic-indic', 'armenian', 'bengali', 'cjk-decimal', 'cjk-earthly-branch', 'cjk-heavenly-stem',
      'cjk-ideographic', 'decimal-leading-zero', 'devanagari', 'disclosure-closed', 'disclosure-open',
      'ethiopic-numeric', 'georgian', 'gujarati', 'gurmukhi', 'hebrew', 'hiragana', 'hiragana-iroha',
      'japanese-formal', 'japanese-informal', 'kannada', 'katakana', 'katakana-iroha', 'khmer', 'korean-hangul-formal',
      'korean-hanja-formal', 'korean-hanja-informal', 'lao', 'lower-greek', 'lower-latin', 'malayalam', 'mongolian',
      'myanmar', 'oriya', 'persian', 'simp-chinese-formal', 'simp-chinese-informal', 'tamil', 'telugu', 'thai',
      'trad-chinese-formal', 'trad-chinese-informal', 'upper-latin', 'string', 'symbols'
    ])
  }
}

module.exports = list
