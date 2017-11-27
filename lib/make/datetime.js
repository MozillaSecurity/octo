/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.datetime = {
  object: function () {
    switch (random.number(2)) {
      case 0:
        return new Date(new Date().getTime() + random.number())
      case 1:
        return new Date(new Date().getTime() - random.number())
    }
  },
  date: function () { // eslint-disable-line no-unused-vars
    return this.object().toDateString()
  },
  time: function () { // eslint-disable-line no-unused-vars
    return this.object().toTimeString()
  },
  iso: function () { // eslint-disable-line no-unused-vars
    return this.object().toISOString()
  },
  epoch: function () { // eslint-disable-line no-unused-vars
    return Math.floor(this.object() / 1000)
  }
}
