class utils {
  static get common () {
    return require('./common')
  }

  static get block () {
    return require('./block')
  }

  static get mutate () {
    return require('./mutate')
  }

  static get objects () {
    return require('./objects')
  }

  static get platform () {
    return require('./platform')
  }

  static get script () {
    return require('./script')
  }

  static get prototypes () {
    return require('./prototypes')
  }
}

module.exports = utils
