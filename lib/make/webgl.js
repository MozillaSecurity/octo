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
    let internalformat = random.item(Object.keys(webgl.internalFormat))
    let format = webgl.internalFormat[internalformat].format
    let type = random.item(webgl.internalFormat[internalformat].type)
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

  match (shader, regex, group = 1) {
    let matches = []
    let match
    while (match = regex.exec(shader)) {
        matches.push(match[group])
    }
    return matches
  }

  static parseUniforms (shader, group = 1) {
    /* Todo: Parse their individual data types into categories. */
    return match(shader, /uniform .+? (\w+)(?=[\[;])/gm, group)
  }

  static parseAttributes (shader, group = 1) {
    return match(shader, /attribute .+? (\w+)(?=;)/gm, group)
  }

  static parseVaryings (shader, group = 1) {
    return match(shader, /varying .+? (\w+)(?=;)/gm, group)
  }

  static parseFragDatav2 (shader, group = 1) {
    // #version 200
    return match(shader, /(gl_Frag[^[ =]+)/gm, group)
  }

  static parseFragDatav3 (shader, group = 1) {
    // #version 300
    return match(shader, /out .+? (\w+)(?=[\[;])/gm, group)
  }

  static parseFrag (shader, group = 1) {
    let matches = parseFragDatav2(shader)
    if (matches.length) {
        return matches
    }
    return parseFragDatav3(shader)
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

  static randomParameter (isWebGL2) {
    let pname = [
      'ACTIVE_TEXTURE',
      'ALIASED_LINE_WIDTH_RANGE',
      'ALIASED_POINT_SIZE_RANGE',
      'ALPHA_BITS',
      'ARRAY_BUFFER_BINDING',
      'BLEND',
      'BLEND_COLOR',
      'BLEND_DST_ALPHA',
      'BLEND_DST_RGB',
      'BLEND_EQUATION_ALPHA',
      'BLEND_EQUATION_RGB',
      'BLEND_SRC_ALPHA',
      'BLEND_SRC_RGB',
      'BLUE_BITS',
      'COLOR_CLEAR_VALUE',
      'COLOR_WRITEMASK',
      'COMPRESSED_TEXTURE_FORMATS',
      'CULL_FACE',
      'CULL_FACE_MODE',
      'CURRENT_PROGRAM',
      'DEPTH_BITS',
      'DEPTH_CLEAR_VALUE',
      'DEPTH_FUNC',
      'DEPTH_RANGE',
      'DEPTH_TEST',
      'DEPTH_WRITEMASK',
      'DITHER',
      'ELEMENT_ARRAY_BUFFER_BINDING',
      'FRAMEBUFFER_BINDING',
      'FRONT_FACE',
      'GENERATE_MIPMAP_HINT',
      'GREEN_BITS',
      'IMPLEMENTATION_COLOR_READ_FORMAT',
      'IMPLEMENTATION_COLOR_READ_TYPE',
      'LINE_WIDTH',
      'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
      'MAX_CUBE_MAP_TEXTURE_SIZE',
      'MAX_FRAGMENT_UNIFORM_VECTORS',
      'MAX_RENDERBUFFER_SIZE',
      'MAX_TEXTURE_IMAGE_UNITS',
      'MAX_TEXTURE_SIZE',
      'MAX_VARYING_VECTORS',
      'MAX_VERTEX_ATTRIBS',
      'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
      'MAX_VERTEX_UNIFORM_VECTORS',
      'MAX_VIEWPORT_DIMS',
      'PACK_ALIGNMENT',
      'POLYGON_OFFSET_FACTOR',
      'POLYGON_OFFSET_FILL',
      'POLYGON_OFFSET_UNITS',
      'RED_BITS',
      'RENDERBUFFER_BINDING',
      'RENDERER',
      'SAMPLE_ALPHA_TO_COVERAGE',
      'SAMPLE_BUFFERS',
      'SAMPLE_COVERAGE',
      'SAMPLE_COVERAGE_INVERT',
      'SAMPLE_COVERAGE_VALUE',
      'SAMPLES',
      'SCISSOR_BOX',
      'SCISSOR_TEST',
      'SHADING_LANGUAGE_VERSION',
      'STENCIL_BACK_FAIL',
      'STENCIL_BACK_FUNC',
      'STENCIL_BACK_PASS_DEPTH_FAIL',
      'STENCIL_BACK_PASS_DEPTH_PASS',
      'STENCIL_BACK_REF',
      'STENCIL_BACK_VALUE_MASK',
      'STENCIL_BACK_WRITEMASK',
      'STENCIL_BITS',
      'STENCIL_CLEAR_VALUE',
      'STENCIL_FAIL',
      'STENCIL_FUNC',
      'STENCIL_PASS_DEPTH_FAIL',
      'STENCIL_PASS_DEPTH_PASS',
      'STENCIL_REF',
      'STENCIL_TEST',
      'STENCIL_VALUE_MASK',
      'STENCIL_WRITEMASK',
      'SUBPIXEL_BITS',
      'TEXTURE_BINDING_2D',
      'TEXTURE_BINDING_CUBE_MAP',
      'UNPACK_ALIGNMENT',
      'UNPACK_COLORSPACE_CONVERSION_WEBGL',
      'UNPACK_FLIP_Y_WEBGL',
      'UNPACK_PREMULTIPLY_ALPHA_WEBGL',
      'VENDOR',
      'VERSION',
      'VIEWPORT',
      'VERSION',
      'SHADING_LANGUAGE_VERSION',
      'VENDOR',
      'RENDERER'
    ]

    if (isWebGL2) {
      pname.extend([
        'COPY_READ_BUFFER_BINDING',
        'COPY_WRITE_BUFFER_BINDING',
        'DRAW_BUFFERi',
        'DRAW_FRAMEBUFFER_BINDING',
        'FRAGMENT_SHADER_DERIVATIVE_HINT',
        'MAX_3D_TEXTURE_SIZE',
        'MAX_ARRAY_TEXTURE_LAYERS',
        'MAX_CLIENT_WAIT_TIMEOUT_WEBGL',
        'MAX_COLOR_ATTACHMENTS',
        'MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS',
        'MAX_COMBINED_UNIFORM_BLOCKS',
        'MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS',
        'MAX_DRAW_BUFFERS',
        'MAX_ELEMENT_INDEX',
        'MAX_ELEMENTS_INDICE',
        'MAX_ELEMENTS_VERTICES',
        'MAX_FRAGMENT_INPUT_COMPONENTS',
        'MAX_FRAGMENT_UNIFORM_BLOCKS',
        'MAX_FRAGMENT_UNIFORM_COMPONENTS',
        'MAX_PROGRAM_TEXEL_OFFSET',
        'MAX_SAMPLES',
        'MAX_SERVER_WAIT_TIMEOUT',
        'MAX_TEXTURE_LOD_BIAS',
        'MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS',
        'MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS',
        'MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS',
        'MAX_UNIFORM_BLOCK_SIZE',
        'MAX_UNIFORM_BUFFER_BINDINGS',
        'MAX_VARYING_COMPONENTS',
        'MAX_VERTEX_OUTPUT_COMPONENTS',
        'MAX_VERTEX_UNIFORM_BLOCKS',
        'MAX_VERTEX_UNIFORM_COMPONENTS',
        'MIN_PROGRAM_TEXEL_OFFSET',
        'PACK_ROW_LENGTH',
        'PACK_SKIP_PIXELS',
        'PACK_SKIP_ROWS',
        'PIXEL_PACK_BUFFER_BINDING',
        'PIXEL_UNPACK_BUFFER_BINDING',
        'RASTERIZER_DISCARD',
        'READ_BUFFER',
        'READ_FRAMEBUFFER_BINDING',
        'SAMPLER_BINDING',
        'TEXTURE_BINDING_2D_ARRAY',
        'TEXTURE_BINDING_3D',
        'TRANSFORM_FEEDBACK_ACTIVE',
        'TRANSFORM_FEEDBACK_BINDING',
        'TRANSFORM_FEEDBACK_BUFFER_BINDING',
        'TRANSFORM_FEEDBACK_PAUSED',
        'UNIFORM_BUFFER_BINDING',
        'UNIFORM_BUFFER_OFFSET_ALIGNMENT',
        'UNPACK_IMAGE_HEIGHT',
        'UNPACK_ROW_LENGTH',
        'UNPACK_SKIP_IMAGES',
        'UNPACK_SKIP_PIXELS',
        'UNPACK_SKIP_ROWS',
        'VERTEX_ARRAY_BINDING'
      ])
    }
    return random.item(pname)
  }

  static randomProgramParameter () {
    let pname = [
      'DELETE_STATUS',
      'LINK_STATUS',
      'VALIDATE_STATUS',
      'ATTACHED_SHADERS',
      'ACTIVE_ATTRIBUTES',
      'ACTIVE_UNIFORMS',
      'TRANSFORM_FEEDBACK_BUFFER_MODE',
      'TRANSFORM_FEEDBACK_VARYINGS',
      'ACTIVE_UNIFORM_BLOCKS'
    ]
    return random.item(pname)
  }

  static randomRenderBufferParameter () {
    let pname = [
      'RENDERBUFFER_WIDTH',
      'RENDERBUFFER_HEIGHT',
      'RENDERBUFFER_INTERNAL_FORMAT',
      'RENDERBUFFER_RED_SIZE',
      'RENDERBUFFER_GREEN_SIZE',
      'RENDERBUFFER_BLUE_SIZE',
      'RENDERBUFFER_ALPHA_SIZE',
      'RENDERBUFFER_DEPTH_SIZE',
      'RENDERBUFFER_STENCIL_SIZE'
    ]
    return random.item(pname)
  }

  static randomExtension (pattern) {
    let extensions = [
      'ANGLE_instanced_arrays',
      'EXT_blend_minmax',
      'EXT_color_buffer_half_float',
      'EXT_frag_depth',
      'EXT_sRGB',
      'EXT_shader_texture_lod',
      'EXT_texture_filter_anisotropic',
      'EXT_disjoint_timer_query',
      'OES_element_index_uint',
      'OES_standard_derivatives',
      'OES_texture_float',
      'OES_texture_float_linear',
      'OES_texture_half_float',
      'OES_texture_half_float_linear',
      'OES_vertex_array_object',
      'WEBGL_color_buffer_float',
      'WEBGL_compressed_texture_s3tc',
      'WEBGL_compressed_texture_s3tc_srgb',
      'WEBGL_debug_renderer_info',
      'WEBGL_debug_shaders',
      'WEBGL_depth_texture',
      'WEBGL_draw_buffers',
      'WEBGL_lose_context'
    ]

    if (pattern) {
      let candidates = []
      extensions.forEach((ext) => ext.includes(pattern) ? candidates.push(ext) : '')
      if (candidates.length >= 0) {
        return random.item(candidates)
      }
    }

    return random.item(extensions)
  }
}

module.exports = webgl
