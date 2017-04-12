/*
QUnit.test("random.init() with no seed value", function(assert) {
  random.init();
  assert.ok(random.seed, "random seed is not null.");
});

QUnit.test("random.init() with provided seed", function(assert) {
  let seed = new Date().getTime();
  random.init(seed);
  assert.equal(random.seed, seed, "seed is correct");
});
*/

QUnit.test("random.init() is required", function(assert) {
  assert.throws(random.number, /undefined/, "twister is uninitialized");
  random.init(1);
  random.number();
});

QUnit.test("random.number() corner cases", function(assert) {
  random.init(new Date().getTime());
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
  for (let i = 0; i < 12; ++i)
    sum |= random.number();
  assert.equal(sum>>>0, 0xFFFFFFFF);
});

QUnit.test("random.float() uniform distribution", function(assert) {
  const N = Math.pow(2, 17), expected = N * 2;
  random.init(new Date().getTime());
  let bins = new Uint32Array(512), tmp;
  for (let i = 0; i < N; ++i) {
    tmp = (random.float() * bins.length) >>> 0;
    if (tmp >= bins.length) throw "random.float() >= 1.0";
    ++bins[tmp];
  }
  let variance = bins.reduce(function(a, v){ return a + Math.pow(v - N / bins.length, 2); }, 0);
  assert.ok(variance < expected, "Expecting variance to be under " + expected + ", got " + variance);
});

QUnit.test("random.range() uniform distribution", function(assert) {
  const N = 10000, expected = N * 2;
  let bins = new Uint32Array(50), tmp;
  random.init(new Date().getTime());
  for (let i = 0; i < N; ++i) {
    tmp = random.range(0, bins.length - 1);
    if (tmp >= bins.length) throw "random.range() > upper bound";
    ++bins[tmp];
  }
  let variance = bins.reduce(function(a, v){ return a + Math.pow(v - N / bins.length, 2); }, 0);
  assert.ok(variance < expected, "Expecting variance to be under " + expected + ", got " + variance);
});

QUnit.test("random.range() PRNG reproducibility", function(assert) {
  let seed, result1, result2;
  seed = new Date().getTime();
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

QUnit.test("random.choose() with equal distribution", function(assert) {
  const N = 10000, expected = N * 3;
  let bins = new Uint32Array(3), tmp;
  random.init(new Date().getTime());
  for (let i = 0; i < N; ++i) {
    tmp = random.choose([[1, 0], [1, 1], [1, 2]]);
    if (tmp >= bins.length) throw "random.choose() > upper bound";
    ++bins[tmp];
  }
  let variance = Math.pow(bins[0] - N / 3, 2) + Math.pow(bins[1] - N / 3, 2) + Math.pow(bins[2] - N / 3, 2);
  assert.ok(variance < expected, "Expecting variance to be under " + expected + ", got " + variance + " (" + bins + ")");
});

QUnit.test("random.choose() with unequal distribution", function(assert) {
  const N = 10000, expected = N * 3;
  let bins = new Uint32Array(3), tmp;
  random.init(new Date().getTime());
  for (let i = 0; i < N; ++i) {
    tmp = random.choose([[1, 0], [2, 1], [1, 2]]);
    if (tmp >= bins.length) throw "random.choose() > upper bound";
    ++bins[tmp];
  }
  let variance = Math.pow(bins[0] - N / 4, 2) + Math.pow(bins[1] - N / 2, 2) + Math.pow(bins[2] - N / 4, 2);
  assert.ok(variance < expected, "Expecting variance to be under " + expected + ", got " + variance + " (" + bins + ")");
});

/*
ludOneTo(limit)
item(list)
key(obj)
bool()
pick(obj)
chance(limit)
weighted(wa)
use(obj)
shuffle(arr)
shuffled(arr)
subset(list, limit)
choose(list, flat=true)
pop(arr)
*/
