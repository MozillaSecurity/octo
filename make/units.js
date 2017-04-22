make.units = {
  lengthUnit: function () {
    return random.pick([
      "px", "em", "ex", "ch", "rem", "mm", "cm", "in", "pt", "pc", "%"
    ]);
  },
  length: function () {
    return make.numbers.number() + make.units.lengthUnit();
  },
  percent: function () {
    return make.numbers.number() + "%";
  },
};
