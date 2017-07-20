/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

QUnit.test("random.init() is required", function(assert) {
  assert.throws(random.number, /undefined/, "twister should be uninitialized before random.init()");
  random.init(1);
  random.number();
});

QUnit.test("random.number() corner cases", function(assert) {
  random.init(Math.random() * 0x100000000);
  let sum = 0;
  for (let i = 0; i < 100; ++i)
    sum += random.number(0);
  assert.equal(sum, 0);
  for (let i = 0; i < 100; ++i)
    sum += random.number(1);
  assert.equal(sum, 0);
  let bins = new Uint32Array(2);
  for (let i = 0; i < 100; ++i)
    ++bins[random.number(2)];
  assert.equal(bins[0] + bins[1], 100);
  assert.ok(bins[0] > 20);
  sum = 0;
  for (let i = 0; i < 15; ++i)
    sum |= random.number();
  assert.equal(sum>>>0, 0xFFFFFFFF);
});

QUnit.test("random.number() uniform distribution", function(assert) {
  const N = Math.pow(2, 17), TRIES = 3, XSQ = 564.7; // quantile of chi-square dist. k=511, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(512);
    for (let i = 0; i < N; ++i) {
      let tmp = random.number(bins.length);
      if (tmp >= bins.length) throw "random.number() >= limit";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 511)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.float() uniform distribution", function(assert) {
  const N = Math.pow(2, 17), TRIES = 3, XSQ = 564.7; // quantile of chi-square dist. k=511, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(512);
    for (let i = 0; i < N; ++i) {
      let tmp = (random.float() * bins.length) >>> 0;
      if (tmp >= bins.length) throw "random.float() >= 1.0";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 511)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.range() uniform distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 66.34; // quantile of chi-square dist. k=49, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(50);
    for (let i = 0; i < N; ++i) {
      let tmp = random.range(0, bins.length - 1);
      if (tmp >= bins.length) throw "random.range() > upper bound";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 49)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.range() uniform distribution with offset", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 66.34; // quantile of chi-square dist. k=49, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(50);
    for (let i = 0; i < N; ++i) {
      let tmp = random.range(10, 10 + bins.length - 1) - 10;
      if (tmp < 0) throw "random.range() < lower bound";
      if (tmp >= bins.length) throw "random.range() > upper bound";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 49)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.range() PRNG reproducibility", function(assert) {
  let seed, result1, result2;
  seed = Math.random() * 0x100000000;
  for (let t = 0; t < 50; ++t) {
    random.init(seed);
    result1 = random.range(1, 20);
    for (let i = 0; i < 5; ++i) {
      random.init(seed);
      result2 = random.range(1, 20);
      assert.equal(result1, result2, "both results are the same")
    }
    seed = random.number();
  }
});

QUnit.test("random.ludOneTo() distribution", function(assert) {
  const N = 1e5, TRIES = 3, XSQ = 123.22; // quantile of chi-square dist. k=99, p=.05
  let dist = new Uint32Array(100), tries = [];
  random.init(Math.random() * 0x100000000);
  /* build the ideal distribution for comparison
   * I thought this would be the PDF of the log-normal distribution, but I couldn't get mu & sigma figured out? */
  for (let i = 0; i < (100 * dist.length); ++i) {
    dist[Math.floor(Math.exp(i / (100*dist.length) * Math.log(dist.length)))] += N / (dist.length * 100);
  }
  assert.equal(dist[0], 0);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(dist.length), xsq = 0;
    for (let i = 0; i < N; ++i) {
      let tmp = random.ludOneTo(bins.length)>>>0;
      if (tmp >= bins.length) throw "random.ludOneTo() > upper bound"; // this could happen..
      ++bins[tmp];
    }
    assert.equal(bins[0], 0);
    for (let i = 1; i < bins.length; ++i) {
      xsq += Math.pow(bins[i] - dist[i], 2) / dist[i];
    }
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 99)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.item() exception cases", function(assert) {
  assert.throws(random.item, /received an invalid object/);
  assert.throws(function(){ return random.item(1); }, /received an invalid object/);
  assert.throws(function(){ return random.item("1"); }, /received an invalid object/);
  assert.throws(function(){ return random.item({}); }, /received an invalid object/);
});

