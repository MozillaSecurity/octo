utils.script = {
  methodHead: function (list, numOptional) {
    if (isNaN(numOptional)) {
      numOptional = 0;
    }
    var arity = list.length - Random.number(numOptional);
    var params = [];
    for (var i = 0; i < arity; i++) {
      params.push(Random.pick([list[i]]));
    }
    return "(" + params.join(", ") + ")";
  },
  methodCall: function (objectName, methodHash) {
    if(!Utils.getKeysFromHash(methodHash).length || !objectName) {
      return "";
    }
    var methodName = Random.key(methodHash);
    var methodArgs = methodHash[methodName];
    if (typeof(methodArgs) == "function") { // Todo: Hmmmm..
      return methodArgs();
    }
    return objectName + "." + methodName + JS.methodHead(methodArgs);
  },
  setAttribute: function (objectName, attributeHash) {
    if(!Utils.getKeysFromHash(attributeHash).length || !objectName) {
      return "";
    }
    var attributeName = Random.key(attributeHash);
    var attributeValue = Random.pick(attributeHash[attributeName]);
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
    var n = Random.range(0, keys.length);
    while (n--) {
      o[Random.pick(keys)] = Random.pick(values);
    }
    return o;
  },
  makeRandomOptions: function (base_o) {
    var o = {}, unique = Random.some(Object.keys(base_o));
    for (var i = 0; i < unique.length; i++) {
      o[unique[i]] = Random.pick(base_o[unique[i]]);
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
    return "for (var i = 0; i < " + (max || Make.rangeNumber()) + "; i++) {" + s + "}";
  },
  makeArray: function (type, arrayLength, cb) {
    if (type == null || type === undefined) {
      type = Random.index(["Uint8", "Float32"]);
    }
    switch (Random.number(8)) {
      case 0:
        var src = "function() { var buffer = new " + type + "Array(" + arrayLength + ");";
        src += JS.makeLoop("buffer[i] = " + cb() + ";", arrayLength);
        src += "return buffer;}()";
        return src;
      case 1:
        return "new " + type + "Array([" + Make.filledArray(cb, arrayLength) + "])";
      default:
        return "new " + type + "Array(" + arrayLength + ")";
    }
  },
  randListIndex: function (objName) {
    return Random.number() + ' % ' + o.pick(objName) + '.length';
  },
  addElementToBody: function (name) {
    return "(document.body || document.documentElement).appendChild" + JS.methodHead([name]);
  },
  forceGC: function () {
    if (Platform.isMozilla) {}
    if (Platform.isChrome) {
        if (window.GCController)
          return GCController.collect();
    }
    if (Platform.isSafari) {}
    if (Platform.isIE) {}
  },
  getRandomElement: function() {
      return "document.getElementsByTagName('*')[" + Random.number(document.getElementsByTagName("*").length) + "]";
  }
};
