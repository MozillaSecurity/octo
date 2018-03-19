/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class font extends make {
  static globalValue () {
    return random.pick(['inherit', 'initial', 'unset'])
  }

  static style () {
    return random.pick(['italic', 'normal', 'oblique', 'inherit'])
  }

  static variant () {
    return random.pick(['normal', 'small-caps', 'inherit'])
  }

  static weight () {
    return random.pick([
      /* standard */
      ['normal', 'bold'],
      /* Relative to the parent */
      ['bolder', 'lighter'],
      /* numeric values */
      [100, 200, 300, 400, 500, 600, 700, 800, 900]
    ])
  }

  static size () {
    return random.pick([
      /* <absolute-size> values */
      ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'],
      /* <relative-size> values */
      ['larger', 'smaller'],
      /* <length> values */
      make.number.unsigned() + make.unit.unit(),
      /* <percentage> values */
      make.unit.percent()
    ])
  }

  static relativeSize () {
    let value = random.number(8)
    return random.item(['', '+', '-']) + value
  }

  static genericFamily () {
    return random.pick(['serif', 'sans-serif', 'cursive', 'fantasy', 'monospace'])
  }

  static familyName () {
    return random.pick(['Times New Roman', 'Arial', 'Courier', 'Helvetica'])
  }

  static family () {
    let s = random.pick(this.familyName)
    if (random.chance(8)) {
      s += ', ' + random.pick(this.genericFamily)
    }
    return s
  }

  static registeredFontFeatures () {
    return random.pick([
      'aalt', 'abvf', 'abvm', 'abvs', 'afrc', 'akhn', 'blwf', 'blwm', 'blws',
      'calt', 'case', 'ccmp', 'cfar', 'cjct', 'clig', 'cpct', 'cpsp', 'cswh',
      'curs', 'cv01-cv99', 'c2pc', 'c2sc', 'dist', 'dlig', 'dnom', 'expt',
      'falt', 'fin2', 'fin3', 'fina', 'frac', 'fwid', 'half', 'haln', 'halt',
      'hist', 'hkna', 'hlig', 'hngl', 'hojo', 'hwid', 'init', 'isol', 'ital',
      'jalt', 'jp78', 'jp83', 'jp90', 'jp04', 'kern', 'lfbd', 'liga', 'ljmo',
      'lnum', 'locl', 'ltra', 'ltrm', 'mark', 'med2', 'medi', 'mgrk', 'mkmk',
      'mset', 'nalt', 'nlck', 'nukt', 'numr', 'onum', 'opbd', 'ordn', 'ornm',
      'palt', 'pcap', 'pkna', 'pnum', 'pref', 'pres', 'pstf', 'psts', 'pwid',
      'qwid', 'rand', 'rkrf', 'rlig', 'rphf', 'rtbd', 'rtla', 'rtlm', 'ruby',
      'salt', 'sinf', 'size', 'smcp', 'smpl', 'ss01', 'ss02', 'ss03', 'ss04',
      'ss05', 'ss06', 'ss07', 'ss08', 'ss09', 'ss10', 'ss11', 'ss12', 'ss13',
      'ss14', 'ss15', 'ss16', 'ss17', 'ss18', 'ss19', 'ss20', 'subs', 'sups',
      'swsh', 'titl', 'tjmo', 'tnam', 'tnum', 'trad', 'twid', 'unic', 'valt',
      'vatu', 'vert', 'vhal', 'vjmo', 'vkna', 'vkrn', 'vpal', 'vrt2', 'zero'
    ])
  }

  static font () {
    let s = ''
    if (random.chance(4)) {
      s += random.pick(this.style) + ' '
    }
    if (random.chance(4)) {
      s += random.pick(this.variant) + ' '
    }
    if (random.chance(4)) {
      s += random.pick(this.weight) + ' '
    }
    if (random.chance(4)) {
      s += make.number.any() + '/'
    }
    s += this.size()
    s += ' '
    s += this.family()
    return s
  }
}

module.exports = font
