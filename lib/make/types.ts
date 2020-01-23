/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from '../random'

export class types {
  static random () {
    return random.item([
      'true',
      'null',
      '(new Object())',
      'undefined',
      '{}',
      '[]',
      '\'\'',
      'function() {}'
    ])
  }
}
