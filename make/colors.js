make.colors = {
  colors: function() {
    return Random.pick([
      make.colorRGB,
      make.colorHSL,
      make.colorKeywords
    ]);
  },

  colorRGB: function() {
    let values;
    
    switch (Random.number(4)) {
      case 0:
        // Rgb functional notation
        if (Random.bool()) {
          // Ints
          values = [Random.number(255), Random.number(255), Random.number(255)];
        } else {
          // Percents
          values = ["%" + Random.number(255), "%" + Random.number(255), "%" + Random.number(255)];
        }
        return "rgba(" + values.join(',') + ")";
      case 1:
        // Rgba functional notation
        values = [Random.number(255), Random.number(255), Random.number(255), Random.float()];
        return "rgba(" + values.join(',') + ")";
      case 2:
        // 4 char hex
        return "#" + Random.hex(4);
      default:
        // 8 char hex
        return "#" + Random.hex(8);
    }
  },

  colorHSL: function() {
    let values, opt;
    switch(Random.number(4)) {
      case 0:
        values = [Random.number(255), "%" + Random.number(255), "%" + Random.number(255)];
        return "hsl(" + values.join(',') + ")";
      case 1:
        values = [Random.number(255), "%" + Random.number(255), "%" + Random.number(255), "%" + Random.number(255)];
        return "hsl(" + values.join(',') + ")";
      case 2:
        opt = Random.pick(['deg', 'rad', 'grad', 'turn']);
        values = [Random.number(255) + opt, "%" + Random.number(255), "%" + Random.number(255), "%" + Random.number(255)];
        return "hsl(" + values.join(',') + ")";
      default:
        values = [Random.number(255), "%" + Random.number(255), "%" + Random.number(255), Random.float()];
        return "hsl(" + values.join(',') + ")";
    }
  },

  colorKeywords: function() {
    return Random.pick([
      "lime", "red", "blue", "invert", "currentColor", "ActiveBorder", "ActiveCaption",
      "AppWorkspace", "Background", "ButtonFace", "ButtonHighlight", "ButtonShadow",
      "ButtonText", "CaptionText", "GrayText", "Highlight", "HighlightText",
      "InactiveBorder", "InactiveCaption", "InactiveCaptionText", "InfoBackground",
      "InfoText", "Menu", "MenuText", "Scrollbar", "ThreeDDarkShadow", "ThreeDFace",
      "ThreeDHighlight", "ThreeDLightShadow", "ThreeDShadow", "Window", "WindowFrame",
      "WindowText", "-moz-ButtonDefault", "-moz-ButtonHoverFace", "-moz-ButtonHoverText",
      "-moz-CellHighlight", "-moz-CellHighlightText", "-moz-Combobox", "-moz-ComboboxText",
      "-moz-Dialog", "-moz-DialogText", "-moz-dragtargetzone", "-moz-EvenTreeRow",
      "-moz-Field", "-moz-FieldText", "-moz-html-CellHighlight",
      "-moz-html-CellHighlightText", "-moz-mac-accentdarkestshadow",
      "-moz-mac-accentdarkshadow", "-moz-mac-accentface",
      "-moz-mac-accentlightesthighlight", "-moz-mac-accentlightshadow",
      "-moz-mac-accentregularhighlight", "-moz-mac-accentregularshadow",
      "-moz-mac-chrome-active", "-moz-mac-chrome-inactive", "-moz-mac-focusring",
      "-moz-mac-menuselect", "-moz-mac-menushadow", "-moz-mac-menutextselect",
      "-moz-MenuHover", "-moz-MenuHoverText", "-moz-MenuBarText", "-moz-MenuBarHoverText",
      "-moz-nativehyperlinktext", "-moz-OddTreeRow", "-moz-win-communicationstext",
      "-moz-win-mediatext", "-moz-activehyperlinktext", "-moz-default-background-color",
      "-moz-default-color", "-moz-hyperlinktext", "-moz-visitedhyperlinktext"
    ]);
  }
};