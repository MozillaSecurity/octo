/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { utils } from "../utils"

const sep = "\n/* ### NEXT TESTCASE ############################## */"
const color = {
  red: "\u{1b}[1;31m",
  green: "\u{1b}[1;32m",
  clear: "\u{1b}[0m",
}
if (utils.platform.name.isWindows) {
  color.red = ""
  color.green = ""
  color.clear = ""
}

export class logger {
  static console(msg: string): void {
    if (typeof window === "undefined") {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        print(msg)
      } catch (e) {
        console.log(msg)
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (window.dump) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dump(msg) // eslint-disable-line no-undef
      } else if (window.console) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console.log(msg)
      } else {
        throw new Error("Unable to run console logger.")
      }
    }
  }

  static dump(msg: string): void {
    this.console(msg)
  }

  static dumpln(msg: string): void {
    this.dump(`${msg}\n`)
  }

  static log(msg: string): void {
    this.dumpln(`/*L*/ ${utils.script.safely(msg)}`)
  }

  static info(msg: string): void {
    this.dumpln(`/*L*/ /* ${msg} */`)
  }

  static error(msg: string): void {
    this.dumpln(color.red + msg + color.clear)
  }

  static ok(msg: string): void {
    // eslint-disable-line no-unused-vars
    this.dumpln(color.green + msg + color.green)
  }

  static JSError(msg: string): void {
    this.error(`/* ERROR: ${msg} */`)
  }

  static comment(msg: string): void {
    this.dumpln(`/*L*/ // ${msg}`)
  }

  static separator(): void {
    this.dumpln(color.green + sep + color.clear)
  }

  static traceback(): void {
    this.error("===[ Traceback ] ===")
    const e = new Error()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dump(e.stack || e.stacktrace || "")
  }
}
