/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.alignment = {
  horizontal: function () {
    return random.item(['left', 'right', 'justify', 'center'])
  },
  vertical: function () {
    return random.item(['top', 'bottom', 'middle', 'baseline'])
  },
  any: function () {
    return random.pick([
      this.horizontal,
      this.vertical
    ])
  }
}
