/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.strings = {
  toString: function (object) {
    return object ? object.toSource() : '' + object
  },
  string: function (maxlen) {
    let s = "";

    if (maxlen == null || maxlen === undefined) {
      maxlen = make.numbers.rangeNumber();
    }

    for (let i = 0; i < maxlen; i++) {
      //s += String.fromCodePoint(Random.pick(make.fonts.layoutCharCodes));
      s += "A"
    }

    return s;
  },
  quotedString: function (maxlen) {
    return utils.common.quote(make.strings.string(maxlen));
  },
  stringFromBlocks: function (set, maxlen) {
    let s = "";

    for (let i = 0; i < random.number(maxlen || 255); i++) {
      s += random.pick(set);
    }

    return s;
  },
  digitsHex: function (n) {
    let s = '';
    while (n-- > 0) {
      s += (random.number(16)).toString(16);
    }
    return s;
  },
};
