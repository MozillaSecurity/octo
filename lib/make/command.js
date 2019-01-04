/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

/**
 * Class for generator
 */
class command extends make {
  /**
   * Returns an object containing all know command names and their respective values
   *
   * @returns {{backColor: colors.any, bold: null, ClearAuthenticationCache: null, contentReadOnly: random.bool, copy: null, createLink: uri.any, cut: null, decreaseFontSize: null, defaultParagraphSeparator: html.tag, delete: null, enableAbsolutePositionEditor: random.bool, enableInlineTableEditing: random.bool, enableObjectResizing: random.bool, fontName: font.family, fontSize: font.relativeSize, foreColor: colors.any, formatBlock: string[], forwardDelete: null, heading: string[], hiliteColor: colors.any, increaseFontSize: null, indent: null, insertBrOnReturn: random.bool, insertHorizontalRule: null, insertImage: uri.any, insertLineBreak: null, insertOrderedList: null, insertParagraph: null, insertText: text.any, insertUnorderedList: null, italic: null, justifyCenter: null, justifyFull: null, justifyLeft: null, justifyRight: null, outdent: null, paste: null, redo: null, removeFormat: null, selectAll: null, strikeThrough: null, styleWithCSS: random.bool, subscript: null, superscript: null, underline: null, undo: null, unlink: null, useCSS: random.bool}}
   */
  static get data () {
    return {
      'backColor': make.colors.any,
      'bold': null,
      'ClearAuthenticationCache': null,
      'contentReadOnly': random.bool,
      'copy': null,
      'createLink': make.uri.any,
      'cut': null,
      'decreaseFontSize': null,
      'defaultParagraphSeparator': make.html.tag,
      'delete': null,
      'enableAbsolutePositionEditor': random.bool,
      'enableInlineTableEditing': random.bool,
      'enableObjectResizing': random.bool,
      'fontName': make.font.family,
      'fontSize': make.font.relativeSize,
      'foreColor': make.colors.any,
      'formatBlock': ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'pre', 'address', 'blockquote', 'dl', 'div'],
      'forwardDelete': null,
      'heading': ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      'hiliteColor': make.colors.any,
      'increaseFontSize': null,
      'indent': null,
      'insertBrOnReturn': random.bool,
      'insertHorizontalRule': null,
      // 'insertHTML': function () { },
      'insertImage': make.uri.any,
      'insertLineBreak': null,
      'insertOrderedList': null,
      'insertParagraph': null,
      'insertText': make.text.any,
      'insertUnorderedList': null,
      'italic': null,
      'justifyCenter': null,
      'justifyFull': null,
      'justifyLeft': null,
      'justifyRight': null,
      'outdent': null,
      'paste': null,
      'redo': null,
      'removeFormat': null,
      'selectAll': null,
      'strikeThrough': null,
      'styleWithCSS': random.bool,
      'subscript': null,
      'superscript': null,
      'underline': null,
      'undo': null,
      'unlink': null,
      'useCSS': random.bool
    }
  }

  /**
   * Return a random command name
   *
   * @returns {string}
   */
  static name () {
    return random.item(Object.keys(command.data))
  }

  /**
   * Return a random command value
   *
   * @param name
   * @returns {string}
   */
  static value (name) {
    return random.pick(command.data[name])
  }
}

module.exports = command
