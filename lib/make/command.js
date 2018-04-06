/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class command extends make {
  static data () {
    return {
      'backcolor': () => make.colors.any(),
      'bold': null,
      'contentReadOnly': () => random.bool(),
      'copy': null,
      'createlink': () => make.uri.any(),
      'cut': null,
      'decreasefontsize': null,
      'delete': null,
      'enableInlineTableEditing': () => random.bool(),
      'enableObjectResizing': () => random.bool(),
      'fontname': () => make.font.family(),
      'fontsize': () => make.font.relativeSize(),
      'formatblock': ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'pre', 'address', 'blockquote', 'dl', 'div'],
      'forwarddelete': null,
      'forecolor': () => make.colors.any(),
      'gethtml': null,
      'heading': null,
      'hilitecolor': () => make.colors.any(),
      'increasefontsize': null,
      'indent': null,
      'insertBrOnReturn': () => random.bool(),
      'inserthorizontalrule': null,
      // 'inserthtml': function () { },
      'insertlinebreak': null,
      'insertimage': () => make.uri.any(),
      'insertorderedlist': null,
      'insertparagraph': null,
      'inserttext': () => make.text.any(),
      'insertunorderedlist': null,
      'italic': null,
      'justifycenter': null,
      'justifyfull': null,
      'justifyleft': null,
      'justifyright': null,
      'outdent': null,
      'paste': null,
      'redo': null,
      'removeformat': null,
      'selectall': null,
      'strikethrough': null,
      'styleWithCSS': () => random.bool(),
      'subscript': null,
      'superscript': null,
      'underline': null,
      'undo': null,
      'unlink': null
    }
  }

  static name () {
    return random.item(Object.keys(command.data()))
  }

  static value (value) {
    return random.pick(command.data()[name])
  }
}

module.exports = command
