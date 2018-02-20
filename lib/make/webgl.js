/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.webgl = {
  internalFormat: {
    'RGB': {format: 'RGB', type: ['UNSIGNED_BYTE', 'UNSIGNED_SHORT_5_6_5']},
    'RGBA': {format: 'RGBA', type: ['UNSIGNED_BYTE', 'UNSIGNED_SHORT_4_4_4_4', 'UNSIGNED_SHORT_5_5_5_1']},
    'LUMINANCE_ALPHA': {format: 'LUMINANCE_ALPHA', type: ['UNSIGNED_BYTE']},
    'LUMINANCE': {format: 'LUMINANCE', type: ['UNSIGNED_BYTE']},
    'ALPHA': {format: 'ALPHA', type: ['UNSIGNED_BYTE']},
    'R8': {format: 'RED', type: ['UNSIGNED_BYTE']},
    'R16F': {format: 'RED', type: ['HALF_FLOAT', 'FLOAT']},
    'R32F': {format: 'RED', type: ['FLOAT']},
    'R8UI': {format: 'RED_INTEGER', type: ['UNSIGNED_BYTE']},
    'RG8': {format: 'RG', type: ['UNSIGNED_BYTE']},
    'RG16F': {format: 'RG', type: ['HALF_FLOAT', 'FLOAT']},
    'RG32F': {format: 'RG', type: ['FLOAT']},
    'RG8UI': {format: 'RG_INTEGER', type: ['UNSIGNED_BYTE']},
    'RGB8': {format: 'RGB', type: ['UNSIGNED_BYTE']},
    'SRGB8': {format: 'RGB', type: ['UNSIGNED_BYTE']},
    'RGB565': {format: 'RGB', type: ['RGB', 'UNSIGNED_BYTE', 'UNSIGNED_SHORT_5_6_5']},
    'R11F_G11F_B10F': {format: 'RGB', type: ['UNSIGNED_INT_10F_11F_11F_REV', 'HALF_FLOAT', 'FLOAT']},
    'RGB9_E5': {format: 'RGB', type: ['HALF_FLOAT', 'FLOAT']},
    'RGB16F': {format: 'RGB', type: ['HALF_FLOAT', 'FLOAT']},
    'RGB32F': {format: 'RGB', type: ['FLOAT']},
    'RGB8UI': {format: 'RGB_INTEGER', type: ['UNSIGNED_BYTE']},
    'RGBA8': {format: 'RGBA', type: ['UNSIGNED_BYTE']},
    'SRGB8_ALPHA8': {format: 'RGBA', type: ['UNSIGNED_BYTE']},
    'RGB5_A1': {format: 'RGBA', type: ['UNSIGNED_BYTE', 'UNSIGNED_SHORT_5_5_5_1']},
    'RGB10_A2': {format: 'RGBA', type: ['UNSIGNED_INT_2_10_10_10_REV']},
    'RGBA4': {format: 'RGBA', type: ['UNSIGNED_BYTE', 'UNSIGNED_SHORT_4_4_4_4']},
    'RGBA16F': {format: 'RGBA', type: ['HALF_FLOAT', 'FLOAT']},
    'RGBA32F': {format: 'RGBA', type: ['FLOAT']},
    'RGBA8UI': {format: 'RGBA_INTEGER', type: ['UNSIGNED_BYTE']}
  },
  buffetTarget: () => {
    return random.item(['ARRAY_BUFFER', 'ELEMENT_ARRAY_BUFFER'])
  },
  textureTarget: (isWebGL2) => {
    let target = ['TEXTURE_2D', 'TEXTURE_CUBE_MAP']
    if (isWebGL2) {
      target.extend(['TEXTURE_3D', 'TEXTURE_2D_ARRAY'])
    }
    return random.item(target)
  },
  framebufferTarget: (isWebGL2) => {
    let target = ['FRAMEBUFFER']
    if (isWebGL2) {
      target.extends(['DRAW_FRAMEBUFFER', 'READ_FRAMEBUFFER'])
    }
    return random.item(target)
  },
  renderbufferTarget: () => {
    return 'RENDERBUFFER'
  },
  textureSources: () => {
    let sources = [
      'HTMLCanvasElement',
      'HTMLImageElement',
      'HTMLVideoElement',
      'ImageBitmap',
      'ImageData',
      'ArrayBufferView'
    ]
    return random.item(sources)
  },
  parseUniforms: (shader) => {
    let names = []
    let result = shader.match(/uniform .* (\w+)(?=;)/gm)
    if (result) {
      result.forEach(function (v) {
        names.push(v.split(' ').pop())
      })
    }
    return names
  },
  parseAttributes: (shader) => {
    let names = []
    let result = shader.match(/attribute .* (\w+)(?=;)/gm)
    if (result) {
      result.forEach(function (v) {
        names.push(v.split(' ').pop())
      })
    }
    return names
  }
}
