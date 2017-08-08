make.style = {
  pseudoElement: function () {
    return random.item([
      '::after',
      '::before',
      '::cue',
      '::first-letter',
      '::first-line',
      '::selection',
      '::backdrop',
      '::placeholder',
      '::marker',
      '::spelling-error',
      '::grammar-error'])
  }
}
