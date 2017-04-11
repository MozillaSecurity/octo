QUnit.test("MersenneTwister test uniform distribution", function(assert) {
  const N = Math.pow(2, 17), expected = N * 1.35;
  let mt = new MersenneTwister();
  mt.seed(new Date().getTime());
  let data = new Uint32Array(N);
  for (let i = 0; i < data.length; ++i) {
    data[i] = mt.int32();
  }
  for (let sh = 0; sh <= 24; ++sh) {
    let bins = new Uint32Array(256);
    for (let b of data) {
      ++bins[(b >>> sh) & 0xFF];
    }
    let variance = bins.reduce(function(a, v){ return a + Math.pow(v - N / bins.length, 2); }, 0);
    assert.ok(variance < expected, "Expecting variance to be under " + expected + ", got " + variance);
  }
});

QUnit.test("MersenneTwister test float distribution", function(assert) {
  const N = Math.pow(2, 17), expected = N * 1.3;
  let mt = new MersenneTwister();
  mt.seed(new Date().getTime());
  let bins = new Uint32Array(512);
  for (let i = 0; i < N; ++i) {
    ++bins[(mt.real2() * bins.length) >>> 0];
  }
  let variance = bins.reduce(function(a, v){ return a + Math.pow(v - N / bins.length, 2); }, 0);
  assert.ok(variance < expected, "Expecting variance to be under " + expected + ", got " + variance);
});
