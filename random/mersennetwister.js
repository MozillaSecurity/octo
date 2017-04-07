/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * JavaScript version of Mersenne Twister
 *
 * @author Yasuharu Okada
 *
 */

function MersenneTwister()
{
  const N = 624;
  const M = 397;
  const UPPER_MASK = 0x80000000;
  const LOWER_MASK = 0x7fffffff;
  const MAG01 = new Int32Array([0, 0x9908b0df]);

  var mt = new Int32Array(N);   /* the array for the state vector */
  var mti = 625;

  this.seed = function (s) {
    mt[0] = s | 0;
    for (mti = 1; mti < N; mti++) {
      mt[mti] = Math.imul(1812433253, mt[mti - 1] ^ (mt[mti - 1] >>> 30)) + mti;
    }
  };

  this.export_state = function() {
    return [mt, mti];
  };

  this.import_state = function(s) {
    mt = s[0];
    mti = s[1];
  };

  this.export_mta = function() {
    return mt;
  };

  this.import_mta = function(_mta) {
    mt = _mta;
  };

  this.export_mti = function() {
    return mti;
  };

  this.import_mti = function(_mti) {
    mti = _mti;
  };

  this.int32 = function () {
    var y, kk;

    if (mti >= N) { /* generate N words at one time */
      for (kk = 0; kk < N-M; kk++) {
        y = ((mt[kk] & UPPER_MASK) | (mt[kk+1] & LOWER_MASK));
        mt[kk] = (mt[kk+M] ^ (y >>> 1) ^ MAG01[y & 0x1]);
      }
      for (; kk < N-1; kk++) {
        y = ((mt[kk] & UPPER_MASK) | (mt[kk+1] & LOWER_MASK));
        mt[kk] = (mt[kk+(M-N)] ^ (y >>> 1) ^ MAG01[y & 0x1]);
      }
      y = ((mt[N-1] & UPPER_MASK) | (mt[0] & LOWER_MASK));
      mt[N-1] = (mt[M-1] ^ (y >>> 1) ^ MAG01[y & 0x1]);
      mti = 0;
    }

    y = mt[mti++];

    /* Tempering */
    y = y ^ (y >>> 11);
    y = y ^ ((y << 7) & 0x9d2c5680);
    y = y ^ ((y << 15) & 0xefc60000);
    y = y ^ (y >>> 18);

    return y;
  };

  this.real2 = function () {
    return this.int32() * (1.0 / 4294967296.0);
  }
}

try{ module.exports.MersenneTwister = MersenneTwister; }catch(e){}
