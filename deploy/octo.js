/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var random = { // eslint-disable-line no-unused-vars
  seed: null,
  twister: null,

  /**
   * Must be called before any other methods can be called to initialize MersenneTwister.
   * @param {number|null|undefined} seed Value to initialize MersenneTwister.
   */
  init: function (seed) {
    if (seed === null || seed === undefined) {
      this.seed = new Date().getTime()
    }
    this.twister = new MersenneTwister()
    this.twister.seed(this.seed)
  },
  number: function (limit) {
    // Returns an integer in [0, limit). Uniform distribution.
    if (limit === 0) {
      return limit
    }
    if (limit === null || limit === undefined) {
      limit = 0xffffffff
    }
    let x = (0x100000000 / limit) >>> 0
    let y = (x * limit) >>> 0
    let r
    do {
      r = this.twister.int32()
    } while (y && r >= y) // eslint-disable-line no-unmodified-loop-condition
    return (r / x) >>> 0
  },
  float: function () {
    // Returns a float in [0, 1). Uniform distribution.
    return this.twister.real2()
  },
  range: function (start, limit) {
    // Returns an integer in [start, limit]. Uniform distribution.
    if (isNaN(start) || isNaN(limit)) {
      logger.traceback()
      throw new TypeError('random.range() received a non number type: \'' + start + '\', \'' + limit + '\')')
    }
    return this.number(limit - start + 1) + start
  },
  ludOneTo: function (limit) {
    // Returns a float in [1, limit]. The logarithm has uniform distribution.
    return Math.exp(this.float() * Math.log(limit))
  },
  item: function (list) {
    if (list === undefined || typeof list === 'string' || list.length === undefined) {
      logger.traceback()
      throw new TypeError('random.item() received an invalid object: \'' + list + '\'')
    }
    /*
    if (typeof list === 'object') {
      logger.info('You are passing an object to random.item!\n>>>' + list)
    }
    */
    // if (typeof list === 'object') { // Todo: remove random.key()
    //      return list[random.item(Object.keys(list))]
    // }

    return list[this.number(list.length)]
  },
  key: function (obj) {
    let list = []
    for (let i in obj) {
      list.push(i)
    }
    return this.item(list)
  },
  bool: function () {
    return this.item([true, false])
  },
  pick: function (obj) {
    if (typeof obj === 'function') {
      return obj()
    }
    if (Array.isArray(obj)) {
      return this.pick(this.item(obj))
    }
    return obj
  },
  chance: function (limit) {
    if (limit === null || limit === undefined) {
      limit = 2
    }
    if (isNaN(limit)) {
      logger.traceback()
      throw new TypeError('random.chance() received a non number type: \'' + limit + '\'')
    }
    return this.number(limit) === 1
  },
  choose: function (list, flat) {
    if (!(Array.isArray(list))) {
      logger.traceback()
      throw new TypeError('random.choose() received a non-array type: \'' + list + '\'')
    }
    let total = 0
    for (let i = 0; i < list.length; i++) {
      total += list[i][0]
    }
    let n = this.number(total)
    for (let i = 0; i < list.length; i++) {
      if (n < list[i][0]) {
        if (flat === true) {
          return list[i][1]
        } else {
          return this.pick([list[i][1]])
        }
      }
      n = n - list[i][0]
    }
    if (flat === true) {
      return list[0][1]
    }
    return this.pick([list[0][1]])
  },
  weighted: function (wa) {
    // More memory-hungry but hopefully faster than random.choose$flat
    let a = []
    for (let i = 0; i < wa.length; ++i) {
      for (let j = 0; j < wa[i].w; ++j) {
        a.push(wa[i].v)
      }
    }
    return a
  },
  use: function (obj) {
    return this.bool() ? obj : ''
  },
  shuffle: function (arr) {
    let i = arr.length
    while (i--) {
      let p = this.number(i + 1)
      let t = arr[i]
      arr[i] = arr[p]
      arr[p] = t
    }
  },
  shuffled: function (arr) {
    let newArray = arr.slice()
    this.shuffle(newArray)
    return newArray
  },
  subset: function (list, limit) {
    if (!(Array.isArray(list))) {
      logger.traceback()
      throw new TypeError('random.subset() received a non-array type: \'' + list + '\'')
    }
    if (typeof limit !== 'number') {
      limit = this.number(list.length + 1)
    }
    let result = []
    for (let i = 0; i < limit; i++) {
      result.push(this.pick(list))
    }
    return result
  },
  pop: function (arr) {
    // Removes and returns a random item from an array
    let i, obj

    i = this.number(arr.length)
    obj = arr[i]
    arr.splice(i, 1)

    return obj
  },
  hex: function (len) {
    return this.number(Math.pow(2, len * 4)).toString(16)
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * JavaScript version of Mersenne Twister
 *
 * @author Yasuharu Okada
 *
 */

function MersenneTwister () { // eslint-disable-line no-unused-vars
  const N = 624
  const M = 397
  const UPPER_MASK = 0x80000000
  const LOWER_MASK = 0x7fffffff
  const MAG01 = new Int32Array([0, 0x9908b0df])

  let mt = new Int32Array(N)
  /* the array for the state vector */
  let mti = 625

  this.seed = function (s) {
    mt[0] = s | 0
    for (mti = 1; mti < N; mti++) {
      mt[mti] = Math.imul(1812433253, mt[mti - 1] ^ (mt[mti - 1] >>> 30)) + mti
    }
  }

  this.export_state = function () {
    return [mt, mti]
  }

  this.import_state = function (s) {
    mt = s[0]
    mti = s[1]
  }

  this.export_mta = function () {
    return mt
  }

  this.import_mta = function (_mta) {
    mt = _mta
  }

  this.export_mti = function () {
    return mti
  }

  this.import_mti = function (_mti) {
    mti = _mti
  }

  this.int32 = function () {
    let y, kk

    if (mti >= N) { /* generate N words at one time */
      for (kk = 0; kk < N - M; kk++) {
        y = ((mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK))
        mt[kk] = (mt[kk + M] ^ (y >>> 1) ^ MAG01[y & 0x1])
      }
      for (; kk < N - 1; kk++) {
        y = ((mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK))
        mt[kk] = (mt[kk + (M - N)] ^ (y >>> 1) ^ MAG01[y & 0x1])
      }
      y = ((mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK))
      mt[N - 1] = (mt[M - 1] ^ (y >>> 1) ^ MAG01[y & 0x1])
      mti = 0
    }

    y = mt[mti++]

    /* Tempering */
    y = y ^ (y >>> 11)
    y = y ^ ((y << 7) & 0x9d2c5680)
    y = y ^ ((y << 15) & 0xefc60000)
    y = y ^ (y >>> 18)

    return y >>> 0
  }

  this.real2 = function () {
    return ((this.int32() >>> 5) * 67108864.0 + (this.int32() >>> 6)) / 9007199254740992.0
  }
}


var utils = {} // eslint-disable-line no-unused-vars
module.exports = utils


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.platform = (function () {
  let platform = {}

  const userAgent = (navigator.userAgent).toLowerCase()
  const language = navigator.language || navigator.browserLanguage

  const version = platform.version = (userAgent.match(/.*(?:rv|chrome|webkit|opera|ie)[/: ](.+?)([ );]|$)/) || [])[1]
  const webkitVersion = (userAgent.match(/webkit\/(.+?) /) || [])[1]

  platform.windows = platform.isWindows = !!/windows/.test(userAgent)
  platform.mac = platform.isMac = !!/macintosh/.test(userAgent) || (/mac os x/.test(userAgent) && !/like mac os x/.test(userAgent))
  platform.lion = platform.isLion = !!(/mac os x 10_7/.test(userAgent) && !/like mac os x 10_7/.test(userAgent))
  platform.iPhone = platform.isiPhone = !!/iphone/.test(userAgent)
  platform.iPod = platform.isiPod = !!/ipod/.test(userAgent)
  platform.iPad = platform.isiPad = !!/ipad/.test(userAgent)
  platform.iOS = platform.isiOS = platform.iPhone || platform.iPod || platform.iPad
  platform.android = platform.isAndroid = !!/android/.test(userAgent)
  platform.opera = /opera/.test(userAgent) ? version : 0
  platform.isOpera = !!platform.opera
  platform.msie = /msie/.test(userAgent) && !platform.opera ? version : 0
  platform.isIE = !!platform.msie
  platform.isIE8OrLower = !!(platform.msie && parseInt(platform.msie, 10) <= 8)
  platform.mozilla = /mozilla/.test(userAgent) && !/(compatible|webkit|msie)/.test(userAgent) ? version : 0
  platform.isMozilla = !!platform.mozilla
  platform.webkit = /webkit/.test(userAgent) ? webkitVersion : 0
  platform.isWebkit = !!platform.webkit
  platform.chrome = /chrome/.test(userAgent) ? version : 0
  platform.isChrome = !!platform.chrome
  platform.mobileSafari = /apple.*mobile/.test(userAgent) && platform.iOS ? webkitVersion : 0
  platform.isMobileSafari = !!platform.mobileSafari
  platform.iPadSafari = platform.iPad && platform.isMobileSafari ? webkitVersion : 0
  platform.isiPadSafari = !!platform.iPadSafari
  platform.iPhoneSafari = platform.iPhone && platform.isMobileSafari ? webkitVersion : 0
  platform.isiPhoneSafari = !!platform.iphoneSafari
  platform.iPodSafari = platform.iPod && platform.isMobileSafari ? webkitVersion : 0
  platform.isiPodSafari = !!platform.iPodSafari
  platform.isiOSHomeScreen = platform.isMobileSafari && !/apple.*mobile.*safari/.test(userAgent)
  platform.safari = platform.webkit && !platform.chrome && !platform.iOS && !platform.android ? webkitVersion : 0
  platform.isSafari = !!platform.safari
  platform.language = language.split('-', 1)[0]
  platform.current =
    platform.msie ? 'msie' : platform.mozilla ? 'mozilla' : platform.chrome ? 'chrome' : platform.safari ? 'safari' : platform.opera ? 'opera' : platform.mobileSafari ? 'mobile-safari' : platform.android ? 'android' : 'unknown'

  function platformName (candidates) {
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i] in window) {
        return 'window.' + candidates[i]
      }
      if (candidates[i] in navigator) {
        return 'navigator.' + candidates[i]
      }
    }
    return undefined
  }

  platform.GUM = platformName(['getUserMedia', 'webkitGetUserMedia', 'mozGetUserMedia', 'msGetUserMedia', 'getGUM'])
  platform.PeerConnection = platformName(['webkitRTCPeerConnection', 'mozRTCPeerConnection', 'msPeerConnection'])
  platform.IceCandidate = platformName(['mozRTCIceCandidate', 'RTCIceCandidate'])
  platform.SessionDescription = platformName(['mozRTCSessionDescription', 'RTCSessionDescription'])
  platform.URL = platformName(['URL', 'webkitURL'])
  platform.AudioContext = platformName(['AudioContext', 'webkitAudioContext'])
  platform.OfflineAudioContext = platformName(['OfflineAudioContext', 'webkitOfflineAudioContext'])
  platform.MediaSource = platformName(['MediaSource', 'WebKitMediaSource'])

  platform.SpeechRecognition = platformName(['SpeechRecognition', 'webkitSpeechRecognition'])
  platform.SpeechGrammarList = platformName(['SpeechGrammarList', 'webkitSpeechGrammarList'])
  platform.SpeechGrammar = platformName(['SpeechGrammar'])

  /*
   function findWebGLContextName (candidates) {
   var canvas = document.createElement('canvas')
   for (var i = 0; i < candidates.length; i++) {
   var name = candidates[i]
   try {
   if (canvas.getContext(name)) {
   return name
   }
   } catch (e) {}
   }
   return null
   }
   */

  platform.WebGL = 'webgl' // findWebGLContextName(["webgl", "experimental-webgl", "webkit-3d"]);
  platform.WebGL2 = 'webgl2' // findWebGLContextName(["webgl2", "experimental-webgl2"]);

  platform.captureStreamUntilEnded = 'captureStreamUntilEnded'
  if (platform.isMozilla) {
    platform.captureStreamUntilEnded = 'mozCaptureStreamUntilEnded'
  }

  platform.srcObject = 'srcObject'
  if (platform.isMozilla) {
    platform.srcObject = 'mozSrcObject'
  }

  return platform
})()


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var websocket = null

var logger = (function () { // eslint-disable-line no-unused-vars
  const sep = '\n/* ### NEXT TESTCASE ############################## */'
  const color = {
    red: '\u{1b}[1;31m',
    green: '\u{1b}[1;32m',
    clear: '\u{1b}[0m'
  }
  if (utils.platform.isWindows) {
    color.red = ''
    color.green = ''
    color.clear = ''
  }

  function console (msg) {
    if (websocket) {
      websocket.send(msg)
    }
    if (typeof window === 'undefined') {
      print(msg)  // eslint-disable-line no-undef
    } else if (window.dump) {
      window.dump(msg)
    } else if (window.console && window.console.log) {
      window.console.log(msg)
    } else {
      throw new Error('Unable to run console logger.')
    }
  }

  function dump (msg) {
    console(msg)
  }

  function dumpln (msg) {
    dump(msg + '\n')
  }

  function log (msg) {
    dumpln('/*L*/ ' + utils.script.safely(msg))
  }

  function info (msg) {
    dumpln('/*L*/ /* ' + msg + ' */')
  }

  function error (msg) {
    dumpln(color.red + msg + color.clear)
  }

  function ok (msg) { // eslint-disable-line no-unused-vars
    dumpln(color.green + msg + color.green)
  }

  function JSError (msg) {
    error('/* ERROR: ' + msg + ' */')
  }

  function comment (msg) {
    dumpln('/*L*/ // ' + msg)
  }

  function separator () {
    dumpln(color.green + sep + color.clear)
  }

  function traceback () {
    error('===[ Traceback ]')
    try {
      throw new Error()
    } catch (e) {
      dump(e.stack || e.stacktrace || '')
    }
    error('================')
  }

  return {
    console: console,
    dump: dump,
    log: log,
    info: info,
    error: error,
    JSError: JSError,
    dumpln: dumpln,
    comment: comment,
    separator: separator,
    traceback: traceback
  }
})()


var make = {} // eslint-disable-line no-unused-vars


