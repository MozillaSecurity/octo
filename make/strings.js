make.strings = {
  toString: function (object) {
    return object ? object.toSource() : '' + object
  },
  string: function (maxlen) {
    let s = "";

    if (maxlen == null || maxlen === undefined) {
      maxlen = make.rangeNumber();
    }

    for (let i = 0; i < maxlen; i++) {
      //s += String.fromCodePoint(Random.pick(Make.layoutCharCodes));
      s += "A"
    }

    return s;
  },
  quotedString: function (maxlen) {
    return utils.quote(make.string(maxlen));
  },
  stringFromBlocks: function (set, maxlen) {
    let s = "";

    for (let i = 0; i < random.number(maxlen || 255); i++) {
      s += random.pick(set);
    }

    return s;
  },
}
