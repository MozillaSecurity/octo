/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from '../make'
import { random } from '../random'

export class mutate {
  static text (str: string) {
    const mutator = function (m: string) {
      return random.chance(4) ? m : make.text.any()
    }
    return str.replace(/[a-zA-Z]+?/g, mutator)
  }

  static numbers (str: string) {
    const mutator = function (m: string) {
      return random.chance(4) ? m : make.numbers.any()
    }
    return str.replace(/-?\d+(\.\d+)?/g, mutator)
  }

  static units (str: string) {
    const mutator = function (m: string, p1: string) {
      if (random.chance(4)) {
        return m
      } else {
        return p1 + make.unit.unit()
      }
    }
    return str.replace(/(\d+)(px|em|ex|ch|rem|mm|cm|in|pt|pc|%')/g, mutator)
  }

  static random (str: string) {
    const mutator = function (m: string) {
      if (random.chance(20)) {
        if (str.match(/[0-9]/g)) {
          return make.numbers.any()
        } else {
          return make.text.any()
        }
      } else {
        return m
      }
    }
    return str.replace(/./g, mutator)
  }

  static any (str: string) {
    switch (random.number(4)) {
      case 0:
        return mutate.text(str)
      case 1:
        return mutate.numbers(str)
      case 2:
        return mutate.units(str)
      default:
        return mutate.random(str)
    }
  }
}
