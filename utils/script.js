/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.script = {
  methodHead: function (list, numOptional) {
    if (isNaN(numOptional)) {
      numOptional = 0;
    }
    var arity = list.length - random.number(numOptional);
    var params = [];
    for (var i = 0; i < arity; i++) {
      params.push(random.pick([list[i]]));
    }
    return "(" + params.join(", ") + ")";
  },
  methodCall: function (objectName, methodHash) {
    if (!utils.common.getKeysFromHash(methodHash).length || !objectName) {
      return "";
    }
    var methodName = random.key(methodHash);
    var methodArgs = methodHash[methodName];
    if (typeof(methodArgs) == "function") { // Todo: Hmmmm..
      return methodArgs();
    }
    return objectName + "." + methodName + utils.script..methodHead(methodArgs);
  },
  setAttribute: function (objectName, attributeHash) {
    if (!utils.common.getKeysFromHash(attributeHash).length || !objectName) {
      return "";
    }
    var attributeName = random.key(attributeHash);
    var attributeValue = random.pick(attributeHash[attributeName]);
    var operator = " = ";
    /*
     if (typeof(attributeValue) == "number" && Random.chance(8)) {
     operator = " " + Make.randomAssignmentOperator() + " ";
     }
     if (typeof(attributeValue) == "string") {
     attributeValue = "'" + attributeValue + "'";
     }
     */
    return objectName + "." + attributeName + operator + attributeValue + ";";
  },
  makeConstraint: function (keys, values) {
    var o = {};
    var n = random.range(0, keys.length);
    while (n--) {
      o[random.pick(keys)] = random.pick(values);
    }
    return o;
  },
  makeRandomOptions: function (base_o) {
    var o = {}, unique = random.some(Object.keys(base_o));
    for (var i = 0; i < unique.length; i++) {
      o[unique[i]] = random.pick(base_o[unique[i]]);
    }
    return JSON.stringify(o);
  },
  safely: function (s) {
    if (window.debug) {
      return "try { " + s + " } catch(e) { Logger.JSError(e); }";
    }
    return "try { " + s + " } catch(e) { }";
  },
  makeLoop: function (s, max) {
    return "for (var i = 0; i < " + (max || make.numbers.rangeNumber()) + "; i++) {" + s + "}";
  },
  makeArray: function (type, arrayLength, cb) {
    if (type == null || type === undefined) {
      type = random.index(["Uint8", "Float32"]);
    }
    switch (random.number(8)) {
      case 0:
        var src = "function() { var buffer = new " + type + "Array(" + arrayLength + ");";
        src += utils.script.makeLoop("buffer[i] = " + cb() + ";", arrayLength);
        src += "return buffer;}()";
        return src;
      case 1:
        return "new " + type + "Array([" + make.arrays.filledArray(cb, arrayLength) + "])";
      default:
        return "new " + type + "Array(" + arrayLength + ")";
    }
  },
  randListIndex: function (objName) {
    return random.number() + ' % ' + o.pick(objName) + '.length';
  },
  addElementToBody: function (name) {
    return "(document.body || document.documentElement).appendChild" + utils.script..methodHead([name]);
  },
  forceGC: function () {
    if (platform.isMozilla) {
    }
    if (platform.isChrome) {
      if (window.GCController)
        return GCController.collect();
    }
    if (platform.isSafari) {
    }
    if (platform.isIE) {
    }
  },
  getRandomElement: function () {
    return "document.getElementsByTagName('*')[" + random.number(document.getElementsByTagName("*").length) + "]";
  }
};
