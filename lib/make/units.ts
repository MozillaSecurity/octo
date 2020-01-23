/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from '../make'
import { random } from '../random'

export class unit {
  static unit () {
    return random.pick([
      'px', 'em', 'ex', 'ch', 'rem', 'mm', 'cm', 'in', 'pt', 'pc', '%'
    ])
  }

  // @ts-ignore
  static length () {
    return make.numbers.any() + make.unit.unit()
  }

  static percent () {
    if (random.chance(100)) {
      return `${make.numbers.any()}%`
    }

    return `${random.number(100 + 1)}%`
  }
}
