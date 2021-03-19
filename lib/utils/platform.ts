/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export class platform {
  // @ts-ignore
  static get name () {
    const platform: Record<string, any> = {}

    /* In case we are running in Node. */
    if (typeof window === 'undefined') {
      return platform
    }

    const userAgent = (navigator.userAgent).toLowerCase()
    const language = navigator.language

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

    /**
     * Identify available feature locations
     *
     * @param {Array} candidates - Array of features to check
     * @returns {string?}
     */
    function platformName (candidates: string[]): string | undefined {
      for (let i = 0; i < candidates.length; i++) {
        if (candidates[i] in window) {
          return `window.${candidates[i]}`
        }
        if (candidates[i] in navigator) {
          return `navigator.${candidates[i]}`
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
  }
}
