/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.text = {
  lineEnd: function () {
    return random.pick([
      '\n', '\r', '\r\n', '\n\r'
    ])
  },
  controlChar: function () {
    return random.pick([
      '\b', '\t', '\n', '\v', '\f', '\r', '\0', '\c', '\a', '\e' // eslint-disable-line no-useless-escape
    ])
  },
  token: function () {
    return random.pick([
      '*', '+', '%', '-', '!', '^', ':', '|', '&', '<', '>', '.', '"',
      '#', ' ', ';', ',', '{', '}', '(', ')', '[', ']', '/', '\\', '/*', '*/'
    ])
  },
  charset: function () {
    return random.pick([
      'UTF-8', 'ISO-8859-1'
    ])
  },
  language: function () {
    // https://gist.github.com/tonyhb/635401
    return random.pick([
      'en-US', 'en', 'de'
    ])
  },
  layoutCharCodes: function () {
    return random.pick([
      0,      // null
      160,    // non-breaking space
      0x005C, // backslash, but in some countries, represents local currency symbol (e.g. yen)
      0x00AD, // soft hyphen
      0x0BCC, // a Tamil character that is displayed as three glyphs
      // http://unicode.org/charts/PDF/U2000.pdf
      0x200B, // zero-width space
      0x200C, // zero-width non-joiner
      0x200D, // zero-width joiner
      0x200E, // left-to-right mark
      0x200F, // right-to-left mark
      0x2011, // non-breaking hyphen
      0x2027, // hyphenation point
      0x2028, // line separator
      0x2029, // paragraph separator
      0x202A, // left-to-right embedding
      0x202B, // right-to-left embedding
      0x202C, // pop directional formatting
      0x202D, // left-to-right override
      0x202E, // right-to-left override
      0x202F, // narrow no-break space
      0x2060, // word joiner
      0x2061, // function application (one of several invisible mathematical operators)
      // http://unicode.org/charts/PDF/U3000.pdf
      0x3000, // ideographic space (CJK)
      // http://unicode.org/charts/PDF/U0300.pdf
      0x0301, // combining acute accent (if it appears after "a", it turns into "a" with an accent)
      // Arabic has the interesting property that most letters connect to the next letter.
      // Some code calls this "shaping".
      0x0643, // arabic letter kaf
      0x0645, // arabic letter meem
      0x06CD, // arabic letter yeh with tail
      0xFDDE, // invalid unicode? but somehow associated with arabic.
      // http://unicode.org/reports/tr36/tr36-7.html#Buffer_Overflows
      // Characters with especially high expansion factors when they go through various unicode "normalizations"
      0x1F82,
      0xFDFA,
      0xFB2C,
      0x0390,
      // 0x1D160, // hmm, need surrogates
      // Characters with especially high expansion factors when lowercased or uppercased
      0x023A,
      0x0041,
      0xDC1D, // a low surrogate
      0xDB00, // a high surrogate
      // UFFF0.pdf
      0xFFF9, // interlinear annotation anchor
      0xFFFA, // interlinear annotation seperator
      0xFFFB, // interlinear annotation terminator
      0xFFFC, // object replacement character
      0xFFFD, // replacement character
      0xFEFF, // zero width no-break space
      0xFFFF, // not a character
      0x00A0, // no-break space
      0x2426,
      0x003F,
      0x00BF,
      0xDC80,
      0xDCFF,
      // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters
      0x205F, // mathematical space
      0x2061, // mathematical function application
      0x2064, // mathematical invisible separator
      0x2044  // fraction slash character
    ])
  },
  bidiCharCodes: function() {
    return random.pick([
      0x0660, // START_HINDI_DIGITS
      0x0669, // END_HINDI_DIGITS
      0x066A, // START_ARABIC_SEPARATOR
      0x066B, // END_ARABIC_SEPARATOR
      0x0030, // START_ARABIC_DIGITS
      0x0039, // END_ARABIC_DIGITS
      0x06f0, // START_FARSI_DIGITS
      0x06f9, // END_FARSI_DIGITS
    ])
  },
  // http://www.unicode.org/Public/6.0.0/ucd/UnicodeData.txt
  unicodeCombiningCharacters: function () {
    return random.item([
      [0x0300, 0x036F], // Combining Diacritical Marks
      [0x0483, 0x0489],
      [0x07EB, 0x07F3],
      [0x135D, 0x135F],
      [0x1A7F, 0x1A7F],
      [0x1B6B, 0x1B73],
      [0x1DC0, 0x1DFF], // Combining Diacritical Marks Supplement
      [0x20D0, 0x2DFF],
      [0x3099, 0x309A],
      [0xA66F, 0xA6F1],
      [0xA8E0, 0xA8F1],
      [0xFE20, 0xFE26], // Combining Half Marks
      [0x101FD, 0x101FD],
      [0x1D165, 0x1D169],
      [0x1D16D, 0x1D172],
      [0x1D17B, 0x1D18B],
      [0x1D1AA, 0x1D1AD],
      [0x1D242, 0x1D244]
    ])
  },
  unicodeBMP: function () {
    return random.item([
      // BMP = Basic Multilingual Plane
      [0x0000, 0xFFFF]
    ])
  },
  unicodeSMP: function () {
    return random.item([
      // SMP = Supplementary Multilingual Plane
      [0x10000, 0x13FFF],
      [0x16000, 0x16FFF],
      [0x1B000, 0x1BFFF],
      [0x1D000, 0x1DFFF],
      [0x1F000, 0x1FFFF]
    ])
  },
  unicodeSIP: function () {
    return random.item([
      // SIP = Supplementary Ideographic Plane
      [0x20000, 0x2BFFF],
      [0x2F000, 0x2FFFF]
    ])
  },
  unicodeSSP: function () {
    return random.item([
      // SSP = Supplementary Special-purpose Plane
      [0xE0000, 0xE0FFF]
    ])
  },
  assignmentOperator: function () {
    return random.pick([
      '=', '-=', '+=', '*=', '/='
    ])
  },
  arithmeticOperator: function () {
    return random.pick([
      '%', '-', '+', '*', '/'
    ])
  },
  currency: function () {
    return random.pick([
      // https://en.wikipedia.org/wiki/ISO_4217
      'USD', 'USS', 'USN', 'EUR', 'CHF', 'GBP', 'XAG', 'XBA', 'XBB', 'XBC',
      'XBD', 'XSU', 'XTS', 'XXX'
    ])
  },
  chars: function() {
    return random.pick([
      make.text.controlChar,
      make.text.token,
      make.text.assignmentOperator,
      make.text.arithmeticOperator,
      String.fromCharCode(make.text.layoutCharCodes),
      String.fromCharCode(make.text.bidiCharCodes),
    ]);
  },
  any: function() {
    // Generate a string compromised of random individual characters
    // This might be too slow to used for all 'texts' uses
    let s = '';
    // TODO: Len calculation take from DOMFuzz - maybe we should revise this?
    let len = random.number(1000) * random.number(10) + random.number(10)
    for (let i=0; i<len; i++) {
      s += make.text.chars()
    }
    return s;
  }
}
