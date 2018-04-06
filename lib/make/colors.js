/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class colors extends make {
  static any () {
    return random.pick([
      colors.rgb,
      colors.hsl,
      colors.keyword
    ])
  }

  static rgb () {
    let values

    switch (random.number(4)) {
      case 0:
        // Rgb functional notation
        if (random.bool()) {
          // Ints
          values = [random.number(255), random.number(255), random.number(255)]
        } else {
          // Percents
          values = ['%' + random.number(255), '%' + random.number(255), '%' + random.number(255)]
        }
        return 'rgba(' + values.join(',') + ')'
      case 1:
        // Rgba functional notation
        values = [random.number(255), random.number(255), random.number(255), random.float()]
        return 'rgba(' + values.join(',') + ')'
      case 2:
        // 4 char hex
        return '#' + random.hex(4)
      default:
        // 8 char hex
        return '#' + random.hex(8)
    }
  }

  static hsl () {
    let values, opt

    switch (random.number(4)) {
      case 0:
        values = [random.number(255), '%' + random.number(255), '%' + random.number(255)]
        return 'hsl(' + values.join(',') + ')'
      case 1:
        values = [random.number(255), '%' + random.number(255), '%' + random.number(255), '%' + random.number(255)]
        return 'hsl(' + values.join(',') + ')'
      case 2:
        opt = random.pick(['deg', 'rad', 'grad', 'turn'])
        values = [random.number(255) + opt, '%' + random.number(255), '%' + random.number(255), '%' + random.number(255)]
        return 'hsl(' + values.join(',') + ')'
      default:
        values = [random.number(255), '%' + random.number(255), '%' + random.number(255), random.float()]
        return 'hsl(' + values.join(',') + ')'
    }
  }

  static keyword () {
    return random.pick([
      'lime', 'red', 'blue', 'invert', 'currentColor', 'ActiveBorder', 'ActiveCaption',
      'AppWorkspace', 'Background', 'ButtonFace', 'ButtonHighlight', 'ButtonShadow',
      'ButtonText', 'CaptionText', 'GrayText', 'Highlight', 'HighlightText',
      'InactiveBorder', 'InactiveCaption', 'InactiveCaptionText', 'InfoBackground',
      'InfoText', 'Menu', 'MenuText', 'Scrollbar', 'ThreeDDarkShadow', 'ThreeDFace',
      'ThreeDHighlight', 'ThreeDLightShadow', 'ThreeDShadow', 'Window', 'WindowFrame',
      'WindowText', '-moz-ButtonDefault', '-moz-ButtonHoverFace', '-moz-ButtonHoverText',
      '-moz-CellHighlight', '-moz-CellHighlightText', '-moz-Combobox', '-moz-ComboboxText',
      '-moz-Dialog', '-moz-DialogText', '-moz-dragtargetzone', '-moz-EvenTreeRow',
      '-moz-Field', '-moz-FieldText', '-moz-html-CellHighlight',
      '-moz-html-CellHighlightText', '-moz-mac-accentdarkestshadow',
      '-moz-mac-accentdarkshadow', '-moz-mac-accentface',
      '-moz-mac-accentlightesthighlight', '-moz-mac-accentlightshadow',
      '-moz-mac-accentregularhighlight', '-moz-mac-accentregularshadow',
      '-moz-mac-chrome-active', '-moz-mac-chrome-inactive', '-moz-mac-focusring',
      '-moz-mac-menuselect', '-moz-mac-menushadow', '-moz-mac-menutextselect',
      '-moz-MenuHover', '-moz-MenuHoverText', '-moz-MenuBarText', '-moz-MenuBarHoverText',
      '-moz-nativehyperlinktext', '-moz-OddTreeRow', '-moz-win-communicationstext',
      '-moz-win-mediatext', '-moz-activehyperlinktext', '-moz-default-background-color',
      '-moz-default-color', '-moz-hyperlinktext', '-moz-visitedhyperlinktext'
    ])
  }
}

module.exports = colors
