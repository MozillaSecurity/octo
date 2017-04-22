utils.common = {
  objToString: function (obj) {
    try {
      return "" + obj
    } catch (e) {
      return "[" + e + "]"
    }
  },
  getAllProperties: function (obj) {
    let list = [];
    while (obj) {
      list = list.concat(Object.getOwnPropertyNames(obj));
      obj = Object.getPrototypeOf(obj);
    }
    return list;
  },
  getKeysFromHash: function (obj) {
    let list = [];
    for (let p in obj) {
      list.push(p);
    }
    return list;
  },
  quote: function (obj) {
    return JSON.stringify(obj);
  },
  shuffle: function (list) {
    let newArray = list.slice();
    let len = newArray.length;
    let i = len;
    while (i--) {
      let p = parseInt(Math.random() * len);
      let t = newArray[i];
      newArray[i] = newArray[p];
      newArray[p] = t;
    }
    return newArray;
  },
  uniqueList: function (list) {
    let tmp = {}, r = [];
    for (let i = 0; i < list.length; i++) {
      tmp[list[i]] = list[i];
    }
    for (let i in tmp) {
      r.push(tmp[i]);
    }
    return r;
  },
  mergeHash: function (obj1, obj2) {
    for (let p in obj2) {
      try {
        if (obj2[p].constructor == Object) {
          obj1[p] = utils.common.mergeHash(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch (e) {
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  },
  traceback: function () {
    Logger.error("===[ Traceback ]");
    try {
      throw new Error();
    } catch (e) {
      Logger.dump(e.stack || e.stacktrace || "");
    }
    Logger.error("===");
  }
};