QUnit.test("random.item() distribution with list", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.item([99, 100, 101]) - 99;
      if (tmp < 0) throw "random.item() < lower bound";
      if (tmp >= bins.length) throw "random.item() > upper bound";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.key() distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.key({99: 0, 100: 0, 101: 0}) - 99;
      if (tmp < 0) throw "random.key() < lower bound";
      if (tmp >= bins.length) throw "random.key() > upper bound";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.bool() distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 3.84; // quantile of chi-square dist. k=1, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(2);
    for (let i = 0; i < N; ++i) {
      let tmp = random.bool();
      if (tmp === true)
        tmp = 1;
      else if (tmp === false)
        tmp = 0;
      else
        assert.ok(false, "unexpected random.bool() result: " + tmp);
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 1)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.pick() cases", function(assert) {
  random.init(Math.random() * 0x100000000);
  for (let i = 0; i < 100; ++i) {
    let tmp = Math.random();
    assert.equal(tmp, random.pick(tmp));
  }
  for (let i = 0; i < 100; ++i) {
    let tmp = (Math.random() * 100) >>> 0;
    assert.equal(tmp, random.pick(tmp));
  }
  for (let i = 0; i < 100; ++i) {
    let tmp = Math.random() + "";
    assert.equal(tmp, random.pick(tmp));
  }
  for (let i = 0; i < 100; ++i) {
    let tmp = Math.random();
    assert.equal(tmp, random.pick([tmp]));
  }
  for (let i = 0; i < 100; ++i) {
    let tmp = Math.random();
    assert.equal(tmp, random.pick(function(){ return tmp; }));
  }
  for (let i = 0; i < 100; ++i) {
    let tmp = Math.random();
    assert.equal(tmp, random.pick(function(){ return [tmp]; }));
  }
});