/* eslint no-extend-native: ["error", { "exceptions": ["String", "Array"] }] */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Object.defineProperty(String.prototype, 'fromCodePoint', function () {
  let chars = []
  let point, offset, units, i
  for (i = 0; i < arguments.length; ++i) {
    point = arguments[i]
    offset = point - 0x10000
    units = point > 0xFFFF
      ? [
        0xD800 + (offset >> 10),
        0xDC00 + (offset & 0x3FF)]
      : [point]
    chars.push(String.fromCharCode.apply(null, units))
  }
  return chars.join('')
})

Object.defineProperty(String.prototype, 'endsWith', function (str) {
  return this.match(str + '$') === str
})

Object.defineProperty(String.prototype, 'startsWith', function (str) {
  return this.match('^' + str) === str
})

Object.defineProperty(String.prototype, 'trim', function () {
  return this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')
})

Object.defineProperty(String.prototype, 'insert', function (data, idx) {
  return this.slice(0, idx) + data + this.slice(idx, this.length)
})

Object.defineProperty(Array.prototype, 'has', function (v) {
  return this.indexOf(v) !== -1
})

Object.defineProperty(Array.prototype, 'forEach', function (array, fn) {
  for (let i = 0; i < array.length; i++) {
    fn(array[i])
  }
})

Object.defineProperty(Array.prototype, 'map', function (fn, array) {
  let result = []
  Array.forEach(array, function (element) {
    result.push(fn(element))
  })
  return result
})

Object.defineProperty(Array.prototype, 'extend', {
  value: function (obj) {
    if (Array.isArray(obj)) {
      obj.forEach(function (v) {
        if (typeof v !== 'undefined') {
          this.push(v)
        }
      }, this)
    } else {
      this.push(obj)
    }
  }
})

