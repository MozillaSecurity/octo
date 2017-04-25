/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var websocket = null;

var logger = (function () {
  let color = {
    red: "\033[1;31m",
    green: "\033[1;32m",
    clear: "\033[0m"
  };
  if (platform.isWindows) {
    color = {
      red: "",
      green: "",
      clear: ""
    };
  }

  let sep = "\n/* ### NEXT TESTCASE ############################## */";

  function console(msg) {
    if (websocket) {
      websocket.send(msg);
    }
    if (typeof window === 'undefined') {
      print(msg);
    } else if (window.dump) {
      window.dump(msg);
    } else if (window.console && window.console.log) {
      window.console.log(msg);
    } else {
      throw "Unable to run console logger.";
    }
  }

  function dump(msg) {
    console(msg);
  }

  function testcase(msg) {
    dump("/*L*/ " + JSON.stringify(msg) + "\n");
  }

  function dumpln(msg) {
    dump(msg + "\n");
  }

  function error(msg) {
    dumpln(color.red + msg + color.clear);
  }

  function JSError(msg) {
    error(comment(msg))
  }

  function comment(msg) {
    return "/* " + msg + " */";
  }

  function separator() {
    dumpln(color.green + sep + color.clear);
  }

  function traceback() {
    error("===[ Traceback ]");
    try {
      throw new Error();
    } catch (e) {
      dump(e.stack || e.stacktrace || "");
    }
    error("===");
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
  };
})();