QUnit.test("random.pick() with equal distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.pick([0, [1, 1], function(){ return 2; }]);
      if (tmp < 0) throw "random.pick() < lower bound";
      if (tmp >= bins.length) throw "random.pick() > upper bound";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.pick() with unequal distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.pick([[0, 1], [1], function(){ return [2]; }]);
      if (tmp < 0) throw "random.pick() < lower bound";
      if (tmp >= bins.length) throw "random.pick() > upper bound";
      ++bins[tmp];
    }
    let xsq = Math.pow(bins[0] - N / 6, 2) / (N / 6) + Math.pow(bins[1] - N / 2, 2) / (N / 2) + Math.pow(bins[2] - N / 3, 2) / (N / 3);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.chance(2) distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 3.84; // quantile of chi-square dist. k=1, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(2);
    for (let i = 0; i < N; ++i) {
      let tmp = random.chance(2);
      if (tmp === true)
        tmp = 1;
      else if (tmp === false)
        tmp = 0;
      else
        assert.ok(false, "unexpected random.chance() result: " + tmp);
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 1)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.chance(undefined) distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 3.84; // quantile of chi-square dist. k=1, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(2);
    for (let i = 0; i < N; ++i) {
      let tmp = random.chance();
      if (tmp === true)
        tmp = 1;
      else if (tmp === false)
        tmp = 0;
      else
        assert.ok(false, "unexpected random.chance() result: " + tmp);
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 1)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.chance(3) distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 3.84; // quantile of chi-square dist. k=1, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(2);
    for (let i = 0; i < N; ++i) {
      let tmp = random.chance(3);
      if (tmp === true)
        tmp = 0;
      else if (tmp === false)
        tmp = 1;
      else
        assert.ok(false, "unexpected random.chance() result: " + tmp);
      ++bins[tmp];
    }
    let xsq = Math.pow(bins[0] - (N / 3), 2) / (N / 3) + Math.pow(bins[1] - (2 * N / 3), 2) / (2 * N / 3);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 1)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.chance(1000) distribution", function(assert) {
  const N = 1e6, TRIES = 3, XSQ = 3.84; // quantile of chi-square dist. k=1, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(2);
    for (let i = 0; i < N; ++i) {
      let tmp = random.chance(1000);
      if (tmp === true)
        tmp = 0;
      else if (tmp === false)
        tmp = 1;
      else
        assert.ok(false, "unexpected random.chance() result: " + tmp);
      ++bins[tmp];
    }
    let xsq = Math.pow(bins[0] - (N / 1000), 2) / (N / 1000) + Math.pow(bins[1] - (999 * N / 1000), 2) / (999 * N / 1000);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 1)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.choose() with equal distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.choose([[1, 0], [1, 1], [1, 2]]);
      if (tmp >= bins.length) throw "random.choose() > upper bound";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.choose() with unequal distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.choose([[1, 0], [2, 1], [1, 2]]);
      if (tmp >= bins.length) throw "random.choose() > upper bound";
      ++bins[tmp];
    }
    let xsq = Math.pow(bins[0] - N / 4, 2) / (N / 4) + Math.pow(bins[1] - N / 2, 2) / (N / 2) + Math.pow(bins[2] - N / 4, 2) / (N / 4);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.choose() with unequal distribution and pick", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.choose([[1, 0], [2, [1, 2]], [1, function(){ return 2; }]]);
      if (tmp >= bins.length) throw "random.choose() > upper bound";
      ++bins[tmp];
    }
    let xsq = Math.pow(bins[0] - N / 4, 2) / (N / 4) + Math.pow(bins[1] - N / 4, 2) / (N / 4) + Math.pow(bins[2] - N / 2, 2) / (N / 2);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.choose(flat) with unequal distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.choose([[1, 0], [2, 1], [1, 2]], true);
      if (tmp >= bins.length) throw "random.choose() > upper bound";
      ++bins[tmp];
    }
    let xsq = Math.pow(bins[0] - N / 4, 2) / (N / 4) + Math.pow(bins[1] - N / 2, 2) / (N / 2) + Math.pow(bins[2] - N / 4, 2) / (N / 4);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.choose(flat) equal distribution with types not picked", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  const v1 = 1, v2 = [12], v3 = function(){};
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.choose([[1, v1], [1, v2], [1, v3]], true);
      if (tmp === v1)
        tmp = 0;
      else if (tmp === v2)
        tmp = 1;
      else if (tmp === v3)
        tmp = 2;
      else
        assert.ok(false, "unexpected random.choose() result: " + tmp);
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.weighted() with equal distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.item(random.weighted([{w: 1, v: 0}, {w: 1, v: 1}, {w: 1, v: 2}]));
      if (tmp >= bins.length) throw "random.weighted() > upper bound";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.weighted() with unequal distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.item(random.weighted([{w: 1, v: 0}, {w: 2, v: 1}, {w: 1, v: 2}]));
      if (tmp >= bins.length) throw "random.weighted() > upper bound";
      ++bins[tmp];
    }
    let xsq = Math.pow(bins[0] - N / 4, 2) / (N / 4) + Math.pow(bins[1] - N / 2, 2) / (N / 2) + Math.pow(bins[2] - N / 4, 2) / (N / 4);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.weighted() equal distribution with types not picked", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  const v1 = 1, v2 = [12], v3 = function(){};
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    for (let i = 0; i < N; ++i) {
      let tmp = random.item(random.weighted([{w: 1, v: v1}, {w: 1, v: v2}, {w: 1, v: v3}]));
      if (tmp === v1)
        tmp = 0;
      else if (tmp === v2)
        tmp = 1;
      else if (tmp === v3)
        tmp = 2;
      else
        assert.ok(false, "unexpected random.weighted() result: " + tmp);
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.use() distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 3.84; // quantile of chi-square dist. k=1, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(2);
    for (let i = 0; i < N; ++i) {
      let rnd = Math.random(), use = random.use(rnd);
      if (use === rnd)
        use = 1;
      else if (use === "")
        use = 0;
      else
        assert.ok(false, "unexpected random.use() result: " + use);
      ++bins[use];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 1)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.shuffle() distribution", function(assert) {
  const N = 1e4, M = 10, TRIES = 3, XSQ = 123.23; // quantile of chi-square dist. k=M*M-1, p=.05
  // XXX: shouldn't k be M! ?
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(M * M);
    for (let i = 0; i < N; ++i) {
      let array = [];
      for (let j = 0; j < M; ++j)
        array.push(j);
      random.shuffle(array);
      for (let j = 0; j < M; ++j)
        ++bins[j * M + array[j]];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / M; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 99)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.shuffled() distribution", function(assert) {
  const N = 1e4, M = 10, TRIES = 3, XSQ = 123.23; // quantile of chi-square dist. k=M*M-1, p=.05
  // XXX: shouldn't k be M! ?
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(M * M);
    let array_ref = [];
    for (let j = 0; j < M; ++j)
      array_ref.push(j);
    for (let i = 0; i < N; ++i) {
      let array = random.shuffled(array_ref);
      for (let j = 0; j < M; ++j) {
        ++bins[j * M + array[j]];
        if (array_ref[j] !== j)
          throw "array modified";
      }
    }
    let xsq = bins.reduce(function(a, v){ let e = N / M; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 99)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});

