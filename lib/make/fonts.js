/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.fonts = {
  fontStyles: function () {
    return ["italic", "normal", "oblique", "inherit"];
  },
  fontVariants: function () {
    return ["normal", "small-caps", "inherit"];
  },
  fontWeights: function () {
    return ["normal", "bold", "bolder", "lighter"];
  },
  fontSizeAbsolute: function () {
    return ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
  },
  fontFamiliesGeneric: function () {
    return ["serif", "sans-serif", "cursive", "fantasy", "monospace"];
  },
  fontFamilies: function () {
    return ["'Times New Roman'", "Arial", "Courier", "Helvetica"];
  },
  fontFamily: function () {
    let s = random.pick(make.fonts.fontFamilies);
    if (random.chance(8)) {
      s += ", " + random.pick(make.fonts.fontFamiliesGeneric);
    }
    return s;
  },
  fontSize: function () {
    return make.numbers.unsignedNumber() + make.fonts.lengthUnit();
  },
  font: function () {
    let s = "";
    if (random.chance(4)) {
      s += random.pick(make.fonts.fontStyles) + " ";
    }
    if (random.chance(4)) {
      s += random.pick(make.fonts.fontVariants) + " ";
    }
    if (random.chance(4)) {
      s += random.pick(make.fonts.fontWeights) + " ";
    }
    if (random.chance(4)) {
      s += make.numbers.number() + "/";
    }
    s += make.fonts.fontSize();
    s += " ";
    s += make.fonts.fontFamily();
    return "'" + s + "'";
  }
};
