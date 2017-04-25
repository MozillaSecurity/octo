/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.unit = {
  unit: function () {
    return random.pick([
      "px", "em", "ex", "ch", "rem", "mm", "cm", "in", "pt", "pc", "%"
    ]);
  },
  length: function () {
    return make.number.any() + make.unit.unit();
  },
  percent: function () {
    return make.number.any() + "%";
  },
};
