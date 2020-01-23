/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from '../random'

export class alignment {
  static horizontal () {
    return random.item(['left', 'right', 'justify', 'center'])
  }

  static vertical () {
    return random.item(['top', 'bottom', 'middle', 'baseline'])
  }

  static any () {
    return random.pick([this.horizontal, this.vertical])
  }
}
