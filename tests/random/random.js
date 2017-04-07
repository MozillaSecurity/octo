let MT;
try { MT = require("../../random/mersennetwister.js"); } catch(e) { MT = window; }

QUnit.test("Random.init() with no seed value", function() {
  Random.init();
  ok(Random.seed, "random seed is not null.");
});

QUnit.test("Random.init() with provided seed", function() {
  var seed = new Date().getTime();
  Random.init(seed);
  assert.equal(Random.seed, seed, "seed is correct");
});

QUnit.test("Random.range() PRNG reproducibility", function() {
  var seed, result1, result2;
  seed = new Date().getTime();
  Random.init(seed);
  result1 = Random.range(1, 20);
  Random.init(seed);
  result2 = Random.range(1, 20);
  assert.equal(result1, result2, "both results are the same")
});

QUinit.test("Random.choose() with equal distribution", function() {
  var i, tmp, foo = 0, bar = 0;
  for(i = 0; i < 100; i++) {
    tmp = Random.choose([[1, 'foo'], [1, 'bar']]);
    if (tmp == "foo") { foo += 1; }
    if (tmp == "bar") { bar += 1; }
  }
  assert.ok(bar > 0 && foo > 0, "both objects were chosen")
});
