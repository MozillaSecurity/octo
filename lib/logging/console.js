/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const utils = require('../utils')

let websocket = null

const sep = '\n/* ### NEXT TESTCASE ############################## */'
const color = {
  red: '\u{1b}[1;31m',
  green: '\u{1b}[1;32m',
  clear: '\u{1b}[0m'
}
if (utils.platform.name.isWindows) {
  color.red = ''
  color.green = ''
  color.clear = ''
}

class logger {

  static console (msg) {
    if (websocket) {
      websocket.send(msg)
    }
    if (typeof window === 'undefined') {
      try {
        print(msg)  // eslint-disable-line no-undef
      } catch (e) {
        console.log(msg)
      }
    } else if (window.dump) {
      dump(msg)
    } else if (window.console && window.console.log) {
      console.log(msg)
    } else {
      throw new Error('Unable to run console logger.')
    }
  }

  static dump (msg) {
    this.console(msg)
  }

  static dumpln (msg) {
    this.dump(`${msg}\n`)
  }

  static log (msg) {
    this.dumpln(`/*L*/ ${utils.script.safely(msg)}`)
  }

  static info (msg) {
    this.dumpln(`/*L*/ /* ${msg} */`)
  }

  static error (msg) {
    this.dumpln(color.red + msg + color.clear)
  }

  static ok (msg) { // eslint-disable-line no-unused-vars
    this.dumpln(color.green + msg + color.green)
  }

  static JSError (msg) {
    this.error(`/* ERROR: ${msg} */`)
  }

  static comment (msg) {
    this.dumpln(`/*L*/ // ${msg}`)
  }

  static separator () {
    this.dumpln(color.green + sep + color.clear)
  }

  static traceback () {
    this.error('===[ Traceback ] ===')
    try {
      throw new Error()
    } catch (e) {
      this.dump(e.stack || e.stacktrace || '')
    }
  }
}

module.exports = logger