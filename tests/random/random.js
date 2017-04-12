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
  assert.throws(random.item, /non array type/);
  assert.throws(function(){ return random.item(1); }, /non array type/);
  assert.throws(function(){ return random.item("1"); }, /non array type/);
  assert.throws(function(){ return random.item({}); }, /non array type/);
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

/*
XXX
pick(obj)
chance(limit)
*/

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

/*
XXX
choose(list, flat=true)
weighted(wa)
use(obj)
shuffle(arr)
shuffled(arr)
subset(list, limit)
pop(arr)
*/
