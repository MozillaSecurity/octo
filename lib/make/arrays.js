/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.arrays = {
  filledArray: function (fn, limit) {
    let array = [];
    let size = limit || random.number(make.number.tinyNumber);

    for (let i = 0; i < size; i++) {
      array.push(fn());
    }

    return array;
  }
};
