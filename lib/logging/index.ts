/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { utils } from '../utils'

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

export class logger {
  static console (msg: string) {
    if (typeof window === 'undefined') {
      try {
        // @ts-ignore
        print(msg) // eslint-disable-line no-undef
      } catch (e) {
        console.log(msg)
      }
    } else {
      // @ts-ignore
      if (window.dump) {
        // @ts-ignore
        dump(msg) // eslint-disable-line no-undef
      } else if (window.console && window.console.log) {
        // @ts-ignore
        console.log(msg)
      } else {
        throw new Error('Unable to run console logger.')
      }
    }
  }

  static dump (msg: string) {
    this.console(msg)
  }

  static dumpln (msg: string) {
    this.dump(`${msg}\n`)
  }

  static log (msg: string) {
    this.dumpln(`/*L*/ ${utils.script.safely(msg)}`)
  }

  static info (msg: string) {
    this.dumpln(`/*L*/ /* ${msg} */`)
  }

  static error (msg: string) {
    this.dumpln(color.red + msg + color.clear)
  }

  static ok (msg: string) { // eslint-disable-line no-unused-vars
    this.dumpln(color.green + msg + color.green)
  }

  static JSError (msg: string) {
    this.error(`/* ERROR: ${msg} */`)
  }

  static comment (msg: string) {
    this.dumpln(`/*L*/ // ${msg}`)
  }

  static separator () {
    this.dumpln(color.green + sep + color.clear)
  }

  static traceback () {
    this.error('===[ Traceback ] ===')
    const e = new Error()
    // @ts-ignore
    this.dump(e.stack || e.stacktrace || '')
  }
}