QUnit.test("random.subset() with equal distribution", function(assert) {
  /*
   * this doesn't specify limit, so length distribution should be even, and selections should be even within each length
   */
  const N = 1e4, M = 3, TRIES = 3, B0_XSQ = 5.99, B1_XSQ = 15.51, B2_XSQ = 38.89, LEN_XSQ = 7.81; // quantile of chi-square dist. k=[2,8,26,3], p=.05
  let bin0_xsq, bin1_xsq, bin2_xsq, length_xsq;
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = [new Uint32Array(3), new Uint32Array(9), new Uint32Array(27)], lengths = new Uint32Array(M+1);
    for (let i = 0; i < N; ++i) {
      let tmp = random.subset([0, [1, 1], function(){ return 2; }]);
      if (tmp.length > M) throw "random.subset() result length > input";
      ++lengths[tmp.length];
      if (tmp.length)
        ++bins[tmp.length-1][tmp.reduce(function(a, v){ return a * 3 + v; }, 0)];
    }
    bin0_xsq = bins[0].reduce(function(a, v){ let e = N / (M + 1) / Math.pow(M, 1); return a + Math.pow(v - e, 2) / e; }, 0);
    bin1_xsq = bins[1].reduce(function(a, v){ let e = N / (M + 1) / Math.pow(M, 2); return a + Math.pow(v - e, 2) / e; }, 0);
    bin2_xsq = bins[2].reduce(function(a, v){ let e = N / (M + 1) / Math.pow(M, 3); return a + Math.pow(v - e, 2) / e; }, 0);
    length_xsq = lengths.reduce(function(a, v){ let e = N / (M + 1); return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (bin0_xsq < B0_XSQ && bin1_xsq < B1_XSQ && bin2_xsq < B2_XSQ && length_xsq < LEN_XSQ) {
      assert.ok(true, "Expected lengths x^2 to be < " + LEN_XSQ + ", got " + length_xsq + " on attempt #" + (attempt + 1));
      assert.ok(true, "Expected length=1 x^2 to be < " + B0_XSQ + ", got " + bin0_xsq + " on attempt #" + (attempt + 1));
      assert.ok(true, "Expected length=2 x^2 to be < " + B1_XSQ + ", got " + bin1_xsq + " on attempt #" + (attempt + 1));
      assert.ok(true, "Expected length=3 x^2 to be < " + B2_XSQ + ", got " + bin2_xsq + " on attempt #" + (attempt + 1));
      return;
    }
  }
  console.log("Expected lengths x^2 to be < " + LEN_XSQ + ", got " + length_xsq);
  console.log("Expected length=1 x^2 to be < " + B0_XSQ + ", got " + bin0_xsq);
  console.log("Expected length=2 x^2 to be < " + B1_XSQ + ", got " + bin1_xsq);
  console.log("Expected length=3 x^2 to be < " + B2_XSQ + ", got " + bin2_xsq);
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq low enough");
});

QUnit.test("random.subset(limit) with equal distribution", function(assert) {
  /*
   * limit is specified, so length should always == limit, and selections should be even
   */
  const N = 1e4, M = 3, TRIES = 3, B0_XSQ = 5.99, B1_XSQ = 15.51, B2_XSQ = 38.89, B3_XSQ = 101.88; // quantile of chi-square dist. k=[2,8,26,80], p=.05
  let bin0_xsq, bin1_xsq, bin2_xsq, bin3_xsq;
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < 100; ++attempt) {
    if (random.subset([1,2,3], 0).length !== 0) throw "random.subset(..., 0) returned non-empty array";
  }
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = [new Uint32Array(3), new Uint32Array(9), new Uint32Array(27), new Uint32Array(81)];
    for (let i = 0; i < N; ++i) {
      let tmp = random.subset([0, 1, 2], 1);
      if (tmp.length !== 1) throw "random.subset() result length != limit";
      ++bins[0][tmp.reduce(function(a, v){ return a * 3 + v; }, 0)];
      tmp = random.subset([0, 1, 2], 2);
      if (tmp.length !== 2) throw "random.subset() result length != limit";
      ++bins[1][tmp.reduce(function(a, v){ return a * 3 + v; }, 0)];
      tmp = random.subset([0, 1, 2], 3);
      if (tmp.length !== 3) throw "random.subset() result length != limit";
      ++bins[2][tmp.reduce(function(a, v){ return a * 3 + v; }, 0)];
      tmp = random.subset([0, 1, 2], 4);
      if (tmp.length !== 4) throw "random.subset() result length != limit";
      ++bins[3][tmp.reduce(function(a, v){ return a * 3 + v; }, 0)];
    }
    bin0_xsq = bins[0].reduce(function(a, v){ let e = N / Math.pow(M, 1); return a + Math.pow(v - e, 2) / e; }, 0);
    bin1_xsq = bins[1].reduce(function(a, v){ let e = N / Math.pow(M, 2); return a + Math.pow(v - e, 2) / e; }, 0);
    bin2_xsq = bins[2].reduce(function(a, v){ let e = N / Math.pow(M, 3); return a + Math.pow(v - e, 2) / e; }, 0);
    bin3_xsq = bins[3].reduce(function(a, v){ let e = N / Math.pow(M, 4); return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (bin0_xsq < B0_XSQ && bin1_xsq < B1_XSQ && bin2_xsq < B2_XSQ && bin3_xsq < B3_XSQ) {
      assert.ok(true, "Expected length=1 x^2 to be < " + B0_XSQ + ", got " + bin0_xsq + " on attempt #" + (attempt + 1));
      assert.ok(true, "Expected length=2 x^2 to be < " + B1_XSQ + ", got " + bin1_xsq);
      assert.ok(true, "Expected length=3 x^2 to be < " + B2_XSQ + ", got " + bin2_xsq);
      assert.ok(true, "Expected length=4 x^2 to be < " + B3_XSQ + ", got " + bin3_xsq);
      return;
    }
  }
  console.log("Expected length=1 x^2 to be < " + B0_XSQ + ", got " + bin0_xsq);
  console.log("Expected length=2 x^2 to be < " + B1_XSQ + ", got " + bin1_xsq);
  console.log("Expected length=3 x^2 to be < " + B2_XSQ + ", got " + bin2_xsq);
  console.log("Expected length=4 x^2 to be < " + B3_XSQ + ", got " + bin3_xsq);
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq low enough");
});

QUnit.test("random.pop() distribution", function(assert) {
  const N = 1e4, TRIES = 3, XSQ = 5.99; // quantile of chi-square dist. k=2, p=.05
  let tries = [];
  random.init(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(3);
    const orig = [99, 100, 101];
    for (let i = 0; i < N; ++i) {
      let arr = orig.slice(), tmp = random.pop(arr) - 99;
      if (tmp < 0) throw "random.pop() < lower bound";
      if (tmp >= bins.length) throw "random.pop() > upper bound";
      if (arr.length !== 2) throw "random.pop() did not pop";
      if (arr.reduce(function(a, v){ return a + v; }, tmp) !== 201) throw "random.pop() sum error";
      ++bins[tmp];
    }
    let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
    /*
     * XSQ = scipy.stats.chi2.isf(.05, 2)
     * if xsq > XSQ, the result is biased at 95% significance
     */
    if (xsq < XSQ) {
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
      return;
    }
    tries.push(xsq);
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
});
