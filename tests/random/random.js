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

QUnit.test("random.range() PRNG reproducibility", function(assert) {
  let seed, result1, result2;
  seed = new Date().getTime();
  random.init(seed);
  result1 = random.range(1, 20);
  random.init(seed);
  result2 = random.range(1, 20);
  assert.equal(result1, result2, "both results are the same")
});

QUnit.test("random.choose() with equal distribution", function(assert) {
  let foo = 0, bar = 0;
  random.init(new Date().getTime());
  for (let i = 0; i < 100; ++i) {
    let tmp = random.choose([[1, 'foo'], [1, 'bar']]);
    if (tmp == "foo") { foo += 1; }
    if (tmp == "bar") { bar += 1; }
  }
  assert.ok(bar > 0 && foo > 0, "both objects were chosen")
});
