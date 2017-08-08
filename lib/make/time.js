/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.time = {
  unit: function () {
    return random.pick([
      's', 'ms'
    ])
  },
  any: function () {
    return make.number.any() + make.time.unit()
  }
}
