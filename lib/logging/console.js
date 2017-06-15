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

  function log (msg) {
    dump('/*L*/ ' + utils.script.safely(msg) + '\n')
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
    error('/* ERROR: ' + msg + ' */')
  }

  function comment (msg) {
    dump('/* ' + msg + ' */')
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
    error: error,
    JSError: JSError,
    dumpln: dumpln,
    comment: comment,
    testcase: testcase,
    separator: separator,
    traceback: traceback
  }
})()
