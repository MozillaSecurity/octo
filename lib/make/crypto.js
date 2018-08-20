/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const random = require('../random')
const make = require('../make')
const utils = require('../utils')

class crypto extends make {
  static get keyFormats () {
    return [
      'raw',
      'spki',
      'pkcs8',
      'jwk'
    ]
  }
  static randomKeyFormat () {
    return random.item(crypto.keyFormats)
  }

  static get keyTypes () {
    return [
      'public',
      'private',
      'secret'
    ]
  }
  static randomKeyType () {
    return random.item(crypto.keyTypes)
  }

  static get keyUsages () {
    return [
      'encrypt',
      'decrypt',
      'sign',
      'verify',
      'deriveKey',
      'deriveBits',
      'wrapKey',
      'unwrapKey'
    ]
  }

  static randomKeyUsage () {
    return random.subset(crypto.keyUsages)
  }

  static get curves () {
    return [
      'P-256',
      'P-384',
      'P-521'
    ]
  }

  static randomCurve () {
    return random.item(crypto.curves)
  }

  static get jwkUsages () {
    return [
      'enc',
      'sig'
    ]
  }

  static randomJwkUsage () {
    return random.subset(crypto.keyUsages)
  }

  static get jwkKeyTypes () {
    return [
      'oct',
      'RSA',
      'EC'
    ]
  }

  static randomJwkKeyType () {
    return random.subset(crypto.jwkKeyTypes)
  }

  static get algorithmNames () {
    // https://www.w3.org/TR/WebCryptoAPI/#algorithm-overview
    return {
      sign: [
        'RSASSA-PKCS1-v1_5',
        'RSA-PSS',
        'ECDSA',
        'HMAC'
      ],
      verify: [
        'RSASSA-PKCS1-v1_5',
        'RSA-PSS',
        'ECDSA',
        'HMAC'
      ],
      generateKey: [
        'RSASSA-PKCS1-v1_5',
        'RSA-PSS',
        'RSA-OAEP',
        'ECDSA',
        'ECDH',
        'AES-CTR',
        'AES-CBC',
        'AES-GCM',
        'AES-KW',
        'HMAC'
      ],
      importKey: [
        'RSASSA-PKCS1-v1_5',
        'RSA-PSS',
        'RSA-OAEP',
        'ECDSA',
        'ECDH',
        'AES-CTR',
        'AES-CBC',
        'AES-GCM',
        'AES-KW',
        'HMAC',
        'HKDF',
        'PBKDF2'
      ],
      exportKey: [
        'RSASSA-PKCS1-v1_5',
        'RSA-PSS',
        'RSA-OAEP',
        'ECDSA',
        'ECDH',
        'AES-CTR',
        'AES-CBC',
        'AES-GCM',
        'AES-KW',
        'HMAC'
      ],
      encrypt: [
        'RSA-OAEP',
        'AES-CTR',
        'AES-CBC',
        'AES-GCM'
      ],
      decrypt: [
        'RSA-OAEP',
        'AES-CTR',
        'AES-CBC',
        'AES-GCM'
      ],
      deriveBits: [
        'ECDH',
        'HKDF',
        'PBKDF2'
      ],
      deriveKey: [
        'ECDH',
        'HKDF',
        'PBKDF2'
      ],
      wrapKey: [
        'RSA-OAEP',
        'AES-CTR',
        'AES-CBC',
        'AES-GCM',
        'AES-KW'
      ],
      unwrapKey: [
        'RSA-OAEP',
        'AES-CTR',
        'AES-CBC',
        'AES-GCM',
        'AES-KW'
      ],
      digest: [
        'SHA-1',
        'SHA-256',
        'SHA-384',
        'SHA-512'
      ]
    }
  }

  static randomAlgorithmName (method) {
    return random.item(crypto.algorithmNames[method])
  }

  static randomDigestName () {
    return random.item(crypto.algorithmNames.digest)
  }

