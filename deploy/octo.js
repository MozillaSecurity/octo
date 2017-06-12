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
    if (!(Array.isArray(list) || (list !== undefined && typeof list !== 'string' && list.hasOwnProperty('length')))) {
      logger.traceback()
      throw new TypeError('this.item() received a non array type: \'' + list + '\'')
    }
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

  function testcase (msg) {
    dump('/*L*/ ' + utils.common.quote(msg) + '\n')
  }

  function dumpln (msg) {
    dump(msg + '\n')
  }

  function error (msg) {
    dumpln(color.red + msg + color.clear)
  }

  function ok (msg) { // eslint-disable-line no-unused-vars
    dumpln(color.green + msg + color.green)
  }

  function JSError (msg) {
    error(comment('ERROR: ' + msg))
  }

  function comment (msg) {
    return '/* ' + msg + ' */'
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
    error: error,
    JSError: JSError,
    dumpln: dumpln,
    comment: comment,
    testcase: testcase,
    separator: separator,
    traceback: traceback
  }
})()


var make = {} // eslint-disable-line no-unused-vars


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

make.network = {
  sdp: function () {
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
  PeerConnectionProtocols: function () {
    return ['turn', 'turns', 'stun', 'stuns']
  },
  randomIPv4: function () {
    return random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any])
  },
  randomIPv6: function () {
    let parts = []

    for (let i = 0; i < 8; i++) {
      parts.push(random.hex(4))
    }

    return parts.join(':')
  },
  goodHostnames: function () {
    return [
      '0.0.0.0',
      '127.0.0.1:8080'
    ]
  },
  badHostnames: function () {
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
  randomBitmask: function (list) {
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
    // https://gist.github.com/tonyhb/635401
    return random.pick([
      'en-US', 'en', 'de'
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
      '=', '-=', '+=', '*=', '/='
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
      String.fromCharCode(make.text.layoutCharCodes),
      String.fromCharCode(make.text.bidiCharCodes)
    ])
  },
  any: function () {
    // Generate a string compromised of random individual characters
    // This might be too slow to used for all 'texts' uses
    let s = ''
    // TODO: Len calculation take from DOMFuzz - maybe we should revise this?
    let len = random.number(1000) * random.number(10) + random.number(10)
    for (let i = 0; i < len; i++) {
      s += make.text.chars()
    }
    return s
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.files = {
  image: function () {
    return utils.common.quote(random.pick([
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=',
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=',
      'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
      // Todo: load from filesystem randomly: 'media/images/*.{bmp|jpg|gif|png|webp}'
    ]))
  },
  video: function () {
    return utils.common.quote(random.pick([
      'data:video/webm;base64,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',
      'data:video/ogg;base64,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qiCkUlIpFYRUSiolo5RSailVEFIpqZQKQiollVIAANiBAwDYgYVQaMhKACAPAIAwRinGGHNOIqQUY845JxFSijHnnJNKMeacc85JKRlzzDnnpJTOOeecc1JK5pxzzjkppXPOOeeclFJK55xzTkopJYTOQSellNI555wTAABU4AAAEGCjyOYEI0GFhqwEAFIBAAyOY1ma5nmiaJqWJGma53meKJqmJkma5nmeJ4qqyfM8TxRF0TRVled5niiKommqKtcVRdM0TVVVXbIsiqZpmqrqujBN01RV13VdmKZpqqrrui5sW1VV1XVlGbatqqrqurIMXNd1ZdmWgSy7ruzasgAA8AQHAKACG1ZHOCkaCyw0ZCUAkAEAQBiDkEIIIWUQQgohhJRSCAkAABhwAAAIMKEMFBqyEgBIBQAAjLHWWmuttdZAZ6211lprrYDMWmuttdZaa6211lprrbXWUmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaay2llFJKKaWUUkoppZRSSimllFJKBQD6VTgA+D/YsDrCSdFYYKEhKwGAcAAAwBilGHMMQimlVAgx5px0VFqLsUKIMeckpNRabMVzzkEoIZXWYiyecw5CKSnFVmNRKYRSUkottliLSqGjklJKrdVYjDGppNZai63GYoxJKbTUWosxFiNsTam12GqrsRhjayottBhjjMUIX2RsLabaag3GCCNbLC3VWmswxhjdW4ultpqLMT742lIsMdZcAAB3gwMARIKNM6wknRWOBhcashIACAkAIBBSijHGGHPOOeekUow55pxzDkIIoVSKMcaccw5CCCGUjDHmnHMQQgghhFJKxpxzEEIIIYSQUuqccxBCCCGEEEopnXMOQgghhBBCKaWDEEIIIYQQSiilpBRCCCGEEEIIqaSUQgghhFJCKCGVlFIIIYQQQiklpJRSCiGEUkIIoYSUUkophRBCCKWUklJKKaUSSgklhBJSKSmlFEoIIZRSSkoppVRKCaGEEkopJaWUUkohhBBKKQUAABw4AAAEGEEnGVUWYaMJFx6AQkNWAgBkAACQopRSKS1FgiKlGKQYS0YVc1BaiqhyDFLNqVLOIOYklogxhJSTVDLmFEIMQuocdUwpBi2VGELGGKTYckuhcw4AAABBAICAkAAAAwQFMwDA4ADhcxB0AgRHGwCAIERmiETDQnB4UAkQEVMBQGKCQi4AVFhcpF1cQJcBLujirgMhBCEIQSwOoIAEHJxwwxNveMINTtApKnUgAAAAAAAMAPAAAJBcABER0cxhZGhscHR4fICEiIyQCAAAAAAAFwB8AAAkJUBERDRzGBkaGxwdHh8gISIjJAEAgAACAAAAACCAAAQEBAAAAAAAAgAAAAQET2dnUwAAQAAAAAAAAAAjaKehAgAAAEhTii0BRjLV6A+997733vvfe+997733vvfG+8fePvH3j7x94+8fePvH3j7x94+8fePvH3j7x94+8fePvH3gAAAAAAAAAAXm5PqUgABPZ2dTAABLAAAAAAAAACNop6EDAAAAIOuvQAsAAAAAAAAAAAAAAE9nZ1MAAEADAAAAAAAAI2inoQQAAAB/G0m4ATg/8A+997733vvfe+997733vvfK+8B94D7wAB94AAAAD8Kl94D7wH3gAD7wAAAAH4VABem0+pSAAE9nZ1MAAEsDAAAAAAAAI2inoQUAAABc3zKaCwAAAAAAAAAAAAAAT2dnUwAEQAYAAAAAAAAjaKehBgAAAOytEQUBOD/wD733vvfe+997733vvfe+98r7wH3gPvAAH3gAAAAPwqX3gPvAfeAAPvAAAAAfhUAF6bT6lIAAT2dnUwAAQL4AAAAAAACWSy/CAgAAAHsqKaIxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAKDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg5PZ2dTAAQAxAAAAAAAAJZLL8IDAAAABLWpWwIBAQ4O=',
      'data:video/mp4;base64,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',
      'media/video/video1.webm'
      // Todo: load from filesystem randomly: 'media/videos/*.{webm|ogv|mp4}'
    ]))
  },
  audio: function () {
    return utils.common.quote(random.pick([
      'media/audio/mono-uncompressed-8bit-8000hz.wav',
      'media/audio/mono-uncompressed-8bit-44100hz.wav',
      'media/audio/mono-uncompressed-32bit-8000hz.wav',
      'media/audio/mono-uncompressed-32bit-44100hz.wav'
      // Todo: load from filesystem randomly: 'media/videos/*.{wav|ogg|mp3}'
    ]))
  },
  webvtt: function () {
    return utils.common.quote(random.pick([
      // 'data:text/vtt,' + encodeURIComponent('WEBVTT\n\n00:00:00.000 --> 00:00:00.001\ntest');,
      'media/video/sample.vtt'
      // Todo: load from filesystem randomly: 'media/videos/*.{vtt}'
    ]))
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
    let size = limit || random.number(make.number.tiny)

    for (let i = 0; i < size; i++) {
      array.push(random.pick(fn))
    }

    return array
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
    return '\'' + s + '\''
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
          n = random.range(Number.MAX_VALUE, Number.MIN_VALUE)
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
  tiny: function () {
    return Math.pow(2, random.number(12))
  },
  unsigned: function () {
    if (random.chance(2)) {
      return Math.abs(make.number.any())
    }
    return Math.pow(2, random.number(65)) + random.number(3) - 1
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
  quote: function (obj) {
    return JSON.stringify(obj)
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
  }
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.mutate = {
  text: function (str) {
    let mutator = function (m) {
      return random.number(4) === 1 ? m : make.text.any()
    }
    return str.replace(/[a-zA-Z]+?/g, mutator)
  },

  numbers: function (str) {
    let mutator = function (m) {
      return random.number(4) === 1 ? m : make.number.any()
    }
    return str.replace(/-?\d+(\.\d+)?/g, mutator)
  },

  units: function (str) {
    let mutator = function (m) {
      return random.number(4) === 1 ? m : make.unit.unit()
    }
    return str.replace(/(px|em|ex|ch|rem|mm|cm|in|pt|pc|%')/g, mutator)
  },

  random: function (str) {
    let mutator = function (m) {
      if (random.number(20) === 1) {
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

Object.defineProperty(Object, 'isObject', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function (obj) {
    return (obj != null && typeof obj === 'object' &&
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
    if (window.debug) {
      return 'try { ' + s + ' } catch(e) { logger.JSError(e); }'
    }
    return 'try { ' + s + ' } catch(e) { }'
  },
  makeLoop: function (s, max) {
    return 'for (let i = 0; i < ' + (max || make.number.range()) + '; i++) {' + s + '}'
  },
  makeArray: function (type, arrayLength, cb) {
    if (type === null || type === undefined) {
      type = random.index(['Uint8', 'Float32'])
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
