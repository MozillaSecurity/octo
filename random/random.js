var random = {
  twister: null,

  init: function (seed) {
    if (seed == null || seed === undefined) {
      seed = new Date().getTime();
    }
    this.twister = new MersenneTwister();
    this.twister.seed(seed);
  },
  number: function (limit) {
    // Returns an integer in [0, limit]. Uniform distribution.
    if (limit == 0) {
      return limit;
    }
    if (limit == null || limit === undefined) {
      limit = 0xffffffff;
    }
    return (this.twister.int32() >>> 0) % limit;
  },
  float: function () {
    // Returns a float in [0, 1]. Uniform distribution.
    return this.twister.real2() >>> 0;
  },
  range: function (start, limit) {
    // Returns an integer in [start, limit]. Uniform distribution.
    if (isNaN(start) || isNaN(limit)) {
      Utils.traceback();
      throw new TypeError("random.range() received a non number type: '" + start + "', '" + limit + "')");
    }
    return random.number(limit - start + 1) + start;
  },
  ludOneTo: function(limit) {
    // Returns a float in [1, limit]. The logarithm has uniform distribution.
    return Math.exp(random.float() * Math.log(limit));
  },
  item: function (list) {
    if (!(list instanceof Array || (typeof list != "string" && "length" in list))) {
      Utils.traceback();
      throw new TypeError("random.index() received a non array type: '" + list + "'");
    }
    return list[this.number(list.length)];
  },
  key: function (obj) {
    var list = [];
    for (var i in obj) {
      list.push(i);
    }
    return this.index(list);
  },
  bool: function () {
    return this.index([true, false]);
  },
  pick: function (obj) {
    if (typeof obj == "function") {
      return obj();
    }
    if (obj instanceof Array) {
      return this.pick(this.index(obj));
    }
    return obj;
  },
  chance: function (limit) {
    if (limit == null || limit === undefined) {
      limit = 2;
    }
    if (isNaN(limit)) {
      Utils.traceback();
      throw new TypeError("random.chance() received a non number type: '" + limit + "'");
    }
    return this.number(limit) == 1;
  },
  choose: function (list, flat) {
    if (!(list instanceof Array)) {
      Utils.traceback();
      throw new TypeError("random.choose() received a non-array type: '" + list + "'");
    }
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      total += list[i][0];
    }
    var n = this.number(total);
    for (var i = 0; i < list.length; i++) {
      if (n < list[i][0]) {
        if (flat == true) {
          return list[i][1];
        } else {
          return this.pick([list[i][1]]);
        }
      }
      n = n - list[i][0];
    }
    if (flat == true) {
      return list[0][1];
    }
    return this.pick([list[0][1]]);
  },
  weighted: function (wa) {
    // More memory-hungry but hopefully faster than random.choose$flat
    var a = [];
    for (var i = 0; i < wa.length; ++i) {
      for (var j = 0; j < wa[i].w; ++j) {
        a.push(wa[i].v);
      }
    }
    return a;
  },
  use: function (obj) {
    return random.bool() ? obj : "";
  },
  shuffle: function (arr) {
    var len = arr.length;
    var i = len;
    while (i--) {
      var p = random.number(i + 1);
      var t = arr[i];
      arr[i] = arr[p];
      arr[p] = t;
    }
  },
  shuffled: function (arr) {
    var newArray = arr.slice();
    random.shuffle(newArray);
    return newArray;
  },
  some: function (list, limit) {
    if (!(list instanceof Array)) {
      Utils.traceback();
      throw new TypeError("random.some() received a non-array type: '" + list + "'");
    }
    if (typeof limit == 'number') {
      limit = this.range(0, list.length);
    }
    var result = [];
    for (var i = 0; i < limit; i++) {
      result.push(this.pick(list));
    }
    return result;
  }
};
