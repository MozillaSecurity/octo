/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.command = {
  _data: {
    'backcolor': function () { return make.colors.any() },
    'bold': null,
    'contentReadOnly': function () { random.bool() },
    'copy': null,
    'createlink': function () { make.uri.any() },
    'cut': null,
    'decreasefontsize': null,
    'delete': null,
    'enableInlineTableEditing': function () { random.bool() },
    'enableObjectResizing': function () { random.bool() },
    'fontname': function () { make.font.family() },
    'fontsize': function () { make.font.relativeSize() },
    'formatblock': ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'pre', 'address', 'blockquote', 'dl', 'div'],
    'forwarddelete': null,
    'forecolor': function () { make.colors.any() },
    'gethtml': null,
    'heading': null,
    'hilitecolor': function () { make.colors.any() },
    'increasefontsize': null,
    'indent': null,
    'insertBrOnReturn': function () { random.bool() },
    'inserthorizontalrule': null,
    // 'inserthtml': function () { },
    'insertlinebreak': null,
    'insertimage': function () { make.uri.any() },
    'insertorderedlist': null,
    'insertparagraph': null,
    'inserttext': function () { make.text.any() },
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
    'styleWithCSS': function () { random.bool() },
    'subscript': null,
    'superscript': null,
    'underline': null,
    'undo': null,
    'unlink': null
  },
  name: function () {
    return random.item(Object.keys(this._data))
  },
  value: function (name) {
    return random.pick(this._data[name])
  }
}
