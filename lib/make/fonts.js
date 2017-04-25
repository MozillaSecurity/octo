/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.font = {
  style: function () {
    return ["italic", "normal", "oblique", "inherit"];
  },
  variant: function () {
    return ["normal", "small-caps", "inherit"];
  },
  weight: function () {
    return ["normal", "bold", "bolder", "lighter"];
  },
  size: function () {
    return ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
  },
  genericFamily: function () {
    return ["serif", "sans-serif", "cursive", "fantasy", "monospace"];
  },
  fammilyName: function () {
    return ["Times New Roman", "Arial", "Courier", "Helvetica"];
  },
  family: function () {
    let s = random.pick(make.fonts.fontFamilies);
    if (random.chance(8)) {
      s += ", " + random.pick(make.fonts.fontFamiliesGeneric);
    }
    return s;
  },
  font: function () {
    let s = "";
    if (random.chance(4)) {
      s += random.pick(make.fonts.style) + " ";
    }
    if (random.chance(4)) {
      s += random.pick(make.fonts.variant) + " ";
    }
    if (random.chance(4)) {
      s += random.pick(make.fonts.weight) + " ";
    }
    if (random.chance(4)) {
      s += make.numbers.number() + "/";
    }
    s += make.fonts.size();
    s += " ";
    s += make.fonts.family();
    return "'" + s + "'";
  }
};
