/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO: https://github.com/MozillaSecurity/octo/issues/7

if (!String.fromCodePoint) {
  String.fromCodePoint = function fromCodePoint() {
    var chars = [], point, offset, units, i;
    for (i = 0; i < arguments.length; ++i) {
      point = arguments[i];
      offset = point - 0x10000;
      units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
      chars.push(String.fromCharCode.apply(null, units));
    }
    return chars.join("");
  }
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (str) { return (this.match(str + "$") === str) };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (str) {
    return (this.match("^" + str) === str)
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""))
  };
}

if (!String.prototype.insert) {
  String.prototype.insert = function (data, idx) {
    return this.slice(0, idx) + data + this.slice(idx, this.length);
  };
}

if (!Array.prototype.has) {
  Array.prototype.has = function (v) {
    return this.indexOf(v) !== -1;
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (array, fn) {
    for (var i = 0; i < array.length; i++) {
      fn(array[i]);
    }
  }
}

if (!Array.prototype.map) {
  Array.prototype.map = function (fn, array) {
    var result = [];
    Array.forEach(array, function (element) {
      result.push(fn(element));
    });
    return result;
  }
}
