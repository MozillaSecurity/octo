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

/** General logging utilities. */
export class logger {
  /**
   * Log to console using appropriate environment.
   *
   * @param msg - Message to log.
   */
  static console(msg: string): void {
    if (typeof window === "undefined") {
      try {
        // @ts-ignore
        print(msg)
      } catch (e) {
        console.log(msg)
      }
    } else {
      // @ts-ignore
      if (window.dump) {
        // @ts-ignore
        dump(msg)
      } else if (window.console) {
        // @ts-ignore
        console.log(msg)
      } else {
        throw new Error("Unable to run console logger.")
      }
    }
  }

  /**
   * Alias for logger.console.
   *
   * @param msg - Message to log.
   */
  static dump(msg: string): void {
    this.console(msg)
  }

  /**
   * Log message with trailing newline.
   *
   * @param msg - Message to log.
   */
  static dumpln(msg: string): void {
    this.dump(`${msg}\n`)
  }

  /**
   * Log message with prefix and wrapped in try/catch.
   *
   * @param msg - Message to log.
   */
  static log(msg: string): void {
    this.dumpln(`/*L*/ ${utils.script.safely(msg)}`)
  }

  /**
   * Log a comment.
   *
   * @param msg - Message to log.
   */
  static info(msg: string): void {
    this.dumpln(`/*L*/ /* ${msg} */`)
  }

  /**
   * Log an error.
   *
   * @param msg - Message to log.
   */
  static error(msg: string): void {
    this.dumpln(color.red + msg + color.clear)
  }

  /**
   * Log a message.
   *
   * @param msg - Message to log.
   */
  static ok(msg: string): void {
    // eslint-disable-line no-unused-vars
    this.dumpln(color.green + msg + color.green)
  }

  /**
   * Log a message as a comment and prefixed with ERROR.
   *
   * @param msg - Message to log.
   */
  static JSError(msg: string): void {
    this.error(`/* ERROR: ${msg} */`)
  }

  /**
   * Log a message as a comment.
   *
   * @param msg - Message to log.
   */
  static comment(msg: string): void {
    this.dumpln(`/*L*/ // ${msg}`)
  }

  /** Log a testcase separator. */
  static separator(): void {
    this.dumpln(color.green + sep + color.clear)
  }

  /** Log a traceback. */
  static traceback(): void {
    this.error("===[ Traceback ] ===")
    const e = new Error()
    // @ts-ignore
    this.dump(e.stack || e.stacktrace || "")
  }
}