Object.defineProperty(Object, 'isObject', {
  value: function (obj) {
    return (obj !== null && typeof obj === 'object' &&
    Object.prototype.toString.call(obj) === '[object Object]')
  }
})


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.script = {
  methodHead: function (list, numOptional) {
    if (isNaN(numOptional)) {
      numOptional = 0
    }
    let arity = list.length - random.number(numOptional)
    let params = []
    for (let i = 0; i < arity; i++) {
      params.push(random.pick([list[i]]))
    }
    return '(' + params.join(', ') + ')'
  },
  methodCall: function (objectName, methodHash) {
    if (!utils.common.getKeysFromHash(methodHash).length || !objectName) {
      return ''
    }
    let methodName = random.key(methodHash)
    let methodArgs = methodHash[methodName]
    if (typeof (methodArgs) === 'function') { // Todo: Hmmmm..
      return methodArgs()
    }
    return objectName + '.' + methodName + utils.script.methodHead(methodArgs)
  },
  setAttribute: function (objectName, attributeHash) {
    if (!utils.common.getKeysFromHash(attributeHash).length || !objectName) {
      return ''
    }
    let attributeName = random.key(attributeHash)
    let attributeValue = random.pick(attributeHash[attributeName])
    let operator = ' = '
    /*
     if (typeof(attributeValue) == "number" && Random.chance(8)) {
     operator = " " + Make.randomAssignmentOperator() + " ";
     }
     if (typeof(attributeValue) == "string") {
     attributeValue = "'" + attributeValue + "'";
     }
     */
    return objectName + '.' + attributeName + operator + attributeValue + ';'
  },
  makeConstraint: function (keys, values) {
    let o = {}
    let n = random.range(0, keys.length)
    while (n--) {
      o[random.pick(keys)] = random.pick(values)
    }
    return o
  },
  makeRandomOptions: function (baseObject) {
    let o = {}
    let unique = random.subset(Object.keys(baseObject))
    for (let i = 0; i < unique.length; i++) {
      o[unique[i]] = random.pick(baseObject[unique[i]])
    }
    return JSON.stringify(o)
  },
  safely: function (s) {
    return 'try { ' + s + ' } catch(e) { }'
  },
  makeLoop: function (s, max) {
    return 'for (let i = 0; i < ' + (max || make.number.range()) + '; i++) {' + s + '}'
  },
  makeArray: function (type, arrayLength, cb) {
    if (type === null || type === undefined) {
      type = random.item(['Uint8', 'Float32'])
    }
    switch (random.number(8)) {
      case 0:
        let src = 'function() { let buffer = new ' + type + 'Array(' + arrayLength + ');'
        src += utils.script.makeLoop('buffer[i] = ' + cb() + ';', arrayLength)
        src += 'return buffer;}()'
        return src
      case 1:
        return 'new ' + type + 'Array([' + make.arrays.filledArray(cb, arrayLength) + '])'
      default:
        return 'new ' + type + 'Array(' + arrayLength + ')'
    }
  },
  randListIndex: function (objName) {
    return random.number() + ' % ' + o.pick(objName) + '.length'
  },
  addElementToBody: function (name) {
    return '(document.body || document.documentElement).appendChild' + utils.script.methodHead([name])
  },
  forceGC: function () {
    if (utils.platform.isMozilla) {
    }
    if (utils.platform.isChrome) {
      if (window.GCController) {
        return GCController.collect() // eslint-disable-line no-undef
      }
    }
    if (utils.platform.isSafari) {
    }
    if (utils.platform.isIE) {
    }
  },
  getRandomElement: function () {
    return 'document.getElementsByTagName(\'*\')[' + random.number(document.getElementsByTagName('*').length) + ']'
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var o = null // eslint-disable-line no-unused-vars

function Objects () {
  this.counter = 0
  this.container = {}
}

Objects.prototype.add = function (category, member) {
  if (!member) {
    member = 'o' + this.counter
  }
  if (!this.has(category)) {
    this.container[category] = []
  }
  this.container[category].push({type: category, name: member})
  ++this.counter
  return this.container[category].slice(-1)[0].name
}

Objects.prototype.get = function (category, last) {
  if (!(category in this.container)) {
    // return {type:null, name:null};
    logger.traceback()
    throw new Error(category + ' is not available.')
  }
  if (last) {
    return this.container[category].slice(-1)[0]
  }
  return random.pick(this.container[category])
}

Objects.prototype.pick = function (category, last) {
  try {
    return this.get(category, last).name
  } catch (e) {
    logger.traceback()
    throw logger.JSError('Error: pick(\'' + category + '\') is undefined.')
  }
}

Objects.prototype.pop = function (objectName) {
  let self = this
  utils.common.getKeysFromHash(this.container).forEach(function (category) {
    self.container[category].forEach(function (obj) {
      if (obj.name === objectName) {
        self.container[category].splice(self.container[category].indexOf(obj), 1)
      }
    })
  })
}

Objects.prototype.contains = function (categoryNames) {
  let categories = []
  let self = this
  categoryNames.forEach(function (name) {
    if (self.has(name)) {
      categories.push(name)
    }
  })
  return (categories.length === 0) ? null : categories
}

Objects.prototype.show = function (category) {
  return (category in this.container) ? this.container[category] : this.container
}

Objects.prototype.count = function (category) {
  return (category in this.container) ? this.container[category].length : 0
}

Objects.prototype.has = function (category) {
  if (category in this.container) {
    this.check(category)
    return this.container[category].length > 0
  }
  return false
}

Objects.prototype.valid = function () {
  let items = []
  let self = this
  utils.common.getKeysFromHash(self.container).forEach(function (category) {
    self.check(category)
  })
  utils.common.getKeysFromHash(self.container).forEach(function (category) {
    for (let i = 0; i < self.container[category].length; i++) {
      items.push(self.container[category][i].name)
    }
  })
  return items
}

Objects.prototype.check = function (category) {
  let self = this
  self.container[category].forEach(function (object) {
    try {
      let x = /* frame.contentWindow. */ eval(object.name) // eslint-disable-line no-eval
      if (x === undefined || x === null) {
        self.pop(object.name)
      }
    } catch (e) {
      self.pop(object.name)
    }
  })
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.block = {
  block: function (list, optional) {
    if (optional === true) {
      if (random.chance(6)) {
        return ''
      }
    }

    function deeper (item) {
      if (item === null || item === undefined) {
        return ''
      }
      if (typeof (item) === 'function') {
        return item()
      }
      if (typeof (item) === 'string') {
        return item
      }
      if (Array.isArray(item)) {
        let s = ''
        for (let i = 0; i < item.length; i++) {
          s += deeper(item[i])
        }
        return s
      }
      return item
    }

    let asString = ''
    for (let i = 0; i < list.length; i++) {
      asString += deeper(list[i])
    }

    return asString
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.common = {
  objToString: function (obj) {
    try {
      return '' + obj
    } catch (e) {
      return '[' + e + ']'
    }
  },
  getAllProperties: function (obj) {
    let list = []
    while (obj) {
      list = list.concat(Object.getOwnPropertyNames(obj))
      obj = Object.getPrototypeOf(obj)
    }
    return list
  },
  getKeysFromHash: function (obj) {
    let list = []
    for (let p in obj) {
      list.push(p)
    }
    return list
  },
  quote: function (s) {
    // Taken from DOMfuzz
    function escapeString (s) {
      return ('\"' + // eslint-disable-line no-useless-escape
      s.replace(/\\/g, '\\\\')
      .replace(/\"/g, '\\\"') // eslint-disable-line no-useless-escape
      .replace(/\0/g, '\\0')
      .replace(/\n/g, '\\n') +
      '\"') // eslint-disable-line no-useless-escape
    }

    if (typeof s === 'string') {
      if (/^[\n\x20-\x7f]*$/.exec(s) || !self.uneval) { // eslint-disable-line no-undef
        // Printable ASCII characters and line breaks: try to make it pretty.
        return escapeString(s)
      } else {
        // Non-ASCII: use uneval to get \u escapes.
        return uneval(s) // eslint-disable-line no-undef
      }
    } else {
      // For other things (such as numbers, |null|, and |undefined|), just coerce to string.
      return JSON.stringify(s)
    }
  },
  b64encode: function (str) {
    // Unicode safe b64 encoding
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes (match, p1) {
        // noinspection JSCheckFunctionSignatures
        return String.fromCharCode('0x' + p1)
      }))
  },
  b64decode: function (str) {
    // Unicode safe b64 decoding
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  },
  uniqueList: function (list) {
    let tmp = {}
    let r = []
    for (let i = 0; i < list.length; i++) {
      tmp[list[i]] = list[i]
    }
    for (let i in tmp) {
      r.push(tmp[i])
    }
    return r
  },
  mergeHash: function (obj1, obj2) {
    for (let p in obj2) {
      try {
        if (obj2[p].constructor === Object) {
          obj1[p] = utils.common.mergeHash(obj1[p], obj2[p])
        } else {
          obj1[p] = obj2[p]
        }
      } catch (e) {
        obj1[p] = obj2[p]
      }
    }
    return obj1
  },
  mockup: (obj) => obj.split('\n').map((ln) => ln.trim()).join('')
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.mutate = {
  text: function (str) {
    let mutator = function (m) {
      return random.chance(4) ? m : make.text.any()
    }
    return str.replace(/[a-zA-Z]+?/g, mutator)
  },

  numbers: function (str) {
    let mutator = function (m) {
      return random.chance(4) ? m : make.number.any()
    }
    return str.replace(/-?\d+(\.\d+)?/g, mutator)
  },

  units: function (str) {
    let mutator = function (m, p1) {
      if (random.chance(4)) {
        return m
      } else {
        return p1 + make.unit.unit()
      }
    }
    return str.replace(/(\d+)(px|em|ex|ch|rem|mm|cm|in|pt|pc|%')/g, mutator)
  },

  random: function (str) {
    let mutator = function (m) {
      if (random.chance(20)) {
        if (str.match(/[0-9]/g)) {
          return make.number.any()
        } else {
          return make.text.any()
        }
      } else {
        return m
      }
    }
    return str.replace(/./g, mutator)
  },

  any: function (str) {
    switch (random.number(4)) {
      case 0:
        return utils.mutate.text(str)
      case 1:
        return utils.mutate.numbers(str)
      case 2:
        return utils.mutate.units(str)
      case 3:
        return utils.mutate.random(str)
    }
  }
}


make.html = {
  tag: function () {
    return random.item(['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'foo', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'])
  },
  attribute: function () { // eslint-disable-line no-unused-vars
    return random.item(['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'bgcolor', 'border', 'buffered', 'challenge', 'charset', 'checked', 'cite', 'class', 'code', 'codebase', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'crossorigin', 'data', 'data-*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'integrity', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'manifest', 'max', 'maxlength', 'minlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'seamless', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'summary', 'tabindex', 'target', 'title', 'type', 'usemap', 'value', 'width'])
  },
  interfaceName: function () { // eslint-disable-line no-unused-vars
    return random.pick(['HTMLBRElement', 'HTMLTableSectionElement', 'HTMLDataListElement', 'HTMLTableElement', 'HTMLOListElement', 'HTMLFontElement', 'HTMLMapElement', 'HTMLButtonElement', 'HTMLFrameSetElement', 'HTMLDataElement', 'HTMLOptGroupElement', 'HTMLAnchorElement', 'HTMLLinkElement', 'HTMLObjectElement', 'HTMLHeadElement', 'HTMLProgressElement', 'HTMLFrameElement', 'HTMLTimeElement', 'HTMLTableCaptionElement', 'HTMLDivElement', 'HTMLDListElement', 'HTMLBodyElement', 'HTMLImageElement', 'HTMLTableRowElement', 'HTMLScriptElement', 'HTMLInputElement', 'HTMLMeterElement', 'HTMLFieldSetElement', 'HTMLHtmlElement', 'HTMLStyleElement', 'HTMLDetailsElement', 'HTMLTrackElement', 'HTMLBaseElement', 'HTMLTableColElement', 'HTMLSourceElement', 'HTMLPictureElement', 'HTMLSelectElement', 'HTMLLegendElement', 'HTMLHRElement', 'HTMLModElement', 'HTMLTemplateElement', 'HTMLAreaElement', 'HTMLFormElement', 'HTMLEmbedElement', 'HTMLSpanElement', 'HTMLParagraphElement', 'HTMLIFrameElement', 'HTMLTableCellElement', 'HTMLElement', 'HTMLMenuElement', 'HTMLTextAreaElement', 'HTMLHeadingElement', 'HTMLCanvasElement', 'HTMLOutputElement', 'HTMLQuoteElement', 'HTMLOptionElement', 'HTMLLIElement', 'HTMLAudioElement', 'HTMLMenuItemElement', 'HTMLParamElement', 'HTMLUListElement', 'HTMLLabelElement', 'HTMLDirectoryElement', 'HTMLTitleElement', 'HTMLPreElement', 'HTMLMetaElement', 'HTMLVideoElement'])
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.types = {
  random: function () {
    return random.item([
      'true',
      'null',
      '(new Object())',
      'undefined',
      '{}',
      '[]',
      '\'\'',
      'function() {}'
    ])
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.number = {
  bool: function () {
    return random.bool()
  },
  float: function () {
    let n
    if (random.chance(32)) {
      switch (random.number(4)) {
        case 0:
          n = random.range(Number.MIN_VALUE, Number.MAX_VALUE)
          break
        case 1:
          n = Math.pow(10, 1) / Math.pow(10, random.number(307))
          break
        case 2:
          n = Math.pow(2, random.float() * random.float() * 64)
          break
        case 3:
          n = Math.pow(10, random.range(1, 9)) / Math.pow(10, random.range(1, 9))
          break
      }
      return n
    }
    switch (random.number(6)) {
      default:
        n = random.float()
    }
    return n
  },
  range: function () {
    return random.pick([1, 2, 3, 4, 6, 8, 16, 32, 64, make.number.tiny])
  },
  frange: function (min, max, precision) {
    let x = Math.random() * (min - max) + max
    if (precision) {
      let power = Math.pow(10, precision || 0)
      x = Math.round(x * power) / power
    }
    return x
  },
  tiny: function () {
    return Math.pow(2, random.number(12))
  },
  unsigned: function () {
    if (random.chance(2)) {
      return Math.abs(make.number.any())
    }
    return Math.pow(2, random.number(random.number(65))) + random.number(3) - 1
  },
  even: function (number) {
    return number % 2 === 1 ? ++number : number
  },
  any: function () {
    let value = random.choose([
      [10, make.number.float],
      [10, [make.number.range, make.number.tiny]],
      [1, make.number.unsigned]
    ])
    return random.chance(10) ? -value : value
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.typed = {
  byte: function (limit = null) {
    // [-128, 127]
    let value = (limit !== null) ? random.number(limit) : random.number(129)
    value = random.chance(10) ? -value : value
    return 'new Uint8Array([' + value + '])[0]'
  },
  octet: function (limit = null) {
    // [0, 255]
    let value = (limit !== null) ? random.number(limit) : random.number(256)
    return 'new Int8Array([' + value + '])[0]'
  },
  short: function (limit = null) {
    // [-32768, 32767]
    let value = (limit !== null) ? random.number(limit) : random.number(32769)
    value = random.chance(10) ? -value : value
    return 'new Int16Array([' + value + '])[0]'
  },
  unsignedShort: function (limit = null) {
    // [0, 65535]
    let value = (limit !== null) ? random.number(limit) : random.number(65535)
    return 'new Uint16Array([' + value + '])[0]'
  },
  long: function (limit = null) {
    // [-2147483648, 2147483647]
    let value = (limit !== null) ? random.number(limit) : random.number(2147483649)
    value = random.chance(10) ? -value : value
    return 'new Int32Array([' + value + '])[0]'
  },
  unsignedLong: function (limit = null) {
    // [0, 4294967295]
    let value = (limit !== null) ? random.number(limit) : random.number(4294967296)
    return 'new Uint32Array([' + value + '])[0]'
  },
  // ToDo: Add support for longlong and ulonglong
  /*
   longLong: function () {},
   unsignedLongLong: function () {},
   */
  float: function (limit = null) {
    let base = (limit !== null) ? random.number(limit) : random.number()
    let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
    return 'new Float32Array([' + value + '])[0]'
  },
  unrestrictedFloat: function (limit = null) {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      let base = (limit !== null) ? random.number(limit) : random.number()
      return 'new Float32Array([' + (base + random.float()) + '])[0]'
    }
  },
  double: function (limit = null) {
    let base = (limit !== null) ? random.number(limit) : random.number()
    let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
    return 'new Float64Array([' + value + '])[0]'
  },
  unrestrictedDouble: function (limit = null) {
    if (random.chance(100)) {
      return random.pick([NaN, +Infinity, -Infinity])
    } else {
      let base = (limit !== null) ? random.number(limit) : random.number()
      let value = random.chance(10) ? -(base + random.float()) : (base + random.float())
      return 'new Float64Array([' + value + '])[0]'
    }
  },
  any: function () {
    return random.choose([
      [1, [this.byte, this.octet]],
      [1, [this.short, this.unsignedShort]],
      [1, [this.long, this.unsignedLong]],
      [1, [this.float, this.unrestrictedFloat]],
      [1, [this.double, this.unrestrictedDouble]],
      [1, [make.number.range, make.number.tiny]]
    ])
  },
  arrayBuffer: function (byteLength = null) {
    let length = (byteLength !== null) ? byteLength : this.unsignedShort()
    return 'new ArrayBuffer(' + length + ')'
  },
  dataView: function (byteLength = null) {
    let length = (byteLength !== null) ? byteLength : this.unsignedShort()
    return 'new DataView(' + this.arrayBuffer(length) + ')'
  },
  typedArray: function (byteLength = null) {
    let length = (byteLength !== null) ? byteLength : this.unsignedShort()
    let arrType = random.item([
      'Int8', 'Uint8', 'Uint8Clamped',
      'Int16', 'Uint16',
      'Int32', 'Uint32',
      'Float32', 'Float64'
    ])
    let method = 'new ' + arrType + 'Array'
    switch (random.number(16)) {
      case 0:
        return method + '()'
      case 1:
        return method + '(' + this.typedArray() + ')'
      default:
        return method + '(' + length + ')'
    }
  },
  bufferSource: function () {
    switch (random.number(4)) {
      case 0:
        return this.arrayBuffer()
      case 1:
        return this.dataView()
      default:
        return this.typedArray()
    }
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.mime = {
  any: function () {
    return random.pick([
      make.mime.standard,
      make.mime.xml,
      make.mime.image,
      make.mime.media,
      make.mime.form
    ])
  },

  standard: function () {
    return random.pick([
      'text/html',
      'text/html; charset=utf-8',
      'text/plain',
      'text/css',
      'text/javascript',
      'foo/bar',
      'application/octet-stream',
      'application/x-shockwave-flash',
      'application/x-test'
    ])
  },

  xml: function () {
    return random.pick([
      'application/xml',
      'text/xml',
      'application/xhtml+xml',
      'image/svg+xml',
      'application/vnd.mozilla.xul+xml',
      'application/rss+xml',
      'application/rdf+xml',
      'application/xslt+xml'
    ])
  },

  image: function () {
    return random.pick([
      'image/jpeg',
      'image/gif',
      'image/png',
      'image/mng',
      'image/*'
    ])
  },

  media: function () {
    return random.pick([
      'audio/mpeg',
      'audio/ogg',
      'audio/ogg; codecs=vorbis',
      'video/ogg',
      'video/ogg; codecs="theora, vorbis"',
      'video/mp4',
      'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    ])
  },

  form: function () {
    return random.pick([
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ])
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.files = {
  image: function () {
    return random.pick([
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=',
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=',
      'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
    ])
  },
  video: function () {
    return random.pick([
      'data:video/webm;base64,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',
      'data:video/ogg;base64,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qiCkUlIpFYRUSiolo5RSailVEFIpqZQKQiollVIAANiBAwDYgYVQaMhKACAPAIAwRinGGHNOIqQUY845JxFSijHnnJNKMeacc85JKRlzzDnnpJTOOeecc1JK5pxzzjkppXPOOeeclFJK55xzTkopJYTOQSellNI555wTAABU4AAAEGCjyOYEI0GFhqwEAFIBAAyOY1ma5nmiaJqWJGma53meKJqmJkma5nmeJ4qqyfM8TxRF0TRVled5niiKommqKtcVRdM0TVVVXbIsiqZpmqrqujBN01RV13VdmKZpqqrrui5sW1VV1XVlGbatqqrqurIMXNd1ZdmWgSy7ruzasgAA8AQHAKACG1ZHOCkaCyw0ZCUAkAEAQBiDkEIIIWUQQgohhJRSCAkAABhwAAAIMKEMFBqyEgBIBQAAjLHWWmuttdZAZ6211lprrYDMWmuttdZaa6211lprrbXWUmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaay2llFJKKaWUUkoppZRSSimllFJKBQD6VTgA+D/YsDrCSdFYYKEhKwGAcAAAwBilGHMMQimlVAgx5px0VFqLsUKIMeckpNRabMVzzkEoIZXWYiyecw5CKSnFVmNRKYRSUkottliLSqGjklJKrdVYjDGppNZai63GYoxJKbTUWosxFiNsTam12GqrsRhjayottBhjjMUIX2RsLabaag3GCCNbLC3VWmswxhjdW4ultpqLMT742lIsMdZcAAB3gwMARIKNM6wknRWOBhcashIACAkAIBBSijHGGHPOOeekUow55pxzDkIIoVSKMcaccw5CCCGUjDHmnHMQQgghhFJKxpxzEEIIIYSQUuqccxBCCCGEEEopnXMOQgghhBBCKaWDEEIIIYQQSiilpBRCCCGEEEIIqaSUQgghhFJCKCGVlFIIIYQQQiklpJRSCiGEUkIIoYSUUkophRBCCKWUklJKKaUSSgklhBJSKSmlFEoIIZRSSkoppVRKCaGEEkopJaWUUkohhBBKKQUAABw4AAAEGEEnGVUWYaMJFx6AQkNWAgBkAACQopRSKS1FgiKlGKQYS0YVc1BaiqhyDFLNqVLOIOYklogxhJSTVDLmFEIMQuocdUwpBi2VGELGGKTYckuhcw4AAABBAICAkAAAAwQFMwDA4ADhcxB0AgRHGwCAIERmiETDQnB4UAkQEVMBQGKCQi4AVFhcpF1cQJcBLujirgMhBCEIQSwOoIAEHJxwwxNveMINTtApKnUgAAAAAAAMAPAAAJBcABER0cxhZGhscHR4fICEiIyQCAAAAAAAFwB8AAAkJUBERDRzGBkaGxwdHh8gISIjJAEAgAACAAAAACCAAAQEBAAAAAAAAgAAAAQET2dnUwAAQAAAAAAAAAAjaKehAgAAAEhTii0BRjLV6A+997733vvfe+997733vvfG+8fePvH3j7x94+8fePvH3j7x94+8fePvH3j7x94+8fePvH3gAAAAAAAAAAXm5PqUgABPZ2dTAABLAAAAAAAAACNop6EDAAAAIOuvQAsAAAAAAAAAAAAAAE9nZ1MAAEADAAAAAAAAI2inoQQAAAB/G0m4ATg/8A+997733vvfe+997733vvfK+8B94D7wAB94AAAAD8Kl94D7wH3gAD7wAAAAH4VABem0+pSAAE9nZ1MAAEsDAAAAAAAAI2inoQUAAABc3zKaCwAAAAAAAAAAAAAAT2dnUwAEQAYAAAAAAAAjaKehBgAAAOytEQUBOD/wD733vvfe+997733vvfe+98r7wH3gPvAAH3gAAAAPwqX3gPvAfeAAPvAAAAAfhUAF6bT6lIAAT2dnUwAAQL4AAAAAAACWSy/CAgAAAHsqKaIxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAKDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg5PZ2dTAAQAxAAAAAAAAJZLL8IDAAAABLWpWwIBAQ4O=',
      'data:video/mp4;base64,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'
    ])
  },
  audio: function () {
    return random.pick([
      'data:audio/wav;base64,UklGRkYCAABXQVZFZm10IBIAAAABAAEA6AMAANAHAAACABAAAABMSVNUAgAAAElORk9JU0ZUDAAAAExhdmY1NC4yMC40AGRhdGEAAgAA2/ct9q79DwTC/oD64wKYBZ/6dPz1/z78OgKSBC4DQP7J/WwCNgG/Ac0A8v11/6kFgwRU+1oAGf3q+MP+1vnI+usAfQIY/yIBNwPt+af5lDgiA+0AgQYbCAMBQQWzA1L/iv92AfkBeAGI/7n/r/+FBGcE+vwvAOIBLgDmCIkF/PYO+8kFp/9z/pMAWfvLA3gBj/rHAdcAIf3h/xcEzAVG+17/yQMR/ekCzf8A/yUE1QMbAEL/OAKB/5L9u/lD+e7/+ABQ+Zn3pwL3AX78gP8DANH/rAGXAev/GQF1AJf+EAE2AQL+Mv/1Ab8ACwAuALT+zf8QAUP/k/3x/7QAYP/3/1gATQDKAPL/Iv9WAOYA3v9RAFQB6f/k/2AARAB6AKsAif+p/+oARwBY/7//DADp/zYAvv92/0gANgBL/6T/+//Y/wIACQCI//D/YQDr/wgAEgDH/3z/2P9XANP/NQAeAKr/7v/p/8H/xv/9//v/4P//////uv8CAA0ALwBSACQA8f8cAAEA4P8bADcAJgDv/9f/8/9CACMA7f/+/xYAu//G/ycAHAAHAM//q//1//n/4//m/8T/wf+j/8L/4//B/7X/1f/V/9P/7f/j/wUA/P/2/yEAOgAkAC8AMgArADUAHABBAFYAXgBYAEcARwA2ADgANgAhAP3/7//7/8z/5/8bAA==',
      'data:audio/ogg;base64,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',
      'data:audio/mpeg;base64,Z2FyYmFnZQr/+1DEAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAsAAAnKABcXFxcXFxcXFy4uLi4uLi4uLkVFRUVFRUVFRV1dXV1dXV1dXXR0dHR0dHR0dIuLi4uLi4uLi6KioqKioqKiorq6urq6urq6utHR0dHR0dHR0ejo6Ojo6Ojo6P///////////wAAADlMQU1FMy45OHIBpQAAAAAuHQAAFEAkBElCAABAAAAJyuGI2MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAABmQjXHSRAAH6IfB3OVIDAADLlmjIxWKxWTyIABgmGydGjRox4f8Tg+D4OAgc/BwEDn+UBD+qwH/+8Tny7///KO4IYDgcDgcDgcDgcCgQAAAKKBUFc/nnP30a5O0zyYzMNMkzKlPva2GXgMIBbwDQEAYDQNXGLT2EIgEhoFnQNDb4BAPD9wTFYGJBWJw/8AUWgMBQgIEg4KmAKGP/wRG0csCIWDaQxcFhYvv/8WYMUpEIkXhvnRef//kmsuLPH5OvSoAFKxrJIm26DP/7UsQEgAuBCYu8tQAxeSiuPNKO5Z3/4Vs8526Brv0OF5/Q4Vg2Gn4UQ8M9HJG84QRGX9TBu/0X9S5A3nK31Y8znHCqUHj6HOZ+ahiZxx5Y8PyzdYDwWFg='
    ])
  },
  webvtt: function () {
    return random.pick([
      // 'data:text/vtt,' + encodeURIComponent('WEBVTT\n\n00:00:00.000 --> 00:00:00.001\ntest');,
      'media/video/sample.vtt'
      // Todo: load from filesystem randomly: 'media/videos/*.{vtt}'
    ])
  },
  any: function () {
    return random.pick([
      make.files.image,
      make.files.video,
      make.files.audio
    ])
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.arrays = {
  filledArray: function (fn, limit) {
    let array = []
    let size = limit || random.number(make.number.tiny()) + 1

    for (let i = 0; i < size; i++) {
      let value = random.pick(fn)
      if (value !== undefined) {
        array.push(value)
      }
    }

    return array
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.time = {
  unit: function () {
    return random.pick([
      's', 'ms'
    ])
  },
  any: function () {
    return make.number.any() + make.time.unit()
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.unit = {
  unit: function () {
    return random.pick([
      'px', 'em', 'ex', 'ch', 'rem', 'mm', 'cm', 'in', 'pt', 'pc', '%'
    ])
  },
  length: function () {
    return make.number.any() + make.unit.unit()
  },
  percent: function () {
    return make.number.any() + '%'
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.command = {
  _data: {
    'backcolor': function () { return make.colors.any() },
    'bold': null,
    'contentReadOnly': function () { return random.bool() },
    'copy': null,
    'createlink': function () { return make.uri.any() },
    'cut': null,
    'decreasefontsize': null,
    'delete': null,
    'enableInlineTableEditing': function () { return random.bool() },
    'enableObjectResizing': function () { return random.bool() },
    'fontname': function () { return make.font.family() },
    'fontsize': function () { return make.font.relativeSize() },
    'formatblock': ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'pre', 'address', 'blockquote', 'dl', 'div'],
    'forwarddelete': null,
    'forecolor': function () { return make.colors.any() },
    'gethtml': null,
    'heading': null,
    'hilitecolor': function () { return make.colors.any() },
    'increasefontsize': null,
    'indent': null,
    'insertBrOnReturn': function () { return random.bool() },
    'inserthorizontalrule': null,
    // 'inserthtml': function () { },
    'insertlinebreak': null,
    'insertimage': function () { return make.uri.any() },
    'insertorderedlist': null,
    'insertparagraph': null,
    'inserttext': function () { return make.text.any() },
    'insertunorderedlist': null,
    'italic': null,
    'justifycenter': null,
    'justifyfull': null,
    'justifyleft': null,
    'justifyright': null,
    'outdent': null,
    'paste': null,
    'redo': null,
    'removeformat': null,
    'selectall': null,
    'strikethrough': null,
    'styleWithCSS': function () { return random.bool() },
    'subscript': null,
    'superscript': null,
    'underline': null,
    'undo': null,
    'unlink': null
  },
  name: function () {
    return random.item(Object.keys(this._data))
  },
  value: function (name) {
    return random.pick(this._data[name])
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.font = {
  globalValue: function () {
    return random.pick(['inherit', 'initial', 'unset'])
  },
  style: function () {
    return random.pick(['italic', 'normal', 'oblique', 'inherit'])
  },
  variant: function () {
    return random.pick(['normal', 'small-caps', 'inherit'])
  },
  weight: function () {
    return random.pick([
      /* standard */
      ['normal', 'bold'],
      /* Relative to the parent */
      ['bolder', 'lighter'],
      /* numeric values */
      [100, 200, 300, 400, 500, 600, 700, 800, 900]
    ])
  },
  size: function () {
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
  },
  relativeSize: function () {
    let value = random.number(8)
    return random.item(['', '+', '-']) + value
  },
  genericFamily: function () {
    return random.pick(['serif', 'sans-serif', 'cursive', 'fantasy', 'monospace'])
  },
  familyName: function () {
    return random.pick(['Times New Roman', 'Arial', 'Courier', 'Helvetica'])
  },
  family: function () {
    let s = random.pick(make.font.familyName)
    if (random.chance(8)) {
      s += ', ' + random.pick(make.font.genericFamily)
    }
    return s
  },
  registeredFontFeatures: function () {
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
  },
  font: function () {
    let s = ''
    if (random.chance(4)) {
      s += random.pick(make.font.style) + ' '
    }
    if (random.chance(4)) {
      s += random.pick(make.font.variant) + ' '
    }
    if (random.chance(4)) {
      s += random.pick(make.font.weight) + ' '
    }
    if (random.chance(4)) {
      s += make.number.any() + '/'
    }
    s += make.font.size()
    s += ' '
    s += make.font.family()
    return s
  }
}


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


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.colors = {
  any: function () {
    return random.pick([
      make.colors.rgb,
      make.colors.hsl,
      make.colors.keyword
    ])
  },

  rgb: function () {
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
  },

  hsl: function () {
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
  },

  keyword: function () {
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


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.shaders = {
  fragment1: [
    [
      '#ifdef GL_ES',
      'precision mediump float;',
      '#endif',
      'varying vec4 vColor;',
      'void main() {',
      'gl_FragColor=vColor;',
      '}'
    ],
    [
      'varying highp vec2 vTextureCoord;',
      'varying highp vec3 vLighting;',
      'uniform sampler2D uSampler;',
      'void main(void) {',
      'highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
      'gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);',
      '}'
    ]
  ],
  vertex1: [
    [
      'attribute vec4 aVertex;',
      'attribute vec4 aColor;',
      'varying vec4 vColor;',
      'void main(){',
      'vColor=aColor;',
      'gl_Position=aVertex;',
      '}'
    ],
    [
      'attribute highp vec3 aVertexNormal;',
      'attribute highp vec3 aVertexPosition;',
      'attribute highp vec2 aTextureCoord;',
      'uniform highp mat4 uNormalMatrix;',
      'uniform highp mat4 uMVMatrix;',
      'uniform highp mat4 uPMatrix;',
      'varying highp vec2 vTextureCoord;',
      'varying highp vec3 vLighting;',
      'void main(void) {',
      'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
      'vTextureCoord = aTextureCoord;',
      'highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);',
      'highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);',
      'highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);',
      'highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);',
      'highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);',
      'vLighting = ambientLight + (directionalLightColor * directional);',
      '}'
    ]
  ],
  fragment2: [
    [
      'varying highp vec2 vTextureCoord;',
      'varying highp vec3 vLighting;',
      'uniform sampler2D uSampler;',
      'void main(void) {',
      'highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
      'gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);',
      '}'
    ],
    [
      '#version proto-200',
      'uniform sampler2D albedoMap;',
      'uniform sampler2D normalMap;',
      'varying vec3 varyingTangent;',
      'varying vec3 varyingBitangent;',
      'varying vec3 varyingNormal;',
      'varying vec2 varyingUV;',
      'void main(void) {',
      'vec3 albedo=texture2D(albedoMap,varyingUV).rgb;',
      'vec3 normal=texture2D(normalMap,varyingUV).rgb*2.0-1.0;',
      'float specularFactor=pow((albedo.r+albedo.g+albedo.b)*0.33,2.0);',
      'float specularHardness=2.0;',
      'vec3 spaceNormal=varyingTangent*normal.x+varyingBitangent*normal.y+varyingNormal*normal.z;',
      'gl_FragData[0]=vec4(albedo,1.0);',
      'gl_FragData[1]=vec4(spaceNormal*0.5 +0.5,1.0);',
      'gl_FragData[2]=vec4(specularFactor,specularHardness*0.1,0.0,1.0);',
      '}'
    ]
  ],
  vertex2: [
    [
      'attribute highp vec3 aVertexNormal;',
      'attribute highp vec3 aVertexPosition;',
      'attribute highp vec2 aTextureCoord;',
      'uniform highp mat4 uNormalMatrix;',
      'uniform highp mat4 uMVMatrix;',
      'uniform highp mat4 uPMatrix;',
      'varying highp vec2 vTextureCoord;',
      'varying highp vec3 vLighting;',
      'void main(void) {',
      'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
      'vTextureCoord = aTextureCoord;',
      'highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);',
      'highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);',
      'highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);',
      'highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);',
      'highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);',
      'vLighting = ambientLight + (directionalLightColor * directional);',
      '}'
    ],
    [
      '#version proto-200',
      'attribute vec3 vertexPosition;',
      'attribute vec3 vertexTangent;',
      'attribute vec3 vertexBitangent;',
      'attribute vec3 vertexNormal;',
      'attribute vec2 vertexUV;',
      'uniform mat4 modelMatrix;',
      'uniform mat4 viewMatrix;',
      'varying vec3 varyingTangent;',
      'varying vec3 varyingBitangent;',
      'varying vec3 varyingNormal;',
      'varying vec2 varyingUV;',
      'void main(void){',
      'gl_Position=viewMatrix*(modelMatrix*vec4(vertexPosition,1.0));',
      'gl_Position.xy=gl_Position.xy*0.5+(float(gl_InstanceID)-0.5);',
      'varyingTangent=(modelMatrix*vec4(vertexTangent,0.0)).xyz;',
      'varyingBitangent=(modelMatrix*vec4(vertexBitangent,0.0)).xyz;',
      'varyingNormal=(modelMatrix*vec4(vertexNormal,0.0)).xyz;',
      'varyingUV = vertexUV;',
      '}'
    ]
  ],
  shaderPair: function (v, f) {
    let i = random.number(v.length)
    return {
      vertex: utils.common.quote(v[i].join('\n')),
      fragment: utils.common.quote(f[i].join('\n'))
    }
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.crypto = {
  keyFormats: [
    'raw',
    'spki',
    'pkcs8',
    'jwk'
  ],
  randomKeyFormat: () => random.item(make.crypto.keyFormats),
  keyTypes: [
    'public',
    'private',
    'secret'
  ],
  randomKeyType: () => random.item(make.crypto.keyTypes),
  keyUsages: [
    'encrypt',
    'decrypt',
    'sign',
    'verify',
    'deriveKey',
    'deriveBits',
    'wrapKey',
    'unwrapKey'
  ],
  randomKeyUsage: () => random.subset(make.crypto.keyUsages),
  curves: [
    'P-256',
    'P-384',
    'P-521'
  ],
  randomCurve: () => random.item(make.crypto.curves),
  jwkUsages: [
    'enc',
    'sig'
  ],
  randomJwkUsage: () => random.subset(make.crypto.jwkUsages),
  jwkKeyTypes: [
    'oct',
    'RSA',
    'EC'
  ],
  randomJwkKeyType: () => random.subset(make.crypto.jwkKeyTypes),
  algorithmNames: {
    // https://www.w3.org/TR/WebCryptoAPI/#algorithm-overview
    sign: [
      'RSASSA-PKCS1-v1_5',
      'RSA-PSS',
      'ECDSA',
      'HMAC'
    ],
    verify: [
      'RSASSA-PKCS1-v1_5',
      'RSA-PSS',
      'ECDSA',
      'HMAC'
    ],
    generateKey: [
      'RSASSA-PKCS1-v1_5',
      'RSA-PSS',
      'RSA-OAEP',
      'ECDSA',
      'ECDH',
      'AES-CTR',
      'AES-CBC',
      'AES-GCM',
      'AES-KW',
      'HMAC'
    ],
    importKey: [
      'RSASSA-PKCS1-v1_5',
      'RSA-PSS',
      'RSA-OAEP',
      'ECDSA',
      'ECDH',
      'AES-CTR',
      'AES-CBC',
      'AES-GCM',
      'AES-KW',
      'HMAC',
      'HKDF',
      'PBKDF2'
    ],
    exportKey: [
      'RSASSA-PKCS1-v1_5',
      'RSA-PSS',
      'RSA-OAEP',
      'ECDSA',
      'ECDH',
      'AES-CTR',
      'AES-CBC',
      'AES-GCM',
      'AES-KW',
      'HMAC'
    ],
    encrypt: [
      'RSA-OAEP',
      'AES-CTR',
      'AES-CBC',
      'AES-GCM'
    ],
    decrypt: [
      'RSA-OAEP',
      'AES-CTR',
      'AES-CBC',
      'AES-GCM'
    ],
    deriveBits: [
      'ECDH',
      'HKDF',
      'PBKDF2'
    ],
    deriveKey: [
      'ECDH',
      'HKDF',
      'PBKDF2'
    ],
    wrapKey: [
      'RSA-OAEP',
      'AES-CTR',
      'AES-CBC',
      'AES-GCM',
      'AES-KW'
    ],
    unwrapKey: [
      'RSA-OAEP',
      'AES-CTR',
      'AES-CBC',
      'AES-GCM',
      'AES-KW'
    ],
    digest: [
      'SHA-1',
      'SHA-256',
      'SHA-384',
      'SHA-512'
    ]
  },
  randomAlgorithmName: (method) => random.item(make.crypto.algorithmNames[method]),
  randomDigestName: () => random.item(make.crypto.algorithmNames.digest),
  algorithms: {
    /* (Unsupported as of 30/01/2017)
    -------------------------------
    |          | Firefox | Chrome |
    ----------------------------- |
    | AES-CMAC |   x    |    x    |
    | AES-CFB  |   x    |    x    |
    | CONCAT   |   x    |    x    |
    | HKDF-CTR |   x    |    x    |
    | DH       |        |    x    |
    -------------------------------
    */
    'RSASSA-PKCS1-v1_5': {
      // RSASA-PKCS1_v1_5 algorithm, using a SHA hash function.
      keyUsages: ['sign', 'verify'],
      length: function (len) {
        return len || random.item([1, 256, 384, 512])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'RSASSA-PKCS1-v1_5',
          hash: {
            name: 'SHA-${this.length(len)}'
          },
          modulusLength: ${random.item([1024, 2048, 4096])},
          publicExponent: new Uint8Array([0x01, 0x00, 0x01])
        }`)
      },
      jwk: function (len) {
        return utils.common.mockup(`{
          kty: 'RSA',
          alg: 'RS${this.length(len)}'
        }`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      sign: function () {
        return this.alg()
      },
      verify: function () {
        return this.alg()
      },
      presets: {
        raw: {},
        jwk: [
          {
            kty: 'RSA',
            e: 'AQAB',
            n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
            alg: 'RS256',
            ext: true
          },
          {
            kty: 'RSA',
            e: 'AQAB',
            d: 'n_dIVw9MD_04lANi5KnKJPoRfxKy7cGHYLG0hU5DGpsFNfx2yH0Uz9j8uU7ZARai1iHECBxcxhpi3wbckQtjmbkCUKvs4G0gKLT9UuNHcCbh0WfvadfPPec52n4z6s4zwisbgWCNbT2L-SyHt1yuFmLAYXkg0swk3y5Bt_ilA8E',
            dp: '2RNM_uiYEQMcATQaUu3AwdeJpenCPykbQHkwAylvXqlHB6W7m5XX0k-SutkbXAijmGTC-Oh8NexsLGHxOACb8Q',
            dq: 'rHabkI3_XVGieLqHujpWaWe9YD03fJY0KbbQX0fIoNdNU4GcmUftzIWLSajPKKsiyfR6Xk2AEtBmBPE5qaoV6Q',
            n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
            p: '5Y4ynodegqC9kgGmfZeSrojGmLyYR8HIvKVEAIjjMUQjyvKWpWsXfPg67mTdqVpjSpQLQlRfES2nUvZ27KrU6Q',
            q: '0hd_U9PcNpMe77nhsTgoVNgMB34cqfrfu4fPuJ-7NvvMkKIELDLy-m8qg1MBbgf2i5546A9B5Exsuj4D2Vwz2Q',
            qi: 'R3CkCGVAESy_hChmDvUaLMT-R1xk6kK7RLIUQKXATPQbnDqWBMgm-vcawFVhKJ-ICJsPfmRUsv7Wt1bJ01wLGQ',
            alg: 'RS256',
            ext: true
          }
        ],
        spki: 'new Uint8Array([48, 129, 159, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 129, 141, 0, 48, 129, 137, 2, 129, 129, 0, 182, 93, 35, 213, 252, 204, 20, 103, 91, 238, 105, 199, 53, 114, 24, 221, 114, 210, 137, 173, 88, 76, 205, 113, 148, 148, 79, 80, 59, 208, 60, 75, 231, 248, 78, 125, 12, 30, 237, 226, 63, 146, 157, 203, 239, 60, 138, 123, 234, 50, 23, 174, 216, 33, 122, 16, 53, 246, 140, 254, 75, 246, 205, 204, 117, 204, 115, 29, 178, 102, 139, 201, 74, 177, 45, 131, 183, 166, 234, 61, 124, 75, 110, 3, 70, 202, 148, 95, 45, 228, 94, 95, 148, 2, 162, 79, 146, 137, 29, 189, 102, 75, 207, 214, 116, 58, 63, 171, 219, 27, 5, 9, 108, 16, 218, 23, 169, 43, 181, 119, 31, 172, 95, 205, 180, 18, 255, 203, 2, 3, 1, 0, 1])',
        pkcs8: 'new Uint8Array([48, 130, 2, 118, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 2, 96, 48, 130, 2, 92, 2, 1, 0, 2, 129, 129, 0, 217, 78, 147, 218, 221, 152, 10, 66, 75, 127, 242, 108, 182, 142, 157, 44, 93, 58, 176, 193, 135, 103, 216, 179, 69, 72, 38, 115, 144, 244, 12, 139, 0, 245, 48, 115, 204, 234, 158, 193, 231, 127, 178, 240, 244, 203, 35, 229, 203, 245, 110, 215, 199, 19, 98, 183, 164, 223, 159, 203, 128, 123, 173, 26, 12, 172, 250, 99, 254, 35, 225, 221, 39, 51, 62, 3, 139, 35, 38, 164, 71, 238, 240, 73, 139, 214, 68, 172, 204, 253, 171, 244, 14, 186, 152, 159, 225, 133, 229, 140, 99, 50, 183, 242, 217, 248, 86, 233, 20, 117, 42, 136, 55, 8, 65, 124, 244, 65, 29, 15, 194, 255, 78, 31, 189, 146, 105, 161, 2, 3, 1, 0, 1, 2, 129, 128, 26, 88, 13, 82, 166, 52, 141, 97, 214, 23, 79, 195, 96, 42, 79, 225, 149, 247, 204, 127, 217, 179, 124, 48, 215, 128, 84, 177, 3, 236, 162, 44, 163, 212, 21, 168, 164, 57, 249, 63, 22, 154, 131, 141, 244, 143, 63, 237, 214, 217, 13, 51, 249, 125, 95, 37, 86, 70, 137, 239, 184, 198, 197, 136, 62, 183, 41, 78, 118, 234, 57, 195, 161, 219, 173, 234, 61, 11, 165, 109, 209, 9, 3, 22, 186, 114, 32, 135, 147, 74, 6, 106, 190, 214, 36, 208, 32, 220, 61, 12, 41, 105, 251, 247, 18, 159, 3, 198, 28, 228, 36, 44, 189, 125, 45, 72, 233, 199, 12, 72, 91, 106, 165, 246, 217, 58, 168, 53, 2, 65, 0, 241, 112, 53, 166, 98, 11, 38, 73, 58, 156, 84, 190, 118, 74, 247, 229, 85, 178, 83, 231, 53, 137, 237, 228, 246, 12, 32, 206, 157, 198, 152, 70, 11, 185, 234, 30, 112, 23, 115, 249, 68, 176, 159, 108, 247, 249, 207, 152, 145, 166, 246, 79, 176, 219, 163, 111, 243, 4, 49, 3, 239, 242, 63, 147, 2, 65, 0, 230, 105, 200, 1, 208, 201, 237, 225, 85, 27, 39, 216, 193, 1, 253, 168, 88, 15, 242, 166, 70, 106, 235, 2, 92, 24, 130, 66, 176, 176, 220, 238, 66, 12, 159, 26, 24, 40, 19, 213, 138, 98, 238, 98, 220, 65, 148, 116, 146, 21, 0, 25, 6, 177, 57, 216, 70, 51, 149, 244, 157, 153, 106, 123, 2, 64, 127, 92, 254, 48, 67, 80, 54, 102, 50, 240, 253, 19, 108, 59, 168, 1, 230, 239, 39, 171, 180, 102, 138, 132, 89, 247, 147, 230, 234, 252, 52, 159, 222, 215, 184, 85, 78, 52, 81, 13, 145, 218, 202, 127, 37, 97, 54, 205, 249, 39, 230, 143, 171, 112, 114, 11, 64, 91, 89, 176, 6, 7, 248, 217, 2, 65, 0, 220, 94, 95, 132, 29, 4, 132, 22, 247, 38, 185, 189, 125, 27, 66, 87, 55, 162, 73, 24, 238, 80, 99, 228, 37, 224, 234, 244, 141, 185, 26, 20, 101, 231, 92, 99, 192, 166, 212, 17, 112, 1, 158, 173, 190, 170, 154, 41, 195, 109, 130, 98, 109, 28, 35, 142, 205, 213, 152, 158, 19, 253, 30, 241, 2, 64, 15, 148, 8, 16, 189, 122, 55, 109, 203, 175, 173, 24, 222, 36, 130, 130, 179, 87, 189, 32, 141, 149, 30, 115, 211, 227, 79, 234, 78, 202, 253, 48, 173, 95, 167, 203, 20, 193, 160, 30, 146, 33, 109, 4, 221, 25, 212, 216, 183, 100, 18, 46, 184, 52, 65, 146, 249, 68, 225, 10, 84, 38, 98, 133])'
      }
    },
    'RSA-PSS': {
      keyUsages: ['sign', 'verify'],
      length: function (len) {
        return len || random.item([1, 256, 384, 512])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'RSA-PSS',
          hash: {
            name: 'SHA-${this.length(len)}'
          },
          modulusLength: ${random.item([1024, 2048, 4096])},
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          saltLength: 8
        }`)
      },
      jwk: function (len) {
        return utils.common.mockup(`{
          kty: 'RSA',
          alg: 'PS${this.length(len)}'
        }`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      sign: function () {
        return this.alg()
      },
      verify: function () {
        return this.alg()
      },
      presets: {
        raw: {},
        jwk: [
          {
            kty: 'RSA',
            e: 'AQAB',
            n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
            alg: 'RS256',
            ext: true
          },
          {
            kty: 'RSA',
            e: 'AQAB',
            d: 'n_dIVw9MD_04lANi5KnKJPoRfxKy7cGHYLG0hU5DGpsFNfx2yH0Uz9j8uU7ZARai1iHECBxcxhpi3wbckQtjmbkCUKvs4G0gKLT9UuNHcCbh0WfvadfPPec52n4z6s4zwisbgWCNbT2L-SyHt1yuFmLAYXkg0swk3y5Bt_ilA8E',
            dp: '2RNM_uiYEQMcATQaUu3AwdeJpenCPykbQHkwAylvXqlHB6W7m5XX0k-SutkbXAijmGTC-Oh8NexsLGHxOACb8Q',
            dq: 'rHabkI3_XVGieLqHujpWaWe9YD03fJY0KbbQX0fIoNdNU4GcmUftzIWLSajPKKsiyfR6Xk2AEtBmBPE5qaoV6Q',
            n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
            p: '5Y4ynodegqC9kgGmfZeSrojGmLyYR8HIvKVEAIjjMUQjyvKWpWsXfPg67mTdqVpjSpQLQlRfES2nUvZ27KrU6Q',
            q: '0hd_U9PcNpMe77nhsTgoVNgMB34cqfrfu4fPuJ-7NvvMkKIELDLy-m8qg1MBbgf2i5546A9B5Exsuj4D2Vwz2Q',
            qi: 'R3CkCGVAESy_hChmDvUaLMT-R1xk6kK7RLIUQKXATPQbnDqWBMgm-vcawFVhKJ-ICJsPfmRUsv7Wt1bJ01wLGQ',
            alg: 'PS256',
            ext: true
          }
        ],
        spki: 'new Uint8Array([48, 129, 159, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 129, 141, 0, 48, 129, 137, 2, 129, 129, 0, 180, 31, 227, 200, 37, 227, 65, 238, 23, 91, 226, 130, 51, 32, 165, 245, 1, 24, 244, 5, 184, 42, 181, 155, 23, 142, 249, 220, 222, 131, 175, 54, 117, 135, 64, 232, 120, 90, 160, 221, 18, 31, 200, 41, 23, 174, 18, 172, 247, 166, 90, 37, 156, 229, 2, 70, 169, 165, 93, 246, 120, 117, 59, 202, 3, 102, 44, 119, 154, 54, 28, 198, 111, 39, 144, 73, 69, 251, 179, 74, 41, 215, 115, 186, 124, 200, 105, 75, 104, 158, 156, 158, 238, 214, 14, 81, 95, 130, 155, 146, 114, 125, 88, 158, 212, 44, 65, 236, 228, 194, 105, 96, 211, 155, 60, 71, 134, 90, 151, 202, 68, 20, 228, 105, 249, 202, 170, 155, 2, 3, 1, 0, 1])',
        plcs8: 'new Uint8Array([48, 130, 2, 119, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 2, 97, 48, 130, 2, 93, 2, 1, 0, 2, 129, 129, 0, 180, 31, 227, 200, 37, 227, 65, 238, 23, 91, 226, 130, 51, 32, 165, 245, 1, 24, 244, 5, 184, 42, 181, 155, 23, 142, 249, 220, 222, 131, 175, 54, 117, 135, 64, 232, 120, 90, 160, 221, 18, 31, 200, 41, 23, 174, 18, 172, 247, 166, 90, 37, 156, 229, 2, 70, 169, 165, 93, 246, 120, 117, 59, 202, 3, 102, 44, 119, 154, 54, 28, 198, 111, 39, 144, 73, 69, 251, 179, 74, 41, 215, 115, 186, 124, 200, 105, 75, 104, 158, 156, 158, 238, 214, 14, 81, 95, 130, 155, 146, 114, 125, 88, 158, 212, 44, 65, 236, 228, 194, 105, 96, 211, 155, 60, 71, 134, 90, 151, 202, 68, 20, 228, 105, 249, 202, 170, 155, 2, 3, 1, 0, 1, 2, 129, 128, 102, 251, 236, 161, 220, 119, 168, 148, 86, 42, 164, 192, 200, 54, 156, 108, 14, 42, 148, 42, 72, 247, 178, 73, 112, 24, 192, 230, 245, 25, 217, 45, 139, 216, 190, 213, 171, 42, 53, 218, 239, 167, 216, 43, 22, 108, 226, 36, 158, 155, 47, 227, 93, 102, 217, 252, 72, 182, 81, 152, 191, 154, 87, 137, 219, 194, 236, 53, 200, 123, 61, 10, 59, 231, 41, 18, 116, 77, 148, 50, 170, 116, 221, 110, 170, 190, 158, 108, 217, 38, 73, 84, 183, 51, 122, 179, 217, 143, 255, 87, 82, 80, 223, 188, 84, 134, 146, 150, 169, 64, 30, 168, 104, 8, 123, 162, 46, 59, 47, 232, 0, 35, 202, 42, 195, 141, 6, 1, 2, 65, 0, 237, 171, 148, 110, 241, 19, 152, 216, 206, 77, 109, 215, 21, 144, 110, 96, 34, 61, 46, 214, 148, 70, 238, 119, 206, 128, 32, 24, 136, 197, 185, 254, 209, 35, 235, 231, 122, 246, 167, 183, 117, 176, 51, 133, 169, 47, 130, 178, 40, 225, 145, 219, 48, 56, 21, 46, 198, 18, 85, 218, 194, 150, 141, 27, 2, 65, 0, 194, 4, 41, 152, 43, 246, 147, 7, 229, 244, 215, 110, 143, 7, 184, 187, 22, 166, 113, 217, 81, 52, 205, 54, 73, 202, 244, 24, 24, 219, 254, 243, 230, 230, 212, 172, 225, 218, 112, 95, 118, 103, 144, 223, 248, 164, 19, 228, 204, 204, 64, 91, 76, 77, 4, 206, 89, 173, 154, 162, 134, 113, 176, 129, 2, 64, 58, 4, 78, 97, 158, 155, 200, 13, 244, 158, 86, 23, 208, 253, 198, 211, 212, 199, 214, 173, 46, 216, 249, 209, 105, 41, 65, 172, 123, 134, 184, 214, 137, 59, 25, 149, 18, 33, 47, 227, 202, 232, 206, 74, 236, 119, 218, 145, 159, 5, 33, 83, 190, 59, 146, 128, 46, 125, 191, 83, 125, 120, 190, 205, 2, 65, 0, 134, 6, 204, 25, 20, 29, 180, 250, 90, 207, 229, 214, 185, 53, 211, 86, 98, 210, 62, 137, 170, 128, 120, 86, 205, 105, 71, 112, 50, 20, 31, 174, 171, 206, 192, 18, 97, 191, 61, 171, 164, 166, 236, 188, 220, 13, 180, 180, 117, 9, 144, 87, 193, 128, 223, 22, 17, 123, 76, 252, 131, 53, 156, 129, 2, 65, 0, 178, 29, 141, 176, 179, 203, 180, 190, 224, 34, 134, 226, 151, 73, 139, 163, 47, 17, 179, 117, 167, 200, 255, 174, 67, 114, 158, 96, 195, 176, 163, 241, 96, 24, 72, 35, 38, 18, 132, 176, 76, 235, 8, 29, 225, 138, 155, 191, 97, 158, 3, 22, 114, 133, 176, 213, 207, 120, 33, 55, 52, 135, 79, 161])'
      }
    },
    'RSA-OAEP': {
      // RSAES-OAEP algorithm using a SHA hash functions and a MGF1 mask generating function.
      keyUsages: ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
      length: function (len) {
        return len || random.item([1, 256, 384, 512])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'RSA-OAEP',
          hash: {
            name: 'SHA-${this.length(len)}'
          },
          modulusLength: ${random.item([1024, 2048, 4096])},
          publicExponent: new Uint8Array([0x01, 0x00, 0x01])
        }`)
      },
      jwk: function (len) {
        return utils.common.mockup(`{
          kty: 'RSA',
          alg: 'RSA-OAEP-${this.length(len)}'
        }`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      encrypt: function () {
        utils.common.mockup(`{
          name: 'RSA-OAEP',
          hash: {
            name: 'SHA-${this.length()}'
          },
          modulusLength: ${random.item([1024, 2048, 4096])},
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          label: crypto.getRandomValues(new Uint8Array(16))
        }`)
      },
      decrypt: function () {
        return this.alg()
      },
      unwrapKey: function () {
        return this.alg()
      },
      wrapKey: function () {
        return this.alg()
      },
      presets: {
        raw: {},
        jkw: [
          {
            kty: 'RSA',
            e: 'AQAB',
            n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
            alg: 'RSA-OAEP-256',
            ext: true
          },
          {
            kty: 'RSA',
            e: 'AQAB',
            d: 'e-Nm1CB_F7j0p4Cb-T4WmFTh7RbxUthC3j8xnlXwHgWYwaPs9ZRkicgNCfmjEb-qJ-m0ho1Cz4WzlL1CtTKEdr2w0P6L_IQPvWkFYwUm0rpY9doxnOKkzq53dhP5zdc6N8aOLk4cmAcVjw4o_csc85H-0fxzQxsTP0_jhJn7SNE',
            dp: 'JuZmXNBY9uGGfx3w3ysmFumGBLooNjMwwgMduVS6T8S-0tZkBU-iwJPzXAkKhwINEv1EnygjwmJLBdoHROeEeQ',
            dq: 'KaKOFHxm9104WNwqTth04O9ogaDz_W0wkeHnxOxbWgdtFxsarnImiMlI3Hphv9JuHD5awzNAkaj9P7wDVew-5Q',
            n: 'x-Do39ky8RVFrFplFfAuOQGLr-rqY3h9OiNHVMe34LoVG4Aofps11ycyw5ka3Ls_yA-oRouGmaMjaiPUoaU_Lm5-CMSoVwyeANLZ4b2S7V-srXFS-Qpe6aD7NpzoUL9knwTnZFIGZlxSXB-NXL5kq18UuO1LQGe1To16ijXKNxc',
            p: '4ss3ZAQMdmOk1BRQXwM9YHAoxVDkHDnSV9u89tUb3RbPXlV3fLlhRYtZ7u3FYaTzy08s8Ty2hV1KZ7xXhKEtuQ',
            q: '4Z5ejmIJTwsgxN5pI6mLxwXqQwFDERYDnwU9_vyToWXMEPAphWpS9ET00YrdHsgIGao1Slc0jp4OUxaLfhtzTw',
            qi: 'R1aKNnhUiTjoCHfOVHZ6Qv5R7So-F5mtjDKCBvCi8190U3E25DiKRvDqHZ0bHMRbdQPLLknxHVnuETw6gddHUg',
            alg: 'RSA-OAEP-256',
            ext: true
          }
        ],
        spki: 'new Uint8Array([48, 129, 159, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 129, 141, 0, 48, 129, 137, 2, 129, 129, 0, 182, 93, 35, 213, 252, 204, 20, 103, 91, 238, 105, 199, 53, 114, 24, 221, 114, 210, 137, 173, 88, 76, 205, 113, 148, 148, 79, 80, 59, 208, 60, 75, 231, 248, 78, 125, 12, 30, 237, 226, 63, 146, 157, 203, 239, 60, 138, 123, 234, 50, 23, 174, 216, 33, 122, 16, 53, 246, 140, 254, 75, 246, 205, 204, 117, 204, 115, 29, 178, 102, 139, 201, 74, 177, 45, 131, 183, 166, 234, 61, 124, 75, 110, 3, 70, 202, 148, 95, 45, 228, 94, 95, 148, 2, 162, 79, 146, 137, 29, 189, 102, 75, 207, 214, 116, 58, 63, 171, 219, 27, 5, 9, 108, 16, 218, 23, 169, 43, 181, 119, 31, 172, 95, 205, 180, 18, 255, 203, 2, 3, 1, 0, 1])',
        pkcs8: 'new Uint8Array([48, 130, 2, 118, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 2, 96, 48, 130, 2, 92, 2, 1, 0, 2, 129, 129, 0, 217, 78, 147, 218, 221, 152, 10, 66, 75, 127, 242, 108, 182, 142, 157, 44, 93, 58, 176, 193, 135, 103, 216, 179, 69, 72, 38, 115, 144, 244, 12, 139, 0, 245, 48, 115, 204, 234, 158, 193, 231, 127, 178, 240, 244, 203, 35, 229, 203, 245, 110, 215, 199, 19, 98, 183, 164, 223, 159, 203, 128, 123, 173, 26, 12, 172, 250, 99, 254, 35, 225, 221, 39, 51, 62, 3, 139, 35, 38, 164, 71, 238, 240, 73, 139, 214, 68, 172, 204, 253, 171, 244, 14, 186, 152, 159, 225, 133, 229, 140, 99, 50, 183, 242, 217, 248, 86, 233, 20, 117, 42, 136, 55, 8, 65, 124, 244, 65, 29, 15, 194, 255, 78, 31, 189, 146, 105, 161, 2, 3, 1, 0, 1, 2, 129, 128, 26, 88, 13, 82, 166, 52, 141, 97, 214, 23, 79, 195, 96, 42, 79, 225, 149, 247, 204, 127, 217, 179, 124, 48, 215, 128, 84, 177, 3, 236, 162, 44, 163, 212, 21, 168, 164, 57, 249, 63, 22, 154, 131, 141, 244, 143, 63, 237, 214, 217, 13, 51, 249, 125, 95, 37, 86, 70, 137, 239, 184, 198, 197, 136, 62, 183, 41, 78, 118, 234, 57, 195, 161, 219, 173, 234, 61, 11, 165, 109, 209, 9, 3, 22, 186, 114, 32, 135, 147, 74, 6, 106, 190, 214, 36, 208, 32, 220, 61, 12, 41, 105, 251, 247, 18, 159, 3, 198, 28, 228, 36, 44, 189, 125, 45, 72, 233, 199, 12, 72, 91, 106, 165, 246, 217, 58, 168, 53, 2, 65, 0, 241, 112, 53, 166, 98, 11, 38, 73, 58, 156, 84, 190, 118, 74, 247, 229, 85, 178, 83, 231, 53, 137, 237, 228, 246, 12, 32, 206, 157, 198, 152, 70, 11, 185, 234, 30, 112, 23, 115, 249, 68, 176, 159, 108, 247, 249, 207, 152, 145, 166, 246, 79, 176, 219, 163, 111, 243, 4, 49, 3, 239, 242, 63, 147, 2, 65, 0, 230, 105, 200, 1, 208, 201, 237, 225, 85, 27, 39, 216, 193, 1, 253, 168, 88, 15, 242, 166, 70, 106, 235, 2, 92, 24, 130, 66, 176, 176, 220, 238, 66, 12, 159, 26, 24, 40, 19, 213, 138, 98, 238, 98, 220, 65, 148, 116, 146, 21, 0, 25, 6, 177, 57, 216, 70, 51, 149, 244, 157, 153, 106, 123, 2, 64, 127, 92, 254, 48, 67, 80, 54, 102, 50, 240, 253, 19, 108, 59, 168, 1, 230, 239, 39, 171, 180, 102, 138, 132, 89, 247, 147, 230, 234, 252, 52, 159, 222, 215, 184, 85, 78, 52, 81, 13, 145, 218, 202, 127, 37, 97, 54, 205, 249, 39, 230, 143, 171, 112, 114, 11, 64, 91, 89, 176, 6, 7, 248, 217, 2, 65, 0, 220, 94, 95, 132, 29, 4, 132, 22, 247, 38, 185, 189, 125, 27, 66, 87, 55, 162, 73, 24, 238, 80, 99, 228, 37, 224, 234, 244, 141, 185, 26, 20, 101, 231, 92, 99, 192, 166, 212, 17, 112, 1, 158, 173, 190, 170, 154, 41, 195, 109, 130, 98, 109, 28, 35, 142, 205, 213, 152, 158, 19, 253, 30, 241, 2, 64, 15, 148, 8, 16, 189, 122, 55, 109, 203, 175, 173, 24, 222, 36, 130, 130, 179, 87, 189, 32, 141, 149, 30, 115, 211, 227, 79, 234, 78, 202, 253, 48, 173, 95, 167, 203, 20, 193, 160, 30, 146, 33, 109, 4, 221, 25, 212, 216, 183, 100, 18, 46, 184, 52, 65, 146, 249, 68, 225, 10, 84, 38, 98, 133])'
      }
    },
    'ECDSA': {
      keyUsages: ['sign', 'verify'],
      length: function (len) {
        return len || random.item([256, 384, 512])
      },
      alg: function (len) {
        len = this.length(len)
        return utils.common.mockup(`{
          name: 'ECDSA',
          namedCurve: 'P-${len}',
          hash: {
            name: 'SHA-${len}'
          }
        }`)
      },
      jwk: function (len) {
        return utils.common.mockup(`{
          kty: 'EC',
          alg: 'ES${this.length(len)}'
        }`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      sign: function () {
        return this.alg()
      },
      verify: function () {
        return this.alg()
      },
      presets: {
        raw: {},
        jwk: [
          {
            kty: 'EC',
            crv: 'P-256',
            x: 'A5fQnBdBSgBhTjMr1Atpzvh5SKYQ4aQRJ9WTCG5U4m4',
            y: '8YF98byzMljHX3T5ORLYTDbcwG-_eq3f23JtTE6lOe0',
            ext: true
          },
          {
            kty: 'EC',
            crv: 'P-256',
            x: 'A5fQnBdBSgBhTjMr1Atpzvh5SKYQ4aQRJ9WTCG5U4m4',
            y: '8YF98byzMljHX3T5ORLYTDbcwG-_eq3f23JtTE6lOe0',
            d: '4DvC-hxpv8myZLNeMY-8nq55MhdfA4obM1lGG3hF_yo',
            ext: true
          }
        ],
        spki: 'new Uint8Array([48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 3, 66, 0, 4, 3, 151, 208, 156, 23, 65, 74, 0, 97, 78, 51, 43, 212, 11, 105, 206, 248, 121, 72, 166, 16, 225, 164, 17, 39, 213, 147, 8, 110, 84, 226, 110, 241, 129, 125, 241, 188, 179, 50, 88, 199, 95, 116, 249, 57, 18, 216, 76, 54, 220, 192, 111, 191, 122, 173, 223, 219, 114, 109, 76, 78, 165, 57, 237])',
        pkcs8: 'new Uint8Array([48, 129, 135, 2, 1, 0, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 4, 109, 48, 107, 2, 1, 1, 4, 32, 224, 59, 194, 250, 28, 105, 191, 201, 178, 100, 179, 94, 49, 143, 188, 158, 174, 121, 50, 23, 95, 3, 138, 27, 51, 89, 70, 27, 120, 69, 255, 42, 161, 68, 3, 66, 0, 4, 3, 151, 208, 156, 23, 65, 74, 0, 97, 78, 51, 43, 212, 11, 105, 206, 248, 121, 72, 166, 16, 225, 164, 17, 39, 213, 147, 8, 110, 84, 226, 110, 241, 129, 125, 241, 188, 179, 50, 88, 199, 95, 116, 249, 57, 18, 216, 76, 54, 220, 192, 111, 191, 122, 173, 223, 219, 114, 109, 76, 78, 165, 57, 237])'
      }
    },
    'ECDH': {
      keyUsages: ['deriveKey', 'deriveBits'],
      length: function (len) {
        return len || random.item([256, 384, 512])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'ECDSA',
          namedCurve: 'P-${this.length(len)}'
        }`)
      },
      jwk: function () {
        return {}
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      deriveKey: function (key) {
        return utils.common.mockup(`{
          name: 'ECDSA',
          namedCurve: 'P-${this.length()}',
          ${key}
        }`)
      },
      deriveBits: function (key) {
        return utils.common.mockup(`{
          name: 'ECDSA',
          namedCurve: 'P-${this.length()}',
          ${key}
        }`)
      },
      presets: {
        raw: {},
        jwk: [
          {
            kty: 'EC',
            crv: 'P-256',
            x: 'kgR_PqO07L8sZOBbw6rvv7O_f7clqDeiE3WnMkb5EoI',
            y: 'djI-XqCqSyO9GFk_QT_stROMCAROIvU8KOORBgQUemE',
            ext: true
          },
          {
            kty: 'EC',
            crv: 'P-256',
            x: 'kgR_PqO07L8sZOBbw6rvv7O_f7clqDeiE3WnMkb5EoI',
            y: 'djI-XqCqSyO9GFk_QT_stROMCAROIvU8KOORBgQUemE',
            d: '5aPFSt0UFVXYGu-ZKyC9FQIUOAMmnjzdIwkxCMe3Iok',
            ext: true
          }
        ],
        spki: 'new Uint8Array([48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 3, 66, 0, 4, 146, 4, 127, 62, 163, 180, 236, 191, 44, 100, 224, 91, 195, 170, 239, 191, 179, 191, 127, 183, 37, 168, 55, 162, 19, 117, 167, 50, 70, 249, 18, 130, 118, 50, 62, 94, 160, 170, 75, 35, 189, 24, 89, 63, 65, 63, 236, 181, 19, 140, 8, 4, 78, 34, 245, 60, 40, 227, 145, 6, 4, 20, 122, 97])',
        pkcs8: 'new Uint8Array([48, 129, 135, 2, 1, 0, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 4, 109, 48, 107, 2, 1, 1, 4, 32, 229, 163, 197, 74, 221, 20, 21, 85, 216, 26, 239, 153, 43, 32, 189, 21, 2, 20, 56, 3, 38, 158, 60, 221, 35, 9, 49, 8, 199, 183, 34, 137, 161, 68, 3, 66, 0, 4, 146, 4, 127, 62, 163, 180, 236, 191, 44, 100, 224, 91, 195, 170, 239, 191, 179, 191, 127, 183, 37, 168, 55, 162, 19, 117, 167, 50, 70, 249, 18, 130, 118, 50, 62, 94, 160, 170, 75, 35, 189, 24, 89, 63, 65, 63, 236, 181, 19, 140, 8, 4, 78, 34, 245, 60, 40, 227, 145, 6, 4, 20, 122, 97])'
      }
    },
    'AES-CTR': {
      // AES in Counter Mode.
      keyUsages: ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
      length: function (len) {
        return len || random.item([128, 192, 256])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'AES-CTR',
          length: '${this.length(len)}'
        }`)
      },
      jwk: function (len) {
        return utils.common.mockup(`{
          kty: 'oct',
          alg: 'A${this.length(len)}CTR'
        }`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      encrypt: function () {
        return utils.common.mockup(`{
          name: 'AES-CTR',
          length: ${this.length()},
          counter: new Uint8Array(16)
        }`)
      },
      decrypt: function () {
        return this.encrypt()
      },
      wrapKey: function () {
        return this.encrypt()
      },
      unwrapKey: function () {
        return this.encrypt()
      },
      presets: {
        raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
        jwk: [
          {
            kty: 'oct',
            k: 'Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE',
            alg: 'A256CTR',
            ext: true
          }
        ],
        spki: {},
        pkcs8: {}
      }
    },
    'AES-CBC': {
      // AES in Cipher Block Chaining mode.
      keyUsages: ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
      length: function (len) {
        return len || random.item([128, 192, 256])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'AES-CBC',
          length: ${this.length(len)}
        }`)
      },
      jwk: function (len) {
        return utils.common.mockup(`{
          kty: 'oct',
          alg: 'A${this.length(len)}CBC'
        }`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      encrypt: function () {
        return utils.common.mockup(`{
          name: 'AES-CBC',
          length: ${this.length()},
          iv: crypto.getRandomValues(new Uint8Array(16))
        }`)
      },
      decrypt: function () {
        return this.encrypt()
      },
      wrapKey: function () {
        return this.encrypt()
      },
      unwrapKey: function () {
        return this.encrypt()
      },
      presets: {
        raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
        jwk: [
          {
            kty: 'oct',
            k: 'KfKY5nueRX7eBrOddn9IerHLv1r-T7qpggaCF3MfSR4',
            alg: 'A256CBC',
            ext: true
          }
        ],
        spki: {},
        pkcs8: {}
      }
    },
    'AES-GCM': {
      // AES in Galois/Counter Mode.
      keyUsages: ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
      length: function (len) {
        return len || random.item([128, 192, 256])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'AES-GCM',
          length: ${this.length(len)}
        }`)
      },
      jwk: function (len) {
        if (random.chance(4)) {
          return utils.common.mockup(`{
            kty: 'oct',
            alg: 'A${this.length(len)}GCMKW'
          }`)
        } else {
          return utils.common.mockup(`{
            kty: 'oct',
            alg: 'A${this.length(len)}GCM'
          }`)
        }
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      encrypt: function () {
        return utils.common.mockup(`{
          name: 'AES-GCM',
          iv: crypto.getRandomValues(new Uint8Array(12)),
          additionalData: crypto.getRandomValues(new Uint8Array(256)),
          tagLength: ${random.item([32, 64, 96, 104, 112, 120, 128])}
        }`)
      },
      decrypt: function () {
        return this.encrypt()
      },
      wrapKey: function () {
        return utils.common.mockup(`{
          name: 'AES-GCM',
          iv: crypto.getRandomValues(new Uint8Array(16))
        }`)
      },
      unwrapKey: function () {
        return this.wrapKey()
      },
      presets: {
        raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
        jwk: [
          {
            kty: 'oct',
            k: 'KfKY5nueRX7eBrOddn9IerHLv1r-T7qpggaCF3MfSR4',
            alg: 'A256GCM',
            ext: true
          }
        ],
        spki: {},
        pkcs8: {}
      }
    },
    'AES-KW': {
      // Key wrapping in AES algorithm.
      keyUsages: ['wrapKey', 'unwrapKey'],
      length: function (len) {
        return len || random.item([128, 192, 256])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'AES-KW',
          length: ${this.length(len)}
        }`)
      },
      jwk: function (len) {
        return utils.common.mockup(`{
          kty: 'oct',
          alg: 'A${this.length(len)}KW'
        }`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      wrapKey: function () {
        return utils.common.mockup(`{
          name: 'AES-KW'
        }`)
      },
      unwrapKey: function () {
        return this.wrapKey()
      },
      presets: {
        raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
        jwk: [
          {
            kty: 'oct',
            k: 'KfKY5nueRX7eBrOddn9IerHLv1r-T7qpggaCF3MfSR4',
            alg: 'A256KW',
            ext: true
          }
        ],
        spki: {},
        pkcs8: {}
      }
    },
    'HMAC': {
      // Hash-based message authentication method using SHA hash functions.
      keyUsages: ['sign', 'verify'],
      length: function (len) {
        return len || random.item([1, 256, 384, 512])
      },
      alg: function (len) {
        return utils.common.mockup(`{
          name: 'HMAC',
          hash: {
            name: 'SHA-${this.length(len)}'
          }
        }`)
      },
      jwk: function (len) {
        return utils.common.mockup(`{
          kty: 'oct',
          alg: 'HS${this.length(len)}'
        }`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      sign: function () {
        return this.alg()
      },
      verify: function () {
        return this.alg()
      },
      presets: {
        raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
        jwk: {
          kty: 'oct',
          k: 'KfKY5nueRX7eBrOddn9IerHLv1r-T7qpggaCF3MfSR4',
          alg: 'HS256',
          ext: true
        },
        spki: {},
        pkcs8: {}
      }
    },
    'HKDF': {
      // Key derivation using the extraction-then-expansion approach and using the SHA hash functions.
      keyUsages: ['deriveKey', 'deriveBits'],
      alg: function () {
        return utils.common.mockup(`{
          name: 'HKDF'
        }`)
      },
      jwk: function () {
        return utils.common.mockup(`{}`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      deriveBits: function () {
        return utils.common.mockup(`{
          name: 'HKDF',
          hash: {
            name: '${make.crypto.randomDigestName()}'
          },
          salt: crypto.getRandomValues(new Uint8Array(16)),
          info: crypto.getRandomValues(new Uint8Array(16))
        }`)
      },
      deriveKey: function () {
        return this.deriveBits()
      },
      presets: {
        raw: 'crypto.getRandomValues(new Uint8Array(16))',
        jwk: {},
        spki: {},
        pkcs8: {}
      }
    },
    'PBKDF2': {
      // Key derivation using the PKCS#5 password-based key derivation function v2.0.
      keyUsages: ['deriveKey', 'deriveBits'],
      alg: function () {
        return utils.common.mockup(`{
          name: 'PBKDF2'
        }`)
      },
      jwk: function () {
        return utils.common.mockup(`{}`)
      },
      generateKey: function () {
        return this.alg()
      },
      importKey: function () {
        return this.alg()
      },
      deriveBits: function () {
        return utils.common.mockup(`{
          name: 'PBKDF2',
          hash: {
            name: '${make.crypto.randomDigestName()}'
          },
          salt: crypto.getRandomValues(new Uint8Array(16)),
          iterations: ${random.number(1000)}
        }`)
      },
      deriveKey: function () {
        return this.deriveBits()
      },
      presets: {
        raw: 'crypto.getRandomValues(new Uint8Array(16))',
        jwk: {},
        spki: {},
        pkcs8: {}
      }
    },
    'DH': {
      keyUsages: ['deriveKey', 'deriveBits'],
      alg: function () {
        return utils.common.mockup(`{
          name: 'DH'
        }`)
      },
      jwk: function () {
        return utils.common.mockup(`{}`)
      },
      generateKey: function () {
        return utils.common.mockup(`{
          name: 'DH',
          prime: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 201, 15, 218, 162, 33, 104, 194, 52, 196, 198, 98, 139, 128, 220, 28, 209, 41, 2, 78, 8, 138, 103, 204, 116, 2, 11, 190, 166, 59, 19, 155, 34, 81, 74, 8, 121, 142, 52, 4, 221, 239, 149, 25, 179, 205, 58, 67, 27, 48, 43, 10, 109, 242, 95, 20, 55, 79, 225, 53, 109, 109, 81, 194, 69, 228, 133, 181, 118, 98, 94, 126, 198, 244, 76, 66, 233, 166, 55, 237, 107, 11, 255, 92, 182, 244, 6, 183, 237, 238, 56, 107, 251, 90, 137, 159, 165, 174, 159, 36, 17, 124, 75, 31, 230, 73, 40, 102, 81, 236, 228, 91, 61, 194, 0, 124, 184, 161, 99, 191, 5, 152, 218, 72, 54, 28, 85, 211, 154, 105, 22, 63, 168, 253, 36, 207, 95, 131, 101, 93, 35, 220, 163, 173, 150, 28, 98, 243, 86, 32, 133, 82, 187, 158, 213, 41, 7, 112, 150, 150, 109, 103, 12, 53, 78, 74, 188, 152, 4, 241, 116, 108, 8, 202, 35, 115, 39, 255, 255, 255, 255, 255, 255, 255, 255]),
          generator: new Uint8Array([2])
        }`)
      },
      importKey: function () {
        return this.generateKey()
      },
      deriveKey: function (key) {
        // return Object.assign(this.generateKey(),key)
        return utils.common.mockup(`
          name: 'DH',
          prime: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 201, 15, 218, 162, 33, 104, 194, 52, 196, 198, 98, 139, 128, 220, 28, 209, 41, 2, 78, 8, 138, 103, 204, 116, 2, 11, 190, 166, 59, 19, 155, 34, 81, 74, 8, 121, 142, 52, 4, 221, 239, 149, 25, 179, 205, 58, 67, 27, 48, 43, 10, 109, 242, 95, 20, 55, 79, 225, 53, 109, 109, 81, 194, 69, 228, 133, 181, 118, 98, 94, 126, 198, 244, 76, 66, 233, 166, 55, 237, 107, 11, 255, 92, 182, 244, 6, 183, 237, 238, 56, 107, 251, 90, 137, 159, 165, 174, 159, 36, 17, 124, 75, 31, 230, 73, 40, 102, 81, 236, 228, 91, 61, 194, 0, 124, 184, 161, 99, 191, 5, 152, 218, 72, 54, 28, 85, 211, 154, 105, 22, 63, 168, 253, 36, 207, 95, 131, 101, 93, 35, 220, 163, 173, 150, 28, 98, 243, 86, 32, 133, 82, 187, 158, 213, 41, 7, 112, 150, 150, 109, 103, 12, 53, 78, 74, 188, 152, 4, 241, 116, 108, 8, 202, 35, 115, 39, 255, 255, 255, 255, 255, 255, 255, 255]),
          generator: new Uint8Array([2]),
          ${key}
        `)
      },
      deriveBits: function (key) {
        return utils.common.mockup(`
          name: 'DH',
          prime: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 201, 15, 218, 162, 33, 104, 194, 52, 196, 198, 98, 139, 128, 220, 28, 209, 41, 2, 78, 8, 138, 103, 204, 116, 2, 11, 190, 166, 59, 19, 155, 34, 81, 74, 8, 121, 142, 52, 4, 221, 239, 149, 25, 179, 205, 58, 67, 27, 48, 43, 10, 109, 242, 95, 20, 55, 79, 225, 53, 109, 109, 81, 194, 69, 228, 133, 181, 118, 98, 94, 126, 198, 244, 76, 66, 233, 166, 55, 237, 107, 11, 255, 92, 182, 244, 6, 183, 237, 238, 56, 107, 251, 90, 137, 159, 165, 174, 159, 36, 17, 124, 75, 31, 230, 73, 40, 102, 81, 236, 228, 91, 61, 194, 0, 124, 184, 161, 99, 191, 5, 152, 218, 72, 54, 28, 85, 211, 154, 105, 22, 63, 168, 253, 36, 207, 95, 131, 101, 93, 35, 220, 163, 173, 150, 28, 98, 243, 86, 32, 133, 82, 187, 158, 213, 41, 7, 112, 150, 150, 109, 103, 12, 53, 78, 74, 188, 152, 4, 241, 116, 108, 8, 202, 35, 115, 39, 255, 255, 255, 255, 255, 255, 255, 255]),
          generator: new Uint8Array([2]),
          ${key}
        `)
      },
      presets: {
        raw: {},
        jwk: {},
        spki: {},
        pkcs8: {}
      }
    }
  },
  supportedAlgorithms: () => Object.keys(make.crypto.algorithms),
  randomAlgorithm: () => {
    return make.crypto.algorithms[random.item(Object.keys(make.crypto.algorithms))]
  },
  randomCandidate: (operation) => {
    // Find and return a random algorithm suitable for a given operation.
    return make.crypto.algorithms[make.crypto.randomAlgorithmName(operation)]
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.network = {
  sdp () {
    // session description protocol template
    return [
      'v=0',
      'o=Mozilla-SIPUA 23597 0 IN IP4 0.0.0.0',
      's=SIP Call',
      't=0 0',
      'a=ice-ufrag:f5fda439',
      'a=ice-pwd:d0df8e2904bdbd29587966e797655970',
      'a=fingerprint:sha-256 DF:69:78:20:8D:2E:08:CE:49:82:A3:11:79:1D:BF:B5:49:49:2D:32:82:2F:0D:88:84:A7:C6:63:23:63:A9:0F',
      'm=audio 52757 RTP/SAVPF 109 0 8 101',
      'c=IN IP4 192.168.129.33',
      'a=rtpmap:109 opus/48000/2',
      'a=ptime:20',
      'a=rtpmap:0 PCMU/8000',
      'a=rtpmap:8 PCMA/8000',
      'a=rtpmap:101 telephone-event/8000',
      'a=fmtp:101 0-15',
      'a=sendrecv',
      'a=candidate:0 1 UDP 2113601791 192.168.129.33 52757 typ host',
      'a=candidate:0 2 UDP 2113601790 192.168.129.33 59738 typ host',
      'm=video 63901 RTP/SAVPF 120',
      'c=IN IP4 192.168.129.33',
      'a=rtpmap:120 VP8/90000',
      'a=sendrecv',
      'a=candidate:0 1 UDP 2113601791 192.168.129.33 63901 typ host',
      'a=candidate:0 2 UDP 2113601790 192.168.129.33 54165 typ host',
      'm=application 65080 SCTP/DTLS 5000',
      'c=IN IP4 192.168.129.33',
      'a=fmtp:5000 protocol=webrtc-datachannel;streams=16',
      'a=sendrecv',
      'a=candidate:0 1 UDP 2113601791 192.168.129.33 65080 typ host',
      'a=candidate:0 2 UDP 2113601790 192.168.129.33 62658 typ host'
    ].join('\n')
  },
  IceCandidate () {
    // https://tools.ietf.org/html/rfc5245#section-15
    // candidate=
    return utils.block.block([
      random.pick([0, 1, make.number.any]),
      ' ',
      random.pick([0, 1, make.number.any]),
      ' ',
      random.pick(['UDP', 'TCP', 'SCTP']),
      random.pick(['', '/' + random.pick(['DTLS', 'DTLS-SRTP'])]),
      ' ',
      random.pick([make.number.any]),
      ' ',
      random.pick([make.network.goodHostnames]),
      ' ',
      random.pick([56187, make.number.any]),
      ' ',
      'type',
      ' ',
      random.pick([
        'host',
        utils.block.block([
          random.pick(['srflx', 'prflx', 'relay']),
          ' ',
          random.pick(['raddr']),
          ' ',
          random.pick([make.network.goodHostnames]),
          ' ',
          random.pick(['rport']),
          random.use([utils.block.block([' ', make.number.any])])
        ])
      ])
    ])
  },
  SdpMid () {
    // m=
    return utils.block.block([
      random.pick(['application', 'video', 'audio']),
      ' ',
      make.number.any,
      ' ',
      random.pick(['RTP/AVP', 'RTP/SAVPF', 'RTP/SAVP', 'SCTP/DTLS']),
      ' ',
      make.number.any
    ])
  },
  Turn () {
    // https://tools.ietf.org/html/rfc7065#section-3.1
    return utils.block.block([
      // scheme
      random.pick(make.network.PeerConnectionProtocols),
      ':',
      // turn-host
      random.pick([
        make.text.any,
        make.network.hostname
      ]),
      // turn-port
      random.use([utils.block.block([':', make.number.any])]),
      random.use([utils.block.block(['/', make.text.any])]),
      '?',
      random.pick(['transport']),
      '=',
      random.pick(['udp', 'tcp', make.text.any])
    ])
  },
  PeerConnectionProtocols () {
    return ['turn', 'turns', 'stun', 'stuns']
  },
  randomIPv4 () {
    return random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any])
  },
  randomIPv6 () {
    let parts = []

    for (let i = 0; i < 8; i++) {
      parts.push(random.hex(4))
    }

    return parts.join(':')
  },
  iceServer () {
    return random.pick([
      'stun:23.21.150.121'
    ])
  },
  dtmf () {
    return random.subset([
      '*', '#',
      'A', 'B', 'C', 'D',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ], make.number.range()).join('')
  },
  goodHostnames () {
    return [
      '0.0.0.0',
      '127.0.0.1:8080'
    ]
  },
  badHostnames () {
    return [
      'google.org:8080',
      '::1',
      '[::192.9.5.5]:42',
      '2001:db8:85a3::8a2e:370:3478',
      '2001:db8:85a3:0:0:8a2e:370:3478',
      '::ffff:192.0.2.1',
      '0000:0000:0000:0000:0000:0000:0000:0001',
      '::192.0.2.128',
      '::ffff:192.0.2.128',
      '2001:db8::1:2',
      '2001:db8::1:1:1:1:1'
    ]
  },
  hostname () {
    return random.pick([
      this.randomIPv4,
      this.randomIPv6,
      this.goodHostnames,
      this.badHostnames
    ])
  },
  port () {
    return random.pick([80, 443, 21, 23, 9310])
  },
  hash () {
    return random.pick([
      '',
      '#',
      '#main-content',
      () => '#' + make.text.any()
    ])
  },
  path () {
    return random.pick([
      '',
      '/',
      '/index.html',
      () => '/' + make.text.any()
    ])
  },
  protocol () {
    return random.pick([
      'http',
      'https',
      'ftp',
      'telnet',
      'chrome',
      'resource'
    ]) + ':'
  },
  search () {
    return random.pick([
      '',
      '?',
      '?foo=bar',
      () => '?' + make.text.any()
    ])
  },
  randomBitmask (list) {
    if (list.length <= 1) {
      return list.join('')
    }
    let max = random.range(2, list.length)
    let mask = random.pick(list)
    for (let i = 1; i < max; i++) {
      mask += '|' + random.pick(list)
    }
    return mask
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.text = {
  lineEnd: function () {
    return random.pick([
      '\n', '\r', '\r\n', '\n\r'
    ])
  },
  controlChar: function () {
    return random.pick([
      '\b', '\t', '\n', '\v', '\f', '\r', '\0', '\c', '\a', '\e' // eslint-disable-line no-useless-escape
    ])
  },
  token: function () {
    return random.pick([
      '*', '+', '%', '-', '!', '^', ':', '|', '&', '<', '>', '.', '"',
      '#', ' ', ';', ',', '{', '}', '(', ')', '[', ']', '/', '\\', '/*', '*/'
    ])
  },
  charset: function () {
    return random.pick([
      'UTF-8', 'ISO-8859-1'
    ])
  },
  language: function () {
    return random.pick([
      // special casing for i, I, dotted/dotless variants
      ['tr', 'az'],
      // special casing rules: https://developer.mozilla.org/en/CSS/text-transform
      ['nl', 'gr'],
      // special justification rules
      ['ja', 'zh'],
      // tend to be RTL
      ['ar', 'he'],
      // http://mxr.mozilla.org/mozilla-central/source/gfx/thebes/gfxAtomList.h
      ['en', 'x-unicode', 'x-western', 'ja', 'ko', 'zh-cn', 'zh-hk', 'zh-tw', 'x-cyrillic', 'el', 'tr', 'he', 'ar', 'x-baltic', 'th', 'x-devanagari', 'x-tamil', 'x-armn', 'x-beng', 'x-cans', 'x-ethi', 'x-geor', 'x-gujr', 'x-guru', 'x-khmr', 'x-knda', 'x-mlym', 'x-orya', 'x-sinh', 'x-telu', 'x-tibt', 'ko-xxx', 'x-central-euro', 'x-symbol', 'x-user-def', 'az', 'ba', 'crh', 'tt'],
      // Seen in mxr
      ['en-US', 'fr', 'fra', 'de', 'ru', 'en-us', 'is-IS', 'xyzzy']
    ])
  },
  layoutCharCodes: function () {
    return random.pick([
      0,      // null
      160,    // non-breaking space
      0x005C, // backslash, but in some countries, represents local currency symbol (e.g. yen)
      0x00AD, // soft hyphen
      0x0BCC, // a Tamil character that is displayed as three glyphs
      // http://unicode.org/charts/PDF/U2000.pdf
      0x200B, // zero-width space
      0x200C, // zero-width non-joiner
      0x200D, // zero-width joiner
      0x200E, // left-to-right mark
      0x200F, // right-to-left mark
      0x2011, // non-breaking hyphen
      0x2027, // hyphenation point
      0x2028, // line separator
      0x2029, // paragraph separator
      0x202A, // left-to-right embedding
      0x202B, // right-to-left embedding
      0x202C, // pop directional formatting
      0x202D, // left-to-right override
      0x202E, // right-to-left override
      0x202F, // narrow no-break space
      0x2060, // word joiner
      0x2061, // function application (one of several invisible mathematical operators)
      // http://unicode.org/charts/PDF/U3000.pdf
      0x3000, // ideographic space (CJK)
      // http://unicode.org/charts/PDF/U0300.pdf
      0x0301, // combining acute accent (if it appears after "a", it turns into "a" with an accent)
      // Arabic has the interesting property that most letters connect to the next letter.
      // Some code calls this "shaping".
      0x0643, // arabic letter kaf
      0x0645, // arabic letter meem
      0x06CD, // arabic letter yeh with tail
      0xFDDE, // invalid unicode? but somehow associated with arabic.
      // http://unicode.org/reports/tr36/tr36-7.html#Buffer_Overflows
      // Characters with especially high expansion factors when they go through various unicode "normalizations"
      0x1F82,
      0xFDFA,
      0xFB2C,
      0x0390,
      // 0x1D160, // hmm, need surrogates
      // Characters with especially high expansion factors when lowercased or uppercased
      0x023A,
      0x0041,
      0xDC1D, // a low surrogate
      0xDB00, // a high surrogate
      // UFFF0.pdf
      0xFFF9, // interlinear annotation anchor
      0xFFFA, // interlinear annotation seperator
      0xFFFB, // interlinear annotation terminator
      0xFFFC, // object replacement character
      0xFFFD, // replacement character
      0xFEFF, // zero width no-break space
      0xFFFF, // not a character
      0x00A0, // no-break space
      0x2426,
      0x003F,
      0x00BF,
      0xDC80,
      0xDCFF,
      // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters
      0x205F, // mathematical space
      0x2061, // mathematical function application
      0x2064, // mathematical invisible separator
      0x2044  // fraction slash character
    ])
  },
  bidiCharCodes: function () {
    return random.pick([
      0x0660, // START_HINDI_DIGITS
      0x0669, // END_HINDI_DIGITS
      0x066A, // START_ARABIC_SEPARATOR
      0x066B, // END_ARABIC_SEPARATOR
      0x0030, // START_ARABIC_DIGITS
      0x0039, // END_ARABIC_DIGITS
      0x06f0, // START_FARSI_DIGITS
      0x06f9 // END_FARSI_DIGITS
    ])
  },
  // http://www.unicode.org/Public/6.0.0/ucd/UnicodeData.txt
  unicodeCombiningCharacters: function () {
    return random.item([
      [0x0300, 0x036F], // Combining Diacritical Marks
      [0x0483, 0x0489],
      [0x07EB, 0x07F3],
      [0x135D, 0x135F],
      [0x1A7F, 0x1A7F],
      [0x1B6B, 0x1B73],
      [0x1DC0, 0x1DFF], // Combining Diacritical Marks Supplement
      [0x20D0, 0x2DFF],
      [0x3099, 0x309A],
      [0xA66F, 0xA6F1],
      [0xA8E0, 0xA8F1],
      [0xFE20, 0xFE26], // Combining Half Marks
      [0x101FD, 0x101FD],
      [0x1D165, 0x1D169],
      [0x1D16D, 0x1D172],
      [0x1D17B, 0x1D18B],
      [0x1D1AA, 0x1D1AD],
      [0x1D242, 0x1D244]
    ])
  },
  unicodeBMP: function () {
    return random.item([
      // BMP = Basic Multilingual Plane
      [0x0000, 0xFFFF]
    ])
  },
  unicodeSMP: function () {
    return random.item([
      // SMP = Supplementary Multilingual Plane
      [0x10000, 0x13FFF],
      [0x16000, 0x16FFF],
      [0x1B000, 0x1BFFF],
      [0x1D000, 0x1DFFF],
      [0x1F000, 0x1FFFF]
    ])
  },
  unicodeSIP: function () {
    return random.item([
      // SIP = Supplementary Ideographic Plane
      [0x20000, 0x2BFFF],
      [0x2F000, 0x2FFFF]
    ])
  },
  unicodeSSP: function () {
    return random.item([
      // SSP = Supplementary Special-purpose Plane
      [0xE0000, 0xE0FFF]
    ])
  },
  assignmentOperator: function () {
    return random.pick([
      '=', '+=', '-=', '*=', '/=', '%=', '**=', '<<=', '>>=', '>>>=', '&=', '^=', '|='
    ])
  },
  arithmeticOperator: function () {
    return random.pick([
      '%', '-', '+', '*', '/'
    ])
  },
  currency: function () {
    return random.pick([
      // https://en.wikipedia.org/wiki/ISO_4217
      'USD', 'USS', 'USN', 'EUR', 'CHF', 'GBP', 'XAG', 'XBA', 'XBB', 'XBC',
      'XBD', 'XSU', 'XTS', 'XXX'
    ])
  },
  fromBlocks: function (set, maxlen) {
    let s = ''

    for (let i = 0; i < random.number(maxlen || 255); i++) {
      s += random.pick(set)
    }

    return s
  },
  quotedString: function () {
    return utils.common.quote(make.text.any())
  },
  chars: function () {
    return random.pick([
      make.text.controlChar,
      make.text.token,
      make.text.assignmentOperator,
      make.text.arithmeticOperator,
      String.fromCharCode(make.text.layoutCharCodes()),
      String.fromCharCode(make.text.bidiCharCodes())
    ])
  },
  any: function () {
    // Generate a string compromised of random individual characters
    // This might be too slow to used for all 'texts' uses
    let s = ''
    // TODO: Len calculation take from DOMFuzz - maybe we should revise this?
    let len = random.pick([make.number.tiny, make.number.range])
    for (let i = 0; i < len; i++) {
      s += make.text.chars()
    }
    return s
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.uri = {
  problematic: function () {
    return random.item([
      'aim:yaz', // Often triggers an 'external protocol request' dialog
      'foop:yaz', // Often triggers an unknown protocol
      'about:memory', // Content is not allowed to link or load
      'ws://localhost/' // WebSocket protocol
    ])
  },

  standard: function () {
    return random.item([
      'about:blank',
      'about:srcdoc',
      'about:mozilla',
      'about:rights',
      'data:text/html,',
      'data:image/png,',
      'data:',
      'javascript:5555',
      'javascript:"QQQQ' + String.fromCharCode(0) + 'UUUU"',
      'http://a.invalid/',
      'http://localhost:6/',
      'https://localhost:6/',
      'ftp://localhost:6/',
      'http://localhost:25/'
    ])
  },

  namespace: function () {
    return random.item([
      'http://www.w3.org/1999/xhtml',
      'http://www.w3.org/2000/svg',
      'http://www.w3.org/1998/Math/MathML'
    ])
  },

  any: function () {
    return random.choose([
      [1, this.problematic],
      [10, this.standard],
      [10, this.namespace],
      [10, make.files.any]
    ])
  }
}
