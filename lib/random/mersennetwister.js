/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * JavaScript version of Mersenne Twister
 *
 * @author Yasuharu Okada
 *
 */

class MersenneTwister {
  constructor () {
    this.N = 624
    this.M = 397
    this.UPPER_MASK = 0x80000000
    this.LOWER_MASK = 0x7fffffff
    this.MAG01 = new Int32Array([0, 0x9908b0df])

    this.mt = new Int32Array(this.N)
    this.mti = 625 // The array for the state vector.
  }

  seed (s) {
    this.mt[0] = s | 0
    for (this.mti = 1; this.mti < this.N; this.mti++) {
      this.mt[this.mti] = Math.imul(1812433253, this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)) + this.mti
    }
  }

  export_state () { // eslint-disable-line camelcase
    return [this.mt, this.mti]
  }

  import_state (s) { // eslint-disable-line camelcase
    this.mt = s[0]
    this.mti = s[1]
  }

  export_mta () { // eslint-disable-line camelcase
    return this.mt
  }

  import_mta (_mta) { // eslint-disable-line camelcase
    this.mt = _mta
  }

  export_mti () { // eslint-disable-line camelcase
    return this.mti
  }

  import_mti (_mti) { // eslint-disable-line camelcase
    this.mti = _mti
  }

  int32 () {
    let y, kk

    if (this.mti >= this.N) { /* generate N words at one time */
      for (kk = 0; kk < this.N - this.M; kk++) {
        y = ((this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK))
        this.mt[kk] = (this.mt[kk + this.M] ^ (y >>> 1) ^ this.MAG01[y & 0x1])
      }
      for (; kk < this.N - 1; kk++) {
        y = ((this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK))
        this.mt[kk] = (this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ this.MAG01[y & 0x1])
      }
      y = ((this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK))
      this.mt[this.N - 1] = (this.mt[this.M - 1] ^ (y >>> 1) ^ this.MAG01[y & 0x1])
      this.mti = 0
    }

    y = this.mt[this.mti++]

    /* Tempering */
    y = y ^ (y >>> 11)
    y = y ^ ((y << 7) & 0x9d2c5680)
    y = y ^ ((y << 15) & 0xefc60000)
    y = y ^ (y >>> 18)

    return y >>> 0
  }

  real2 () {
    return ((this.int32() >>> 5) * 67108864.0 + (this.int32() >>> 6)) / 9007199254740992.0
  }
}

module.exports = MersenneTwister
