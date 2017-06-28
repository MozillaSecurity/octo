make.alignment = {
  horizontal: function () {
    return random.item(['left', 'right', 'justify', 'center'])
  },
  vertical: function () {
    return random.item(['top', 'bottom', 'middle', 'baseline'])
  },
  any: function () {
    return random.pick([
      this.horizontal,
      this.vertical
    ])
  }
}