  static get algorithms () {
    return {
      /* (Unsupported as of 30/01/2017)
      -------------------------------
      |          | Firefox | Chrome |
      ----------------------------- |
      | AES-CMAC |   x    |    x    |
      | AES-CFB  |   x    |    x    |
      | CONCAT   |   x    |    x    |
      | HKDF-CTR |   x    |    x    |
      | DH       |        |    x    |
      -------------------------------
      */
      'RSASSA-PKCS1-v1_5': {
        // RSASA-PKCS1_v1_5 algorithm, using a SHA hash function.
        keyUsages: ['sign', 'verify'],
        length: function (len) {
          return len || random.item([1, 256, 384, 512])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'RSASSA-PKCS1-v1_5',
            hash: {
              name: 'SHA-${this.length(len)}'
            },
            modulusLength: ${random.item([1024, 2048, 4096])},
            publicExponent: new Uint8Array([0x01, 0x00, 0x01])
          }`)
        },
        jwk: function (len) {
          return utils.common.mockup(`{
            kty: 'RSA',
            alg: 'RS${this.length(len)}'
          }`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        sign: function () {
          return this.alg()
        },
        verify: function () {
          return this.alg()
        },
        presets: {
          raw: {},
          jwk: [
            {
              kty: 'RSA',
              e: 'AQAB',
              n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
              alg: 'RS256',
              ext: true
            },
            {
              kty: 'RSA',
              e: 'AQAB',
              d: 'n_dIVw9MD_04lANi5KnKJPoRfxKy7cGHYLG0hU5DGpsFNfx2yH0Uz9j8uU7ZARai1iHECBxcxhpi3wbckQtjmbkCUKvs4G0gKLT9UuNHcCbh0WfvadfPPec52n4z6s4zwisbgWCNbT2L-SyHt1yuFmLAYXkg0swk3y5Bt_ilA8E',
              dp: '2RNM_uiYEQMcATQaUu3AwdeJpenCPykbQHkwAylvXqlHB6W7m5XX0k-SutkbXAijmGTC-Oh8NexsLGHxOACb8Q',
              dq: 'rHabkI3_XVGieLqHujpWaWe9YD03fJY0KbbQX0fIoNdNU4GcmUftzIWLSajPKKsiyfR6Xk2AEtBmBPE5qaoV6Q',
              n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
              p: '5Y4ynodegqC9kgGmfZeSrojGmLyYR8HIvKVEAIjjMUQjyvKWpWsXfPg67mTdqVpjSpQLQlRfES2nUvZ27KrU6Q',
              q: '0hd_U9PcNpMe77nhsTgoVNgMB34cqfrfu4fPuJ-7NvvMkKIELDLy-m8qg1MBbgf2i5546A9B5Exsuj4D2Vwz2Q',
              qi: 'R3CkCGVAESy_hChmDvUaLMT-R1xk6kK7RLIUQKXATPQbnDqWBMgm-vcawFVhKJ-ICJsPfmRUsv7Wt1bJ01wLGQ',
              alg: 'RS256',
              ext: true
            }
          ],
          spki: 'new Uint8Array([48, 129, 159, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 129, 141, 0, 48, 129, 137, 2, 129, 129, 0, 182, 93, 35, 213, 252, 204, 20, 103, 91, 238, 105, 199, 53, 114, 24, 221, 114, 210, 137, 173, 88, 76, 205, 113, 148, 148, 79, 80, 59, 208, 60, 75, 231, 248, 78, 125, 12, 30, 237, 226, 63, 146, 157, 203, 239, 60, 138, 123, 234, 50, 23, 174, 216, 33, 122, 16, 53, 246, 140, 254, 75, 246, 205, 204, 117, 204, 115, 29, 178, 102, 139, 201, 74, 177, 45, 131, 183, 166, 234, 61, 124, 75, 110, 3, 70, 202, 148, 95, 45, 228, 94, 95, 148, 2, 162, 79, 146, 137, 29, 189, 102, 75, 207, 214, 116, 58, 63, 171, 219, 27, 5, 9, 108, 16, 218, 23, 169, 43, 181, 119, 31, 172, 95, 205, 180, 18, 255, 203, 2, 3, 1, 0, 1])',
          pkcs8: 'new Uint8Array([48, 130, 2, 118, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 2, 96, 48, 130, 2, 92, 2, 1, 0, 2, 129, 129, 0, 217, 78, 147, 218, 221, 152, 10, 66, 75, 127, 242, 108, 182, 142, 157, 44, 93, 58, 176, 193, 135, 103, 216, 179, 69, 72, 38, 115, 144, 244, 12, 139, 0, 245, 48, 115, 204, 234, 158, 193, 231, 127, 178, 240, 244, 203, 35, 229, 203, 245, 110, 215, 199, 19, 98, 183, 164, 223, 159, 203, 128, 123, 173, 26, 12, 172, 250, 99, 254, 35, 225, 221, 39, 51, 62, 3, 139, 35, 38, 164, 71, 238, 240, 73, 139, 214, 68, 172, 204, 253, 171, 244, 14, 186, 152, 159, 225, 133, 229, 140, 99, 50, 183, 242, 217, 248, 86, 233, 20, 117, 42, 136, 55, 8, 65, 124, 244, 65, 29, 15, 194, 255, 78, 31, 189, 146, 105, 161, 2, 3, 1, 0, 1, 2, 129, 128, 26, 88, 13, 82, 166, 52, 141, 97, 214, 23, 79, 195, 96, 42, 79, 225, 149, 247, 204, 127, 217, 179, 124, 48, 215, 128, 84, 177, 3, 236, 162, 44, 163, 212, 21, 168, 164, 57, 249, 63, 22, 154, 131, 141, 244, 143, 63, 237, 214, 217, 13, 51, 249, 125, 95, 37, 86, 70, 137, 239, 184, 198, 197, 136, 62, 183, 41, 78, 118, 234, 57, 195, 161, 219, 173, 234, 61, 11, 165, 109, 209, 9, 3, 22, 186, 114, 32, 135, 147, 74, 6, 106, 190, 214, 36, 208, 32, 220, 61, 12, 41, 105, 251, 247, 18, 159, 3, 198, 28, 228, 36, 44, 189, 125, 45, 72, 233, 199, 12, 72, 91, 106, 165, 246, 217, 58, 168, 53, 2, 65, 0, 241, 112, 53, 166, 98, 11, 38, 73, 58, 156, 84, 190, 118, 74, 247, 229, 85, 178, 83, 231, 53, 137, 237, 228, 246, 12, 32, 206, 157, 198, 152, 70, 11, 185, 234, 30, 112, 23, 115, 249, 68, 176, 159, 108, 247, 249, 207, 152, 145, 166, 246, 79, 176, 219, 163, 111, 243, 4, 49, 3, 239, 242, 63, 147, 2, 65, 0, 230, 105, 200, 1, 208, 201, 237, 225, 85, 27, 39, 216, 193, 1, 253, 168, 88, 15, 242, 166, 70, 106, 235, 2, 92, 24, 130, 66, 176, 176, 220, 238, 66, 12, 159, 26, 24, 40, 19, 213, 138, 98, 238, 98, 220, 65, 148, 116, 146, 21, 0, 25, 6, 177, 57, 216, 70, 51, 149, 244, 157, 153, 106, 123, 2, 64, 127, 92, 254, 48, 67, 80, 54, 102, 50, 240, 253, 19, 108, 59, 168, 1, 230, 239, 39, 171, 180, 102, 138, 132, 89, 247, 147, 230, 234, 252, 52, 159, 222, 215, 184, 85, 78, 52, 81, 13, 145, 218, 202, 127, 37, 97, 54, 205, 249, 39, 230, 143, 171, 112, 114, 11, 64, 91, 89, 176, 6, 7, 248, 217, 2, 65, 0, 220, 94, 95, 132, 29, 4, 132, 22, 247, 38, 185, 189, 125, 27, 66, 87, 55, 162, 73, 24, 238, 80, 99, 228, 37, 224, 234, 244, 141, 185, 26, 20, 101, 231, 92, 99, 192, 166, 212, 17, 112, 1, 158, 173, 190, 170, 154, 41, 195, 109, 130, 98, 109, 28, 35, 142, 205, 213, 152, 158, 19, 253, 30, 241, 2, 64, 15, 148, 8, 16, 189, 122, 55, 109, 203, 175, 173, 24, 222, 36, 130, 130, 179, 87, 189, 32, 141, 149, 30, 115, 211, 227, 79, 234, 78, 202, 253, 48, 173, 95, 167, 203, 20, 193, 160, 30, 146, 33, 109, 4, 221, 25, 212, 216, 183, 100, 18, 46, 184, 52, 65, 146, 249, 68, 225, 10, 84, 38, 98, 133])'
        }
      },
      'RSA-PSS': {
        keyUsages: ['sign', 'verify'],
        length: function (len) {
          return len || random.item([1, 256, 384, 512])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'RSA-PSS',
            hash: {
              name: 'SHA-${this.length(len)}'
            },
            modulusLength: ${random.item([1024, 2048, 4096])},
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            saltLength: 8
          }`)
        },
        jwk: function (len) {
          return utils.common.mockup(`{
            kty: 'RSA',
            alg: 'PS${this.length(len)}'
          }`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        sign: function () {
          return this.alg()
        },
        verify: function () {
          return this.alg()
        },
        presets: {
          raw: {},
          jwk: [
            {
              kty: 'RSA',
              e: 'AQAB',
              n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
              alg: 'RS256',
              ext: true
            },
            {
              kty: 'RSA',
              e: 'AQAB',
              d: 'n_dIVw9MD_04lANi5KnKJPoRfxKy7cGHYLG0hU5DGpsFNfx2yH0Uz9j8uU7ZARai1iHECBxcxhpi3wbckQtjmbkCUKvs4G0gKLT9UuNHcCbh0WfvadfPPec52n4z6s4zwisbgWCNbT2L-SyHt1yuFmLAYXkg0swk3y5Bt_ilA8E',
              dp: '2RNM_uiYEQMcATQaUu3AwdeJpenCPykbQHkwAylvXqlHB6W7m5XX0k-SutkbXAijmGTC-Oh8NexsLGHxOACb8Q',
              dq: 'rHabkI3_XVGieLqHujpWaWe9YD03fJY0KbbQX0fIoNdNU4GcmUftzIWLSajPKKsiyfR6Xk2AEtBmBPE5qaoV6Q',
              n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
              p: '5Y4ynodegqC9kgGmfZeSrojGmLyYR8HIvKVEAIjjMUQjyvKWpWsXfPg67mTdqVpjSpQLQlRfES2nUvZ27KrU6Q',
              q: '0hd_U9PcNpMe77nhsTgoVNgMB34cqfrfu4fPuJ-7NvvMkKIELDLy-m8qg1MBbgf2i5546A9B5Exsuj4D2Vwz2Q',
              qi: 'R3CkCGVAESy_hChmDvUaLMT-R1xk6kK7RLIUQKXATPQbnDqWBMgm-vcawFVhKJ-ICJsPfmRUsv7Wt1bJ01wLGQ',
              alg: 'PS256',
              ext: true
            }
          ],
          spki: 'new Uint8Array([48, 129, 159, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 129, 141, 0, 48, 129, 137, 2, 129, 129, 0, 180, 31, 227, 200, 37, 227, 65, 238, 23, 91, 226, 130, 51, 32, 165, 245, 1, 24, 244, 5, 184, 42, 181, 155, 23, 142, 249, 220, 222, 131, 175, 54, 117, 135, 64, 232, 120, 90, 160, 221, 18, 31, 200, 41, 23, 174, 18, 172, 247, 166, 90, 37, 156, 229, 2, 70, 169, 165, 93, 246, 120, 117, 59, 202, 3, 102, 44, 119, 154, 54, 28, 198, 111, 39, 144, 73, 69, 251, 179, 74, 41, 215, 115, 186, 124, 200, 105, 75, 104, 158, 156, 158, 238, 214, 14, 81, 95, 130, 155, 146, 114, 125, 88, 158, 212, 44, 65, 236, 228, 194, 105, 96, 211, 155, 60, 71, 134, 90, 151, 202, 68, 20, 228, 105, 249, 202, 170, 155, 2, 3, 1, 0, 1])',
          plcs8: 'new Uint8Array([48, 130, 2, 119, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 2, 97, 48, 130, 2, 93, 2, 1, 0, 2, 129, 129, 0, 180, 31, 227, 200, 37, 227, 65, 238, 23, 91, 226, 130, 51, 32, 165, 245, 1, 24, 244, 5, 184, 42, 181, 155, 23, 142, 249, 220, 222, 131, 175, 54, 117, 135, 64, 232, 120, 90, 160, 221, 18, 31, 200, 41, 23, 174, 18, 172, 247, 166, 90, 37, 156, 229, 2, 70, 169, 165, 93, 246, 120, 117, 59, 202, 3, 102, 44, 119, 154, 54, 28, 198, 111, 39, 144, 73, 69, 251, 179, 74, 41, 215, 115, 186, 124, 200, 105, 75, 104, 158, 156, 158, 238, 214, 14, 81, 95, 130, 155, 146, 114, 125, 88, 158, 212, 44, 65, 236, 228, 194, 105, 96, 211, 155, 60, 71, 134, 90, 151, 202, 68, 20, 228, 105, 249, 202, 170, 155, 2, 3, 1, 0, 1, 2, 129, 128, 102, 251, 236, 161, 220, 119, 168, 148, 86, 42, 164, 192, 200, 54, 156, 108, 14, 42, 148, 42, 72, 247, 178, 73, 112, 24, 192, 230, 245, 25, 217, 45, 139, 216, 190, 213, 171, 42, 53, 218, 239, 167, 216, 43, 22, 108, 226, 36, 158, 155, 47, 227, 93, 102, 217, 252, 72, 182, 81, 152, 191, 154, 87, 137, 219, 194, 236, 53, 200, 123, 61, 10, 59, 231, 41, 18, 116, 77, 148, 50, 170, 116, 221, 110, 170, 190, 158, 108, 217, 38, 73, 84, 183, 51, 122, 179, 217, 143, 255, 87, 82, 80, 223, 188, 84, 134, 146, 150, 169, 64, 30, 168, 104, 8, 123, 162, 46, 59, 47, 232, 0, 35, 202, 42, 195, 141, 6, 1, 2, 65, 0, 237, 171, 148, 110, 241, 19, 152, 216, 206, 77, 109, 215, 21, 144, 110, 96, 34, 61, 46, 214, 148, 70, 238, 119, 206, 128, 32, 24, 136, 197, 185, 254, 209, 35, 235, 231, 122, 246, 167, 183, 117, 176, 51, 133, 169, 47, 130, 178, 40, 225, 145, 219, 48, 56, 21, 46, 198, 18, 85, 218, 194, 150, 141, 27, 2, 65, 0, 194, 4, 41, 152, 43, 246, 147, 7, 229, 244, 215, 110, 143, 7, 184, 187, 22, 166, 113, 217, 81, 52, 205, 54, 73, 202, 244, 24, 24, 219, 254, 243, 230, 230, 212, 172, 225, 218, 112, 95, 118, 103, 144, 223, 248, 164, 19, 228, 204, 204, 64, 91, 76, 77, 4, 206, 89, 173, 154, 162, 134, 113, 176, 129, 2, 64, 58, 4, 78, 97, 158, 155, 200, 13, 244, 158, 86, 23, 208, 253, 198, 211, 212, 199, 214, 173, 46, 216, 249, 209, 105, 41, 65, 172, 123, 134, 184, 214, 137, 59, 25, 149, 18, 33, 47, 227, 202, 232, 206, 74, 236, 119, 218, 145, 159, 5, 33, 83, 190, 59, 146, 128, 46, 125, 191, 83, 125, 120, 190, 205, 2, 65, 0, 134, 6, 204, 25, 20, 29, 180, 250, 90, 207, 229, 214, 185, 53, 211, 86, 98, 210, 62, 137, 170, 128, 120, 86, 205, 105, 71, 112, 50, 20, 31, 174, 171, 206, 192, 18, 97, 191, 61, 171, 164, 166, 236, 188, 220, 13, 180, 180, 117, 9, 144, 87, 193, 128, 223, 22, 17, 123, 76, 252, 131, 53, 156, 129, 2, 65, 0, 178, 29, 141, 176, 179, 203, 180, 190, 224, 34, 134, 226, 151, 73, 139, 163, 47, 17, 179, 117, 167, 200, 255, 174, 67, 114, 158, 96, 195, 176, 163, 241, 96, 24, 72, 35, 38, 18, 132, 176, 76, 235, 8, 29, 225, 138, 155, 191, 97, 158, 3, 22, 114, 133, 176, 213, 207, 120, 33, 55, 52, 135, 79, 161])'
        }
      },
      'RSA-OAEP': {
        // RSAES-OAEP algorithm using a SHA hash functions and a MGF1 mask generating function.
        keyUsages: ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
        length: function (len) {
          return len || random.item([1, 256, 384, 512])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'RSA-OAEP',
            hash: {
              name: 'SHA-${this.length(len)}'
            },
            modulusLength: ${random.item([1024, 2048, 4096])},
            publicExponent: new Uint8Array([0x01, 0x00, 0x01])
          }`)
        },
        jwk: function (len) {
          return utils.common.mockup(`{
            kty: 'RSA',
            alg: 'RSA-OAEP-${this.length(len)}'
          }`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        encrypt: function () {
          return utils.common.mockup(`{
            name: 'RSA-OAEP',
            hash: {
              name: 'SHA-${this.length()}'
            },
            modulusLength: ${random.item([1024, 2048, 4096])},
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            label: crypto.getRandomValues(new Uint8Array(16))
          }`)
        },
        decrypt: function () {
          return this.alg()
        },
        unwrapKey: function () {
          return this.alg()
        },
        wrapKey: function () {
          return this.alg()
        },
        presets: {
          raw: {},
          jkw: [
            {
              kty: 'RSA',
              e: 'AQAB',
              n: 'vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE',
              alg: 'RSA-OAEP-256',
              ext: true
            },
            {
              kty: 'RSA',
              e: 'AQAB',
              d: 'e-Nm1CB_F7j0p4Cb-T4WmFTh7RbxUthC3j8xnlXwHgWYwaPs9ZRkicgNCfmjEb-qJ-m0ho1Cz4WzlL1CtTKEdr2w0P6L_IQPvWkFYwUm0rpY9doxnOKkzq53dhP5zdc6N8aOLk4cmAcVjw4o_csc85H-0fxzQxsTP0_jhJn7SNE',
              dp: 'JuZmXNBY9uGGfx3w3ysmFumGBLooNjMwwgMduVS6T8S-0tZkBU-iwJPzXAkKhwINEv1EnygjwmJLBdoHROeEeQ',
              dq: 'KaKOFHxm9104WNwqTth04O9ogaDz_W0wkeHnxOxbWgdtFxsarnImiMlI3Hphv9JuHD5awzNAkaj9P7wDVew-5Q',
              n: 'x-Do39ky8RVFrFplFfAuOQGLr-rqY3h9OiNHVMe34LoVG4Aofps11ycyw5ka3Ls_yA-oRouGmaMjaiPUoaU_Lm5-CMSoVwyeANLZ4b2S7V-srXFS-Qpe6aD7NpzoUL9knwTnZFIGZlxSXB-NXL5kq18UuO1LQGe1To16ijXKNxc',
              p: '4ss3ZAQMdmOk1BRQXwM9YHAoxVDkHDnSV9u89tUb3RbPXlV3fLlhRYtZ7u3FYaTzy08s8Ty2hV1KZ7xXhKEtuQ',
              q: '4Z5ejmIJTwsgxN5pI6mLxwXqQwFDERYDnwU9_vyToWXMEPAphWpS9ET00YrdHsgIGao1Slc0jp4OUxaLfhtzTw',
              qi: 'R1aKNnhUiTjoCHfOVHZ6Qv5R7So-F5mtjDKCBvCi8190U3E25DiKRvDqHZ0bHMRbdQPLLknxHVnuETw6gddHUg',
              alg: 'RSA-OAEP-256',
              ext: true
            }
          ],
          spki: 'new Uint8Array([48, 129, 159, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 129, 141, 0, 48, 129, 137, 2, 129, 129, 0, 182, 93, 35, 213, 252, 204, 20, 103, 91, 238, 105, 199, 53, 114, 24, 221, 114, 210, 137, 173, 88, 76, 205, 113, 148, 148, 79, 80, 59, 208, 60, 75, 231, 248, 78, 125, 12, 30, 237, 226, 63, 146, 157, 203, 239, 60, 138, 123, 234, 50, 23, 174, 216, 33, 122, 16, 53, 246, 140, 254, 75, 246, 205, 204, 117, 204, 115, 29, 178, 102, 139, 201, 74, 177, 45, 131, 183, 166, 234, 61, 124, 75, 110, 3, 70, 202, 148, 95, 45, 228, 94, 95, 148, 2, 162, 79, 146, 137, 29, 189, 102, 75, 207, 214, 116, 58, 63, 171, 219, 27, 5, 9, 108, 16, 218, 23, 169, 43, 181, 119, 31, 172, 95, 205, 180, 18, 255, 203, 2, 3, 1, 0, 1])',
          pkcs8: 'new Uint8Array([48, 130, 2, 118, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 2, 96, 48, 130, 2, 92, 2, 1, 0, 2, 129, 129, 0, 217, 78, 147, 218, 221, 152, 10, 66, 75, 127, 242, 108, 182, 142, 157, 44, 93, 58, 176, 193, 135, 103, 216, 179, 69, 72, 38, 115, 144, 244, 12, 139, 0, 245, 48, 115, 204, 234, 158, 193, 231, 127, 178, 240, 244, 203, 35, 229, 203, 245, 110, 215, 199, 19, 98, 183, 164, 223, 159, 203, 128, 123, 173, 26, 12, 172, 250, 99, 254, 35, 225, 221, 39, 51, 62, 3, 139, 35, 38, 164, 71, 238, 240, 73, 139, 214, 68, 172, 204, 253, 171, 244, 14, 186, 152, 159, 225, 133, 229, 140, 99, 50, 183, 242, 217, 248, 86, 233, 20, 117, 42, 136, 55, 8, 65, 124, 244, 65, 29, 15, 194, 255, 78, 31, 189, 146, 105, 161, 2, 3, 1, 0, 1, 2, 129, 128, 26, 88, 13, 82, 166, 52, 141, 97, 214, 23, 79, 195, 96, 42, 79, 225, 149, 247, 204, 127, 217, 179, 124, 48, 215, 128, 84, 177, 3, 236, 162, 44, 163, 212, 21, 168, 164, 57, 249, 63, 22, 154, 131, 141, 244, 143, 63, 237, 214, 217, 13, 51, 249, 125, 95, 37, 86, 70, 137, 239, 184, 198, 197, 136, 62, 183, 41, 78, 118, 234, 57, 195, 161, 219, 173, 234, 61, 11, 165, 109, 209, 9, 3, 22, 186, 114, 32, 135, 147, 74, 6, 106, 190, 214, 36, 208, 32, 220, 61, 12, 41, 105, 251, 247, 18, 159, 3, 198, 28, 228, 36, 44, 189, 125, 45, 72, 233, 199, 12, 72, 91, 106, 165, 246, 217, 58, 168, 53, 2, 65, 0, 241, 112, 53, 166, 98, 11, 38, 73, 58, 156, 84, 190, 118, 74, 247, 229, 85, 178, 83, 231, 53, 137, 237, 228, 246, 12, 32, 206, 157, 198, 152, 70, 11, 185, 234, 30, 112, 23, 115, 249, 68, 176, 159, 108, 247, 249, 207, 152, 145, 166, 246, 79, 176, 219, 163, 111, 243, 4, 49, 3, 239, 242, 63, 147, 2, 65, 0, 230, 105, 200, 1, 208, 201, 237, 225, 85, 27, 39, 216, 193, 1, 253, 168, 88, 15, 242, 166, 70, 106, 235, 2, 92, 24, 130, 66, 176, 176, 220, 238, 66, 12, 159, 26, 24, 40, 19, 213, 138, 98, 238, 98, 220, 65, 148, 116, 146, 21, 0, 25, 6, 177, 57, 216, 70, 51, 149, 244, 157, 153, 106, 123, 2, 64, 127, 92, 254, 48, 67, 80, 54, 102, 50, 240, 253, 19, 108, 59, 168, 1, 230, 239, 39, 171, 180, 102, 138, 132, 89, 247, 147, 230, 234, 252, 52, 159, 222, 215, 184, 85, 78, 52, 81, 13, 145, 218, 202, 127, 37, 97, 54, 205, 249, 39, 230, 143, 171, 112, 114, 11, 64, 91, 89, 176, 6, 7, 248, 217, 2, 65, 0, 220, 94, 95, 132, 29, 4, 132, 22, 247, 38, 185, 189, 125, 27, 66, 87, 55, 162, 73, 24, 238, 80, 99, 228, 37, 224, 234, 244, 141, 185, 26, 20, 101, 231, 92, 99, 192, 166, 212, 17, 112, 1, 158, 173, 190, 170, 154, 41, 195, 109, 130, 98, 109, 28, 35, 142, 205, 213, 152, 158, 19, 253, 30, 241, 2, 64, 15, 148, 8, 16, 189, 122, 55, 109, 203, 175, 173, 24, 222, 36, 130, 130, 179, 87, 189, 32, 141, 149, 30, 115, 211, 227, 79, 234, 78, 202, 253, 48, 173, 95, 167, 203, 20, 193, 160, 30, 146, 33, 109, 4, 221, 25, 212, 216, 183, 100, 18, 46, 184, 52, 65, 146, 249, 68, 225, 10, 84, 38, 98, 133])'
        }
      },
      'ECDSA': {
        keyUsages: ['sign', 'verify'],
        length: function (len) {
          return len || random.item([256, 384, 512])
        },
        alg: function (len) {
          len = this.length(len)
          return utils.common.mockup(`{
            name: 'ECDSA',
            namedCurve: 'P-${len}',
            hash: {
              name: 'SHA-${len}'
            }
          }`)
        },
        jwk: function (len) {
          return utils.common.mockup(`{
            kty: 'EC',
            alg: 'ES${this.length(len)}'
          }`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        sign: function () {
          return this.alg()
        },
        verify: function () {
          return this.alg()
        },
        presets: {
          raw: {},
          jwk: [
            {
              kty: 'EC',
              crv: 'P-256',
              x: 'A5fQnBdBSgBhTjMr1Atpzvh5SKYQ4aQRJ9WTCG5U4m4',
              y: '8YF98byzMljHX3T5ORLYTDbcwG-_eq3f23JtTE6lOe0',
              ext: true
            },
            {
              kty: 'EC',
              crv: 'P-256',
              x: 'A5fQnBdBSgBhTjMr1Atpzvh5SKYQ4aQRJ9WTCG5U4m4',
              y: '8YF98byzMljHX3T5ORLYTDbcwG-_eq3f23JtTE6lOe0',
              d: '4DvC-hxpv8myZLNeMY-8nq55MhdfA4obM1lGG3hF_yo',
              ext: true
            }
          ],
          spki: 'new Uint8Array([48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 3, 66, 0, 4, 3, 151, 208, 156, 23, 65, 74, 0, 97, 78, 51, 43, 212, 11, 105, 206, 248, 121, 72, 166, 16, 225, 164, 17, 39, 213, 147, 8, 110, 84, 226, 110, 241, 129, 125, 241, 188, 179, 50, 88, 199, 95, 116, 249, 57, 18, 216, 76, 54, 220, 192, 111, 191, 122, 173, 223, 219, 114, 109, 76, 78, 165, 57, 237])',
          pkcs8: 'new Uint8Array([48, 129, 135, 2, 1, 0, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 4, 109, 48, 107, 2, 1, 1, 4, 32, 224, 59, 194, 250, 28, 105, 191, 201, 178, 100, 179, 94, 49, 143, 188, 158, 174, 121, 50, 23, 95, 3, 138, 27, 51, 89, 70, 27, 120, 69, 255, 42, 161, 68, 3, 66, 0, 4, 3, 151, 208, 156, 23, 65, 74, 0, 97, 78, 51, 43, 212, 11, 105, 206, 248, 121, 72, 166, 16, 225, 164, 17, 39, 213, 147, 8, 110, 84, 226, 110, 241, 129, 125, 241, 188, 179, 50, 88, 199, 95, 116, 249, 57, 18, 216, 76, 54, 220, 192, 111, 191, 122, 173, 223, 219, 114, 109, 76, 78, 165, 57, 237])'
        }
      },
      'ECDH': {
        keyUsages: ['deriveKey', 'deriveBits'],
        length: function (len) {
          return len || random.item([256, 384, 512])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'ECDSA',
            namedCurve: 'P-${this.length(len)}'
          }`)
        },
        jwk: function () {
          return {}
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        deriveKey: function (key) {
          return utils.common.mockup(`{
            name: 'ECDSA',
            namedCurve: 'P-${this.length()}',
            ${key}
          }`)
        },
        deriveBits: function (key) {
          return utils.common.mockup(`{
            name: 'ECDSA',
            namedCurve: 'P-${this.length()}',
            ${key}
          }`)
        },
        presets: {
          raw: {},
          jwk: [
            {
              kty: 'EC',
              crv: 'P-256',
              x: 'kgR_PqO07L8sZOBbw6rvv7O_f7clqDeiE3WnMkb5EoI',
              y: 'djI-XqCqSyO9GFk_QT_stROMCAROIvU8KOORBgQUemE',
              ext: true
            },
            {
              kty: 'EC',
              crv: 'P-256',
              x: 'kgR_PqO07L8sZOBbw6rvv7O_f7clqDeiE3WnMkb5EoI',
              y: 'djI-XqCqSyO9GFk_QT_stROMCAROIvU8KOORBgQUemE',
              d: '5aPFSt0UFVXYGu-ZKyC9FQIUOAMmnjzdIwkxCMe3Iok',
              ext: true
            }
          ],
          spki: 'new Uint8Array([48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 3, 66, 0, 4, 146, 4, 127, 62, 163, 180, 236, 191, 44, 100, 224, 91, 195, 170, 239, 191, 179, 191, 127, 183, 37, 168, 55, 162, 19, 117, 167, 50, 70, 249, 18, 130, 118, 50, 62, 94, 160, 170, 75, 35, 189, 24, 89, 63, 65, 63, 236, 181, 19, 140, 8, 4, 78, 34, 245, 60, 40, 227, 145, 6, 4, 20, 122, 97])',
          pkcs8: 'new Uint8Array([48, 129, 135, 2, 1, 0, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 4, 109, 48, 107, 2, 1, 1, 4, 32, 229, 163, 197, 74, 221, 20, 21, 85, 216, 26, 239, 153, 43, 32, 189, 21, 2, 20, 56, 3, 38, 158, 60, 221, 35, 9, 49, 8, 199, 183, 34, 137, 161, 68, 3, 66, 0, 4, 146, 4, 127, 62, 163, 180, 236, 191, 44, 100, 224, 91, 195, 170, 239, 191, 179, 191, 127, 183, 37, 168, 55, 162, 19, 117, 167, 50, 70, 249, 18, 130, 118, 50, 62, 94, 160, 170, 75, 35, 189, 24, 89, 63, 65, 63, 236, 181, 19, 140, 8, 4, 78, 34, 245, 60, 40, 227, 145, 6, 4, 20, 122, 97])'
        }
      },
      'AES-CTR': {
        // AES in Counter Mode.
        keyUsages: ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
        length: function (len) {
          return len || random.item([128, 192, 256])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'AES-CTR',
            length: '${this.length(len)}'
          }`)
        },
        jwk: function (len) {
          return utils.common.mockup(`{
            kty: 'oct',
            alg: 'A${this.length(len)}CTR'
          }`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        encrypt: function () {
          return utils.common.mockup(`{
            name: 'AES-CTR',
            length: ${this.length()},
            counter: new Uint8Array(16)
          }`)
        },
        decrypt: function () {
          return this.encrypt()
        },
        wrapKey: function () {
          return this.encrypt()
        },
        unwrapKey: function () {
          return this.encrypt()
        },
        presets: {
          raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
          jwk: [
            {
              kty: 'oct',
              k: 'Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE',
              alg: 'A256CTR',
              ext: true
            }
          ],
          spki: {},
          pkcs8: {}
        }
      },
      'AES-CBC': {
        // AES in Cipher Block Chaining mode.
        keyUsages: ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
        length: function (len) {
          return len || random.item([128, 192, 256])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'AES-CBC',
            length: ${this.length(len)}
          }`)
        },
        jwk: function (len) {
          return utils.common.mockup(`{
            kty: 'oct',
            alg: 'A${this.length(len)}CBC'
          }`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        encrypt: function () {
          return utils.common.mockup(`{
            name: 'AES-CBC',
            length: ${this.length()},
            iv: crypto.getRandomValues(new Uint8Array(16))
          }`)
        },
        decrypt: function () {
          return this.encrypt()
        },
        wrapKey: function () {
          return this.encrypt()
        },
        unwrapKey: function () {
          return this.encrypt()
        },
        presets: {
          raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
          jwk: [
            {
              kty: 'oct',
              k: 'KfKY5nueRX7eBrOddn9IerHLv1r-T7qpggaCF3MfSR4',
              alg: 'A256CBC',
              ext: true
            }
          ],
          spki: {},
          pkcs8: {}
        }
      },
      'AES-GCM': {
        // AES in Galois/Counter Mode.
        keyUsages: ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
        length: function (len) {
          return len || random.item([128, 192, 256])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'AES-GCM',
            length: ${this.length(len)}
          }`)
        },
        jwk: function (len) {
          if (random.chance(4)) {
            return utils.common.mockup(`{
              kty: 'oct',
              alg: 'A${this.length(len)}GCMKW'
            }`)
          } else {
            return utils.common.mockup(`{
              kty: 'oct',
              alg: 'A${this.length(len)}GCM'
            }`)
          }
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        encrypt: function () {
          return utils.common.mockup(`{
            name: 'AES-GCM',
            iv: crypto.getRandomValues(new Uint8Array(12)),
            additionalData: crypto.getRandomValues(new Uint8Array(256)),
            tagLength: ${random.item([32, 64, 96, 104, 112, 120, 128])}
          }`)
        },
        decrypt: function () {
          return this.encrypt()
        },
        wrapKey: function () {
          return utils.common.mockup(`{
            name: 'AES-GCM',
            iv: crypto.getRandomValues(new Uint8Array(16))
          }`)
        },
        unwrapKey: function () {
          return this.wrapKey()
        },
        presets: {
          raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
          jwk: [
            {
              kty: 'oct',
              k: 'KfKY5nueRX7eBrOddn9IerHLv1r-T7qpggaCF3MfSR4',
              alg: 'A256GCM',
              ext: true
            }
          ],
          spki: {},
          pkcs8: {}
        }
      },
      'AES-KW': {
        // Key wrapping in AES algorithm.
        keyUsages: ['wrapKey', 'unwrapKey'],
        length: function (len) {
          return len || random.item([128, 192, 256])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'AES-KW',
            length: ${this.length(len)}
          }`)
        },
        jwk: function (len) {
          return utils.common.mockup(`{
            kty: 'oct',
            alg: 'A${this.length(len)}KW'
          }`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        wrapKey: function () {
          return utils.common.mockup(`{
            name: 'AES-KW'
          }`)
        },
        unwrapKey: function () {
          return this.wrapKey()
        },
        presets: {
          raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
          jwk: [
            {
              kty: 'oct',
              k: 'KfKY5nueRX7eBrOddn9IerHLv1r-T7qpggaCF3MfSR4',
              alg: 'A256KW',
              ext: true
            }
          ],
          spki: {},
          pkcs8: {}
        }
      },
      'HMAC': {
        // Hash-based message authentication method using SHA hash functions.
        keyUsages: ['sign', 'verify'],
        length: function (len) {
          return len || random.item([1, 256, 384, 512])
        },
        alg: function (len) {
          return utils.common.mockup(`{
            name: 'HMAC',
            hash: {
              name: 'SHA-${this.length(len)}'
            }
          }`)
        },
        jwk: function (len) {
          return utils.common.mockup(`{
            kty: 'oct',
            alg: 'HS${this.length(len)}'
          }`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        sign: function () {
          return this.alg()
        },
        verify: function () {
          return this.alg()
        },
        presets: {
          raw: 'new Uint8Array([122, 94, 39, 230, 46, 23, 151, 80, 131, 230, 3, 101, 80, 234, 143, 9, 251, 152, 229, 228, 89, 222, 31, 135, 214, 104, 55, 68, 67, 59, 5, 51])',
          jwk: {
            kty: 'oct',
            k: 'KfKY5nueRX7eBrOddn9IerHLv1r-T7qpggaCF3MfSR4',
            alg: 'HS256',
            ext: true
          },
          spki: {},
          pkcs8: {}
        }
      },
      'HKDF': {
        // Key derivation using the extraction-then-expansion approach and using the SHA hash functions.
        keyUsages: ['deriveKey', 'deriveBits'],
        alg: function () {
          return utils.common.mockup(`{
            name: 'HKDF'
          }`)
        },
        jwk: function () {
          return utils.common.mockup(`{}`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        deriveBits: function () {
          return utils.common.mockup(`{
            name: 'HKDF',
            hash: {
              name: '${make.crypto.randomDigestName()}'
            },
            salt: crypto.getRandomValues(new Uint8Array(16)),
            info: crypto.getRandomValues(new Uint8Array(16))
          }`)
        },
        deriveKey: function () {
          return this.deriveBits()
        },
        presets: {
          raw: 'crypto.getRandomValues(new Uint8Array(16))',
          jwk: {},
          spki: {},
          pkcs8: {}
        }
      },
      'PBKDF2': {
        // Key derivation using the PKCS#5 password-based key derivation function v2.0.
        keyUsages: ['deriveKey', 'deriveBits'],
        alg: function () {
          return utils.common.mockup(`{
            name: 'PBKDF2'
          }`)
        },
        jwk: function () {
          return utils.common.mockup(`{}`)
        },
        generateKey: function () {
          return this.alg()
        },
        importKey: function () {
          return this.alg()
        },
        deriveBits: function () {
          return utils.common.mockup(`{
            name: 'PBKDF2',
            hash: {
              name: '${make.crypto.randomDigestName()}'
            },
            salt: crypto.getRandomValues(new Uint8Array(16)),
            iterations: ${random.number(1000)}
          }`)
        },
        deriveKey: function () {
          return this.deriveBits()
        },
        presets: {
          raw: 'crypto.getRandomValues(new Uint8Array(16))',
          jwk: {},
          spki: {},
          pkcs8: {}
        }
      },
      'DH': {
        keyUsages: ['deriveKey', 'deriveBits'],
        alg: function () {
          return utils.common.mockup(`{
            name: 'DH'
          }`)
        },
        jwk: function () {
          return utils.common.mockup(`{}`)
        },
        generateKey: function () {
          return utils.common.mockup(`{
            name: 'DH',
            prime: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 201, 15, 218, 162, 33, 104, 194, 52, 196, 198, 98, 139, 128, 220, 28, 209, 41, 2, 78, 8, 138, 103, 204, 116, 2, 11, 190, 166, 59, 19, 155, 34, 81, 74, 8, 121, 142, 52, 4, 221, 239, 149, 25, 179, 205, 58, 67, 27, 48, 43, 10, 109, 242, 95, 20, 55, 79, 225, 53, 109, 109, 81, 194, 69, 228, 133, 181, 118, 98, 94, 126, 198, 244, 76, 66, 233, 166, 55, 237, 107, 11, 255, 92, 182, 244, 6, 183, 237, 238, 56, 107, 251, 90, 137, 159, 165, 174, 159, 36, 17, 124, 75, 31, 230, 73, 40, 102, 81, 236, 228, 91, 61, 194, 0, 124, 184, 161, 99, 191, 5, 152, 218, 72, 54, 28, 85, 211, 154, 105, 22, 63, 168, 253, 36, 207, 95, 131, 101, 93, 35, 220, 163, 173, 150, 28, 98, 243, 86, 32, 133, 82, 187, 158, 213, 41, 7, 112, 150, 150, 109, 103, 12, 53, 78, 74, 188, 152, 4, 241, 116, 108, 8, 202, 35, 115, 39, 255, 255, 255, 255, 255, 255, 255, 255]),
            generator: new Uint8Array([2])
          }`)
        },
        importKey: function () {
          return this.generateKey()
        },
        deriveKey: function (key) {
          // return Object.assign(this.generateKey(),key)
          return utils.common.mockup(`
            name: 'DH',
            prime: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 201, 15, 218, 162, 33, 104, 194, 52, 196, 198, 98, 139, 128, 220, 28, 209, 41, 2, 78, 8, 138, 103, 204, 116, 2, 11, 190, 166, 59, 19, 155, 34, 81, 74, 8, 121, 142, 52, 4, 221, 239, 149, 25, 179, 205, 58, 67, 27, 48, 43, 10, 109, 242, 95, 20, 55, 79, 225, 53, 109, 109, 81, 194, 69, 228, 133, 181, 118, 98, 94, 126, 198, 244, 76, 66, 233, 166, 55, 237, 107, 11, 255, 92, 182, 244, 6, 183, 237, 238, 56, 107, 251, 90, 137, 159, 165, 174, 159, 36, 17, 124, 75, 31, 230, 73, 40, 102, 81, 236, 228, 91, 61, 194, 0, 124, 184, 161, 99, 191, 5, 152, 218, 72, 54, 28, 85, 211, 154, 105, 22, 63, 168, 253, 36, 207, 95, 131, 101, 93, 35, 220, 163, 173, 150, 28, 98, 243, 86, 32, 133, 82, 187, 158, 213, 41, 7, 112, 150, 150, 109, 103, 12, 53, 78, 74, 188, 152, 4, 241, 116, 108, 8, 202, 35, 115, 39, 255, 255, 255, 255, 255, 255, 255, 255]),
            generator: new Uint8Array([2]),
            ${key}
          `)
        },
        deriveBits: function (key) {
          return utils.common.mockup(`
            name: 'DH',
            prime: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 201, 15, 218, 162, 33, 104, 194, 52, 196, 198, 98, 139, 128, 220, 28, 209, 41, 2, 78, 8, 138, 103, 204, 116, 2, 11, 190, 166, 59, 19, 155, 34, 81, 74, 8, 121, 142, 52, 4, 221, 239, 149, 25, 179, 205, 58, 67, 27, 48, 43, 10, 109, 242, 95, 20, 55, 79, 225, 53, 109, 109, 81, 194, 69, 228, 133, 181, 118, 98, 94, 126, 198, 244, 76, 66, 233, 166, 55, 237, 107, 11, 255, 92, 182, 244, 6, 183, 237, 238, 56, 107, 251, 90, 137, 159, 165, 174, 159, 36, 17, 124, 75, 31, 230, 73, 40, 102, 81, 236, 228, 91, 61, 194, 0, 124, 184, 161, 99, 191, 5, 152, 218, 72, 54, 28, 85, 211, 154, 105, 22, 63, 168, 253, 36, 207, 95, 131, 101, 93, 35, 220, 163, 173, 150, 28, 98, 243, 86, 32, 133, 82, 187, 158, 213, 41, 7, 112, 150, 150, 109, 103, 12, 53, 78, 74, 188, 152, 4, 241, 116, 108, 8, 202, 35, 115, 39, 255, 255, 255, 255, 255, 255, 255, 255]),
            generator: new Uint8Array([2]),
            ${key}
          `)
        },
        presets: {
          raw: {},
          jwk: {},
          spki: {},
          pkcs8: {}
        }
      }
    }
  }

  static supportedAlgorithms () {
    Object.keys(make.crypto.algorithms)
  }

  static randomAlgorithm () {
    return make.crypto.algorithms[random.item(Object.keys(make.crypto.algorithms))]
  }

  static randomCandidate (operation) {
    // Find and return a random algorithm suitable for a given operation.
    return make.crypto.algorithms[make.crypto.randomAlgorithmName(operation)]
  }
}

module.exports = crypto
