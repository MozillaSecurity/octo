/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.mutate = {
  text: function (str) {
    let mutator = function (m) {
      return random.chance(4) ? m : make.text.any()
    }
    return str.replace(/[a-zA-Z]+?/g, mutator)
  },

  numbers: function (str) {
    let mutator = function (m) {
      return random.chance(4) ? m : make.number.any()
    }
    return str.replace(/-?\d+(\.\d+)?/g, mutator)
  },

  units: function (str) {
    let mutator = function (m, p1) {
      if (random.chance(4)) {
        return m
      } else {
        return p1 + make.unit.unit()
      }
    }
    return str.replace(/(\d+)(px|em|ex|ch|rem|mm|cm|in|pt|pc|%')/g, mutator)
  },

  random: function (str) {
    let mutator = function (m) {
      if (random.chance(20)) {
        if (str.match(/[0-9]/g)) {
          return make.number.any()
        } else {
          return make.text.any()
        }
      } else {
        return m
      }
    }
    return str.replace(/./g, mutator)
  },

  any: function (str) {
    switch (random.number(4)) {
      case 0:
        return utils.mutate.text(str)
      case 1:
        return utils.mutate.numbers(str)
      case 2:
        return utils.mutate.units(str)
      case 3:
        return utils.mutate.random(str)
    }
  }
}
