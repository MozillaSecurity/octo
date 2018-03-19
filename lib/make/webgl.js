/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class webgl extends make {
  static get internalFormat () {
    return {
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
    }
  }

  static WebGLFormat () {
    let internalformat = random.item(Object.keys(this.internalFormat))
    let format = this.internalFormat[internalformat].format
    let type = random.item(this.internalFormat[internalformat].type)
    return [internalformat, format, type]
  }

  static textureSources () {
    let sources = [
      'HTMLCanvasElement',
      'HTMLImageElement',
      'HTMLVideoElement',
      'ImageData'
    ]
    return random.item(sources)
  }

  static parseUniforms (shader) {
    let names = []
    let result = shader.match(/uniform .* (\w+)(?=;)/gm)
    if (result) {
      result.forEach((v) => names.push(v.split(' ').pop()))
    }
    return names
  }

  static parseAttributes (shader) {
    let names = []
    let result = shader.match(/attribute .* (\w+)(?=;)/gm)
    if (result) {
      result.forEach((v) => names.push(v.split(' ').pop()))
    }
    return names
  }

  static parseFrag (shader) {
    return shader.match(/(gl_Frag[^[ =]+)/gm)
  }

  static randomBitmask () {
    return parseInt((random.subset([1, 0], 8).join('')))
  }

  static randomBufferTarget (isWebGL2) {
    let target = [
      'ARRAY_BUFFER',
      'ELEMENT_ARRAY_BUFFER'
    ]
    if (isWebGL2) {
      target.extend([
        'COPY_READ_BUFFER',
        'COPY_WRITE_BUFFER',
        'TRANSFORM_FEEDBACK_BUFFER',
        'UNIFORM_BUFFER',
        'PIXEL_PACK_BUFFER',
        'PIXEL_UNPACK_BUFFER'
      ])
    }
    return random.item(target)
  }

  static randomTexParameter (isWebGL2) {
    let pname = [
      'TEXTURE_MAG_FILTER',
      'TEXTURE_MIN_FILTER',
      'TEXTURE_WRAP_S',
      'TEXTURE_WRAP_T'
    ]
    if (isWebGL2) {
      pname.extend([
        'TEXTURE_BASE_LEVEL',
        'TEXTURE_COMPARE_FUNC',
        'TEXTURE_COMPARE_MODE',
        'TEXTURE_MAX_LEVEL',
        'TEXTURE_MAX_LOD',
        'TEXTURE_MIN_LOD',
        'TEXTURE_WRAP_R'
      ])
    }
    return random.item(pname)
  }

  static randomTexParameterValue (isWebGL2) {
    let pnameparam = {
      'TEXTURE_MAG_FILTER': [
        'LINEAR',
        'NEAREST'
      ],
      'TEXTURE_MIN_FILTER': [
        'LINEAR',
        'NEAREST',
        'NEAREST_MIPMAP_NEAREST',
        'LINEAR_MIPMAP_NEAREST',
        'NEAREST_MIPMAP_LINEA',
        'LINEAR_MIPMAP_LINEAR'
      ],
      'TEXTURE_WRAP_S': [
        'REPEAT',
        'CLAMP_TO_EDGE',
        'MIRRORED_REPEAT'
      ],
      'TEXTURE_WRAP_T': [
        'REPEAT',
        'CLAMP_TO_EDGE',
        'MIRRORED_REPEAT'
      ]
    }
    if (isWebGL2) {
      pnameparam = Object.assign(
        pnameparam,
        {
          'TEXTURE_BASE_LEVEL': [
            make.number.any()
          ],
          'TEXTURE_COMPARE_FUNC': [
            'LEQUAL',
            'GEQUAL',
            'LESS',
            'GREATER',
            'EQUAL',
            'NOTEQUAL',
            'ALWAYS',
            'NEVER'
          ],
          'TEXTURE_COMPARE_MODE': [
            'NONE',
            'COMPARE_REF_TO_TEXTURE'
          ],
          'TEXTURE_MAX_LEVEL': [
            make.number.any()
          ],
          'TEXTURE_MAX_LOD': [
            make.number.float()
          ],
          'TEXTURE_MIN_LOD': [
            make.number.float()
          ],
          'TEXTURE_WRAP_R': [
            'REPEAT',
            'CLAMP_TO_EDGE',
            'MIRRORED_REPEAT'
          ]
        }
      )
    }
    let pname = random.item(Object.keys(pnameparam))
    let param = random.item(pnameparam[pname])
    return [pname, param]
  }

  static randomBlendMode (isWebGL2) {
    let mode = [
      'FUNC_ADD',
      'FUNC_SUBTRACT',
      'FUNC_REVERSE_SUBTRACT'
    ]
    if (isWebGL2) {
      mode.extend([
        'MIN',
        'MAX'
      ])
    }
    return random.item(mode)
  }

  static randomBlendFactor (isWebGL2) {
    let factor = [
      'ZERO',
      'ONE',
      'SRC_COLOR',
      'ONE_MINUS_SRC_COLOR',
      'DST_COLOR',
      'ONE_MINUS_DST_COLOR',
      'SRC_ALPHA',
      'ONE_MINUS_SRC_ALPHA',
      'DST_ALPHA',
      'ONE_MINUS_DST_ALPHA',
      'CONSTANT_COLOR',
      'ONE_MINUS_CONSTANT_COLOR',
      'CONSTANT_ALPHA',
      'ONE_MINUS_CONSTANT_ALPHA',
      'SRC_ALPHA_SATURATE'
    ]
    return random.item(factor)
  }

  static randomFace (isWebGL2) {
    let mode = [
      'FRONT',
      'BACK',
      'FRONT_AND_BACK'
    ]
    return random.item(mode)
  }

  static randomTexImage2DTarget (isWebGL2) {
    let target = [
      'TEXTURE_2D',
      'TEXTURE_CUBE_MAP_POSITIVE_X',
      'TEXTURE_CUBE_MAP_NEGATIVE_X',
      'TEXTURE_CUBE_MAP_POSITIVE_Y',
      'TEXTURE_CUBE_MAP_NEGATIVE_Y',
      'TEXTURE_CUBE_MAP_POSITIVE_Z',
      'TEXTURE_CUBE_MAP_NEGATIVE_Z'
    ]
    return random.item(target)
  }

  static randomTextureTarget (isWebGL2) {
    let target = [
      'TEXTURE_2D',
      'TEXTURE_CUBE_MAP'
    ]
    if (isWebGL2) {
      target.extend([
        'TEXTURE_3D',
        'TEXTURE_2D_ARRAY'
      ])
    }
    return random.item(target)
  }

  static randomFunc (isWebGL2) {
    let func = [
      'NEVER',
      'LESS',
      'EQUAL',
      'LEQUAL',
      'GREATER',
      'NOTEQUAL',
      'GEQUAL',
      'ALWAYS'
    ]
    return random.item(func)
  }

  static randomCap (isWebGL2) {
    let cap = [
      'BLEND',
      'CULL_FACE',
      'DEPTH_TEST',
      'DITHER',
      'POLYGON_OFFSET_FILL',
      'SAMPLE_ALPHA_TO_COVERAGE',
      'SAMPLE_COVERAGE',
      'SCISSOR_TEST',
      'STENCIL_TEST'
    ]
    if (isWebGL2) {
      cap.extend([
        'RASTERIZER_DISCARD'
      ])
    }
    return random.item(cap)
  }

  static randomPrimitive (isWebGL2) {
    let mode = [
      'POINTS',
      'LINE_STRIP',
      'LINE_LOOP',
      'LINES',
      'TRIANGLE_STRIP',
      'TRIANGLE_FAN',
      'TRIANGLES'
    ]
    return random.item(mode)
  }

  static randomTextureAttachment (isWebGL2) {
    let attachment = [
      'COLOR_ATTACHMENT0',
      'DEPTH_ATTACHMENT',
      'STENCIL_ATTACHMENT',
      'DEPTH_STENCIL_ATTACHMENT'
    ]
    if (isWebGL2) {
      attachment.extend([
        'COLOR_ATTACHMENT' + random.range(0, 15)
      ])
    }
    return random.item(attachment)
  }

  static randomAttachmentQuery (isWebGL2) {
    let pname = [
      'FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE',
      'FRAMEBUFFER_ATTACHMENT_OBJECT_NAME',
      'FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL',
      'FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE'
    ]
    if (isWebGL2) {
      pname.extend([
        'FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE',
        'FRAMEBUFFER_ATTACHMENT_BLUE_SIZE',
        'FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING',
        'FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE',
        'FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE',
        'FRAMEBUFFER_ATTACHMENT_GREEN_SIZE',
        'FRAMEBUFFER_ATTACHMENT_RED_SIZE',
        'FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE',
        'FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER'
      ])
    }
    return random.item(pname)
  }

  static randomShaderPrecision (isWebGL2) {
    let precisiontype = [
      'LOW_FLOAT',
      'MEDIUM_FLOAT',
      'HIGH_FLOAT',
      'LOW_INT',
      'MEDIUM_INT',
      'HIGH_INT'
    ]
    return random.item(precisiontype)
  }

  static randomStencilRefParameter (isWebGL2) {
    let param = [
      'STENCIL_FUNC',
      'STENCIL_VALUE_MASK',
      'STENCIL_REF',
      'STENCIL_BACK_FUNC',
      'STENCIL_BACK_VALUE_MASK',
      'STENCIL_BACK_REF',
      'STENCIL_BITS'
    ]
    return random.item(param)
  }

  static randomStencilMaskParameter (isWebGL2) {
    let param = [
      'STENCIL_WRITEMASK',
      'STENCIL_BACK_WRITEMASK',
      'STENCIL_BITS'
    ]
    return random.item(param)
  }

  static randomVertexAttribParameter (isWebGL2) {
    let pname = [
      'VERTEX_ATTRIB_ARRAY_BUFFER_BINDING',
      'VERTEX_ATTRIB_ARRAY_ENABLED',
      'VERTEX_ATTRIB_ARRAY_SIZE',
      'VERTEX_ATTRIB_ARRAY_STRIDE',
      'VERTEX_ATTRIB_ARRAY_TYPE',
      'VERTEX_ATTRIB_ARRAY_NORMALIZED',
      'CURRENT_VERTEX_ATTRIB'
    ]
    if (isWebGL2) {
      pname.extend([
        'VERTEX_ATTRIB_ARRAY_INTEGER',
        'VERTEX_ATTRIB_ARRAY_DIVISOR',
        'VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE'
      ])
    }
    return random.item(pname)
  }

  static randomHint (isWebGL2) {
    let target = [
      'GENERATE_MIPMAP_HINT'
    ]
    if (isWebGL2) {
      target.extend([
        'FRAGMENT_SHADER_DERIVATIVE_HINT'
      ])
    }
    return random.item(target)
  }

  static randomHintMode (isWebGL2) {
    let mode = [
      'FASTEST',
      'NICEST',
      'DONT_CARE'
    ]
    return random.item(mode)
  }

  static randomPixelStorage (isWebGL2) {
    let pname = {
      'PACK_ALIGNMENT': random.item([1, 2, 4, 8]),
      'UNPACK_ALIGNMENT': random.item([1, 2, 4, 8]),
      'UNPACK_FLIP_Y_WEBGL': random.bool(),
      'UNPACK_PREMULTIPLY_ALPHA_WEBGL': random.bool(),
      'UNPACK_COLORSPACE_CONVERSION_WEBGL': random.item([0, 0x9244])
    }
    if (isWebGL2) {
      Object.assign(
        pname,
        {
          'PACK_ROW_LENGTH': make.number.any(),
          'PACK_SKIP_PIXELS': make.number.any(),
          'PACK_SKIP_ROWS': make.number.any(),
          'UNPACK_ROW_LENGTH': make.number.any(),
          'UNPACK_IMAGE_HEIGHT': make.number.any(),
          'UNPACK_SKIP_PIXELS': make.number.any(),
          'UNPACK_SKIP_ROWS': make.number.any(),
          'UNPACK_SKIP_IMAGES': make.number.any()
        }
      )
    }
    let name = random.item(Object.keys(pname))
    return [name, pname[name]]
  }

  static randomStencilAction (isWebGL2) {
    let action = [
      'KEEP',
      'ZERO',
      'REPLACE',
      'INCR',
      'INCR_WRAP',
      'DECR',
      'DECR_WRAP',
      'INVERT'
    ]
    return random.item(action)
  }

  static randomQueryTarget (isWebGL2) {
    let target = [
      'ANY_SAMPLES_PASSED',
      'ANY_SAMPLES_PASSED_CONSERVATIVE',
      'TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN'
    ]
    return random.item(target)
  }

  static randomQueryPname (isWebGL2) {
    let pname = [
      'CURRENT_QUERY',
      'QUERY_RESULT',
      'QUERY_RESULT_AVAILABLE'
    ]
    return random.item(pname)
  }

  static randomSamplerParameter (isWebGL2) {
    let pname = [
      'TEXTURE_MAG_FILTER',
      'TEXTURE_MIN_FILTER',
      'TEXTURE_WRAP_S',
      'TEXTURE_WRAP_T',
      'TEXTURE_BASE_LEVEL',
      'TEXTURE_COMPARE_FUNC',
      'TEXTURE_COMPARE_MODE',
      'TEXTURE_MAX_LEVEL',
      'TEXTURE_WRAP_R',
      'TEXTURE_MAX_LOD',
      'TEXTURE_MIN_LOD',
      'TEXTURE_MAX_ANISOTROPY_EXT'
    ]
    return random.item(pname)
  }

  static randomSyncParameter (isWebGL2) {
    let pname = [
      'OBJECT_TYPE',
      'SYNC_STATUS',
      'SYNC_CONDITION',
      'SYNC_FLAGS'
    ]
    return random.item(pname)
  }

  static randomClearBuffer (isWebGL2) {
    let buffer = [
      'COLOR',
      'DEPTH',
      'STENCIL',
      'DEPTH_STENCIL'
    ]
    return random.item(buffer)
  }

  static randomBindBufferTarget (isWebGL2) {
    let target = [
      'TRANSFORM_FEEDBACK_BUFFER',
      'UNIFORM_BUFFER'
    ]
    return random.item(target)
  }

  static randomIndexedParameterTarget (isWebGL2) {
    let target = [
      'TRANSFORM_FEEDBACK_BUFFER_BINDING',
      'TRANSFORM_FEEDBACK_BUFFER_SIZE',
      'TRANSFORM_FEEDBACK_BUFFER_START',
      'UNIFORM_BUFFER_BINDING',
      'UNIFORM_BUFFER_SIZE',
      'UNIFORM_BUFFER_START'
    ]
    return random.item(target)
  }

  static randomUniformParameter (isWebGL2) {
    let pname = [
      'UNIFORM_TYPE',
      'UNIFORM_SIZE',
      'UNIFORM_BLOCK_INDEX',
      'UNIFORM_OFFSET',
      'UNIFORM_ARRAY_STRIDE',
      'UNIFORM_MATRIX_STRIDE',
      'UNIFORM_IS_ROW_MAJOR'
    ]
    return random.item(pname)
  }

  static randomUniformBlockParameter (isWebGL2) {
    let pname = [
      'UNIFORM_BLOCK_BINDING',
      'UNIFORM_BLOCK_DATA_SIZE',
      'UNIFORM_BLOCK_ACTIVE_UNIFORMS',
      'UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES',
      'UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER',
      'UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER'
    ]
    return random.item(pname)
  }

  static randomPixelDatatype (isWebGL2) {
    let type = [
      'UNSIGNED_BYTE',
      'UNSIGNED_SHORT',
      'UNSIGNED_SHORT_5_6_5',
      'UNSIGNED_SHORT_4_4_4_4',
      'UNSIGNED_SHORT_5_5_5_1',
      'UNSIGNED_INT',
      'FLOAT'
    ]
    return random.item(type)
  }

  static randomBufferUsage (isWebGL2) {
    let usage = [
      'STATIC_DRAW',
      'DYNAMIC_DRAW',
      'STREAM_DRAW'
    ]
    if (isWebGL2) {
      usage.extend([
        'STATIC_READ',
        'DYNAMIC_READ',
        'STREAM_READ',
        'STATIC_COPY',
        'DYNAMIC_COPY',
        'STREAM_COPY'
      ])
    }
    return random.item(usage)
  }
}

module.exports = webgl
