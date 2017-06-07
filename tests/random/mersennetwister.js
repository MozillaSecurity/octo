/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

QUnit.test("MersenneTwister test uniform distribution", function(assert) {
  const N = Math.pow(2, 18), TRIES = 10, XSQ = 293.25; // quantile of chi-square dist. k=255, p=.05
  let mt = new MersenneTwister();
  mt.seed(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let data = new Uint32Array(N), sh;
    for (let i = 0; i < data.length; ++i) {
      data[i] = mt.int32();
    }
    for (sh = 0; sh <= 24; ++sh) {
      let bins = new Uint32Array(256);
      for (let b of data) {
        ++bins[(b >>> sh) & 0xFF];
      }
      let xsq = bins.reduce(function(a, v){ let e = N / bins.length; return a + Math.pow(v - e, 2) / e; }, 0);
      /*
       * XSQ = scipy.stats.chi2.isf(.05, 255)
       * if xsq > XSQ, the result is biased at 95% significance
       */
      if (xsq >= XSQ)
        break;
      assert.ok(true, "Expected x^2 to be < " + XSQ + ", got " + xsq + " on attempt #" + (attempt + 1));
    }
    if (sh == 25) {
      return;
    }
  }
  assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ);
});

QUnit.test("MersenneTwister test float distribution", function(assert) {
  const N = Math.pow(2, 18), TRIES = 3, XSQ = 564.7; // quantile of chi-square dist. k=511, p=.05
  let tries = [], mt = new MersenneTwister();
  mt.seed(Math.random() * 0x100000000);
  for (let attempt = 0; attempt < TRIES; ++attempt) {
    let bins = new Uint32Array(512);
    for (let i = 0; i < N; ++i) {
      let tmp = (mt.real2() * bins.length) >>> 0;
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
