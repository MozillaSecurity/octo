make.types = {
  random: function() {
    return random.item([
      "true",
      "null",
      "(new Object())",
      "undefined",
      "{}",
      "[]",
      "''",
      "function() {}"
    ]);
  }
}
