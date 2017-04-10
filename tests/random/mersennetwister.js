/* XXX: translate some of the dieharder tests here? */

QUnit.test("MersenneTwister test distribution", function(assert) {
  let mt = new MersenneTwister();
  mt.seed(new Date().getTime());
  for (let i = 0; i < 100; ++i) {
    let a = [], again = false;
    for (let j = 0; j < 10; ++j) {
      a[j] = mt.int32();
    }
    a.sort();
    for (let j = 0; j < (a.length - 1); ++j) {
      if (a[j] === a[j+1]) {
        again = true;
      }
    }
    if (!again) {
      assert.ok(true, "no dupes in 10 entries");
      return;
    }
  }
  assert.ok(false, "could not get unique entries");
});
