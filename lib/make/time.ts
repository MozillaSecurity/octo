/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from '../make'
import { random } from '../random'

export class time {
  static unit () {
    return random.pick([
      's', 'ms'
    ])
  }

  static datetime () {
    if (random.bool()) {
      return new Date(new Date().getTime() + random.number())
    } else {
      return new Date(new Date().getTime() - random.number())
    }
  }

  static date () {
    return time.datetime().toDateString()
  }

  static time () {
    return time.datetime().toTimeString()
  }

  static iso () {
    return time.datetime().toISOString()
  }

  static epoch () {
    return Math.floor(+time.datetime() / 1000)
  }

  static any () {
    return make.numbers.any() + time.unit()
  }
}
