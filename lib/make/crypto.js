/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.crypto = {
  keygenAlgorithm: () => {
    const keygenAlgorithms = [
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1])
      }
    ]
    return random.pick(keygenAlgorithms)
  }
}
