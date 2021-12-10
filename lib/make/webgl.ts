/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from "../make"
import { random } from "../random"

interface FormatEntry {
  format: string
  type: string[]
}

interface InternalFormatTypes {
  [key: string]: FormatEntry
}

/**
 * Class for generating WebGL related values.
 */
export class webgl {
  /**
   * Return an object containing valid internal formats and their associated types.
   */
  static get internalFormat(): InternalFormatTypes {
    return {
      RGB: { format: "RGB", type: ["UNSIGNED_BYTE", "UNSIGNED_SHORT_5_6_5"] },
      RGBA: {
        format: "RGBA",
        type: ["UNSIGNED_BYTE", "UNSIGNED_SHORT_4_4_4_4", "UNSIGNED_SHORT_5_5_5_1"],
      },
      LUMINANCE_ALPHA: { format: "LUMINANCE_ALPHA", type: ["UNSIGNED_BYTE"] },
      LUMINANCE: { format: "LUMINANCE", type: ["UNSIGNED_BYTE"] },
      ALPHA: { format: "ALPHA", type: ["UNSIGNED_BYTE"] },
      R8: { format: "RED", type: ["UNSIGNED_BYTE"] },
      R16F: { format: "RED", type: ["HALF_FLOAT", "FLOAT"] },
      R32F: { format: "RED", type: ["FLOAT"] },
      R8UI: { format: "RED_INTEGER", type: ["UNSIGNED_BYTE"] },
      RG8: { format: "RG", type: ["UNSIGNED_BYTE"] },
      RG16F: { format: "RG", type: ["HALF_FLOAT", "FLOAT"] },
      RG32F: { format: "RG", type: ["FLOAT"] },
      RG8UI: { format: "RG_INTEGER", type: ["UNSIGNED_BYTE"] },
      RGB8: { format: "RGB", type: ["UNSIGNED_BYTE"] },
      SRGB8: { format: "RGB", type: ["UNSIGNED_BYTE"] },
      RGB565: { format: "RGB", type: ["RGB", "UNSIGNED_BYTE", "UNSIGNED_SHORT_5_6_5"] },
      R11F_G11F_B10F: {
        format: "RGB",
        type: ["UNSIGNED_INT_10F_11F_11F_REV", "HALF_FLOAT", "FLOAT"],
      },
      RGB9_E5: { format: "RGB", type: ["HALF_FLOAT", "FLOAT"] },
      RGB16F: { format: "RGB", type: ["HALF_FLOAT", "FLOAT"] },
      RGB32F: { format: "RGB", type: ["FLOAT"] },
      RGB8UI: { format: "RGB_INTEGER", type: ["UNSIGNED_BYTE"] },
      RGBA8: { format: "RGBA", type: ["UNSIGNED_BYTE"] },
      SRGB8_ALPHA8: { format: "RGBA", type: ["UNSIGNED_BYTE"] },
      RGB5_A1: { format: "RGBA", type: ["UNSIGNED_BYTE", "UNSIGNED_SHORT_5_5_5_1"] },
      RGB10_A2: { format: "RGBA", type: ["UNSIGNED_INT_2_10_10_10_REV"] },
      RGBA4: { format: "RGBA", type: ["UNSIGNED_BYTE", "UNSIGNED_SHORT_4_4_4_4"] },
      RGBA16F: { format: "RGBA", type: ["HALF_FLOAT", "FLOAT"] },
      RGBA32F: { format: "RGBA", type: ["FLOAT"] },
      RGBA8UI: { format: "RGBA_INTEGER", type: ["UNSIGNED_BYTE"] },
    }
  }

  /**
   * Generate a random format value.
   */
  static WebGLFormat(): string[] {
    const keys = Object.keys(webgl.internalFormat)
    const internalformat = random.item(keys)
    const format = webgl.internalFormat[internalformat].format
    const type = random.item(webgl.internalFormat[internalformat].type)
    return [internalformat, format, type]
  }

  /**
   * Generate a random textureSource interface type.
   */
  static textureSources(): string {
    const sources = ["HTMLCanvasElement", "HTMLImageElement", "HTMLVideoElement", "ImageData"]
    return random.item(sources)
  }

  /**
   * Extract matching attributes from a WebGL shader.
   *
   * @param shader - The target shader.
   * @param regex - The regex to match.
   * @param group - The capture group.
   */
  static match(shader: string, regex: RegExp, group = 1): string[] {
    const matches: string[] = []
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const match = regex.exec(shader)
      if (match) {
        matches.push(match[group])
      } else {
        break
      }
    }
    return matches
  }

  /**
   * Extract the uniform value from a shader.
   *
   * @param shader - The target shader.
   * @param group - That capture group to match.
   */
  static parseUniforms(shader: string, group = 1): string[] {
    /* Todo: Parse their individual data types into categories. */
    return webgl.match(shader, /uniform .+? (\w+)(?=[\[;])/gm, group) // eslint-disable-line no-useless-escape
  }

  /**
   * Extract the attribute value from a shader.
   *
   * @param shader - The target shader.
   * @param group - The capture group to match.
   */
  static parseAttributes(shader: string, group = 1): string[] {
    return webgl.match(shader, /attribute .+? (\w+)(?=;)/gm, group)
  }

  /**
   * Extract the varying value from a WebGL shader.
   *
   * @param shader - The target shader.
   * @param group - The capture group to match.
   */
  static parseVaryings(shader: string, group = 1): string[] {
    return webgl.match(shader, /varying .+? (\w+)(?=;)/gm, group)
  }

  /**
   * Extract the gl_Frag value from a shader.
   *
   * @param shader - The target shader.
   * @param group - The capture group to match.
   */
  static parseFragDatav2(shader: string, group = 1): string[] {
    // #version 200
    return webgl.match(shader, /(gl_Frag[^[ =]+)/gm, group)
  }

  /**
   * Extract the out value from a shader.
   *
   * @param shader - The target shader.
   * @param group - The capture group to match.
   */
  static parseFragDatav3(shader: string, group = 1): string[] {
    // #version 300
    return webgl.match(shader, /out .+? (\w+)(?=[\[;])/gm, group) // eslint-disable-line no-useless-escape
  }

  /**
   * Extract the fragment value from a shader.
   *
   * @param shader - The target shader.
   */
  static parseFrag(shader: string): string[] {
    const matches = webgl.parseFragDatav2(shader)
    if (matches.length) {
      return matches
    }
    return webgl.parseFragDatav3(shader)
  }

  /**
   * Generate a random bitmask.
   */
  static randomBitmask(): number {
    const values: number[] = []
    for (let i = 0; i < 8; i++) {
      values.push(random.item([1, 0]))
    }

    return parseInt(values.join(""), 2)
  }

  /**
   * Generate a random buffer target.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomBufferTarget(isWebGL2: boolean): string {
    const target = ["ARRAY_BUFFER", "ELEMENT_ARRAY_BUFFER"]
    if (isWebGL2) {
      target.push(
        ...[
          "COPY_READ_BUFFER",
          "COPY_WRITE_BUFFER",
          "TRANSFORM_FEEDBACK_BUFFER",
          "UNIFORM_BUFFER",
          "PIXEL_PACK_BUFFER",
          "PIXEL_UNPACK_BUFFER",
        ]
      )
    }
    return random.item(target)
  }

  /**
   * Generate a random texture name.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomTexParameter(isWebGL2: boolean): string {
    const pname = ["TEXTURE_MAG_FILTER", "TEXTURE_MIN_FILTER", "TEXTURE_WRAP_S", "TEXTURE_WRAP_T"]
    if (isWebGL2) {
      pname.push(
        ...[
          "TEXTURE_BASE_LEVEL",
          "TEXTURE_COMPARE_FUNC",
          "TEXTURE_COMPARE_MODE",
          "TEXTURE_MAX_LEVEL",
          "TEXTURE_MAX_LOD",
          "TEXTURE_MIN_LOD",
          "TEXTURE_WRAP_R",
        ]
      )
    }
    return random.item(pname)
  }

  /**
   * Generate a random texture parameter value.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomTexParameterValue(isWebGL2: boolean): [string, string | number] {
    let pnameparam: Record<string, string[]> = {
      TEXTURE_MAG_FILTER: ["LINEAR", "NEAREST"],
      TEXTURE_MIN_FILTER: [
        "LINEAR",
        "NEAREST",
        "NEAREST_MIPMAP_NEAREST",
        "LINEAR_MIPMAP_NEAREST",
        "NEAREST_MIPMAP_LINEA",
        "LINEAR_MIPMAP_LINEAR",
      ],
      TEXTURE_WRAP_S: ["REPEAT", "CLAMP_TO_EDGE", "MIRRORED_REPEAT"],
      TEXTURE_WRAP_T: ["REPEAT", "CLAMP_TO_EDGE", "MIRRORED_REPEAT"],
    }
    if (isWebGL2) {
      pnameparam = Object.assign(pnameparam, {
        TEXTURE_BASE_LEVEL: [make.numbers.any()],
        TEXTURE_COMPARE_FUNC: [
          "LEQUAL",
          "GEQUAL",
          "LESS",
          "GREATER",
          "EQUAL",
          "NOTEQUAL",
          "ALWAYS",
          "NEVER",
        ],
        TEXTURE_COMPARE_MODE: ["NONE", "COMPARE_REF_TO_TEXTURE"],
        TEXTURE_MAX_LEVEL: [make.numbers.any()],
        TEXTURE_MAX_LOD: [make.numbers.float()],
        TEXTURE_MIN_LOD: [make.numbers.float()],
        TEXTURE_WRAP_R: ["REPEAT", "CLAMP_TO_EDGE", "MIRRORED_REPEAT"],
      })
    }
    const pname = random.item(Object.keys(pnameparam))
    const param = random.item(pnameparam[pname])
    return [pname, param]
  }

  /**
   * Generate a random blend mode name.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomBlendMode(isWebGL2: boolean): string {
    const mode = ["FUNC_ADD", "FUNC_SUBTRACT", "FUNC_REVERSE_SUBTRACT"]
    if (isWebGL2) {
      mode.push(...["MIN", "MAX"])
    }
    return random.item(mode)
  }

  /**
   * Generate a random blend value.
   */
  static randomBlendFactor(): string {
    const factor = [
      "ZERO",
      "ONE",
      "SRC_COLOR",
      "ONE_MINUS_SRC_COLOR",
      "DST_COLOR",
      "ONE_MINUS_DST_COLOR",
      "SRC_ALPHA",
      "ONE_MINUS_SRC_ALPHA",
      "DST_ALPHA",
      "ONE_MINUS_DST_ALPHA",
      "CONSTANT_COLOR",
      "ONE_MINUS_CONSTANT_COLOR",
      "CONSTANT_ALPHA",
      "ONE_MINUS_CONSTANT_ALPHA",
      "SRC_ALPHA_SATURATE",
    ]
    return random.item(factor)
  }

  /**
   * Generate a random culling candidate.
   */
  static randomFace(): string {
    const mode = ["FRONT", "BACK", "FRONT_AND_BACK"]
    return random.item(mode)
  }

  /**
   * Generate a random texture image target.
   */
  static randomTexImage2DTarget(): string {
    const target = [
      "TEXTURE_2D",
      "TEXTURE_CUBE_MAP_POSITIVE_X",
      "TEXTURE_CUBE_MAP_NEGATIVE_X",
      "TEXTURE_CUBE_MAP_POSITIVE_Y",
      "TEXTURE_CUBE_MAP_NEGATIVE_Y",
      "TEXTURE_CUBE_MAP_POSITIVE_Z",
      "TEXTURE_CUBE_MAP_NEGATIVE_Z",
    ]
    return random.item(target)
  }

  /**
   * Generate a random texture target.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomTextureTarget(isWebGL2: boolean): string {
    const target = ["TEXTURE_2D", "TEXTURE_CUBE_MAP"]
    if (isWebGL2) {
      target.push(...["TEXTURE_3D", "TEXTURE_2D_ARRAY"])
    }
    return random.item(target)
  }

  /**
   * Generate a random function operator.
   */
  static randomFunc(): string {
    const func = ["NEVER", "LESS", "EQUAL", "LEQUAL", "GREATER", "NOTEQUAL", "GEQUAL", "ALWAYS"]
    return random.item(func)
  }

  /**
   * Generate a random context capability value.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomCap(isWebGL2: boolean): string {
    const cap = [
      "BLEND",
      "CULL_FACE",
      "DEPTH_TEST",
      "DITHER",
      "POLYGON_OFFSET_FILL",
      "SAMPLE_ALPHA_TO_COVERAGE",
      "SAMPLE_COVERAGE",
      "SCISSOR_TEST",
      "STENCIL_TEST",
    ]
    if (isWebGL2) {
      cap.push(...["RASTERIZER_DISCARD"])
    }
    return random.item(cap)
  }

  /**
   * Generate a random context primitive name.
   */
  static randomPrimitive(): string {
    const mode = [
      "POINTS",
      "LINE_STRIP",
      "LINE_LOOP",
      "LINES",
      "TRIANGLE_STRIP",
      "TRIANGLE_FAN",
      "TRIANGLES",
    ]
    return random.item(mode)
  }

  /**
   * Return an array of texture attachment points.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static textureAttachments(isWebGL2: boolean): string[] {
    const attachments = [
      "COLOR_ATTACHMENT0",
      "DEPTH_ATTACHMENT",
      "STENCIL_ATTACHMENT",
      "DEPTH_STENCIL_ATTACHMENT",
    ]
    if (isWebGL2) {
      attachments.push(...[`COLOR_ATTACHMENT${random.range(0, 15)}`])
    }

    return attachments
  }

  /**
   * Generate a random texture attachment.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomTextureAttachment(isWebGL2: boolean): string {
    return random.item(webgl.textureAttachments(isWebGL2))
  }

  /**
   * Generate a random attachment query value.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomAttachmentQuery(isWebGL2: boolean): string {
    const pname = [
      "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE",
      "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME",
      "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL",
      "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",
    ]
    if (isWebGL2) {
      pname.push(
        ...[
          "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE",
          "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE",
          "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING",
          "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE",
          "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE",
          "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE",
          "FRAMEBUFFER_ATTACHMENT_RED_SIZE",
          "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE",
          "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER",
        ]
      )
    }
    return random.item(pname)
  }

  /**
   * Generate a random shader precision value.
   */
  static randomShaderPrecision(): string {
    const precisiontype = [
      "LOW_FLOAT",
      "MEDIUM_FLOAT",
      "HIGH_FLOAT",
      "LOW_INT",
      "MEDIUM_INT",
      "HIGH_INT",
    ]
    return random.item(precisiontype)
  }

  /**
   * Generate a random stencil reference parameter.
   */
  static randomStencilRefParameter(): string {
    const param = [
      "STENCIL_FUNC",
      "STENCIL_VALUE_MASK",
      "STENCIL_REF",
      "STENCIL_BACK_FUNC",
      "STENCIL_BACK_VALUE_MASK",
      "STENCIL_BACK_REF",
      "STENCIL_BITS",
    ]
    return random.item(param)
  }

  /**
   * Generate a random stencil mask parameter.
   */
  static randomStencilMaskParameter(): string {
    const param = ["STENCIL_WRITEMASK", "STENCIL_BACK_WRITEMASK", "STENCIL_BITS"]
    return random.item(param)
  }

  /**
   * Generate a random vertex attribute parameter.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomVertexAttribParameter(isWebGL2: boolean): string {
    const pname = [
      "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING",
      "VERTEX_ATTRIB_ARRAY_ENABLED",
      "VERTEX_ATTRIB_ARRAY_SIZE",
      "VERTEX_ATTRIB_ARRAY_STRIDE",
      "VERTEX_ATTRIB_ARRAY_TYPE",
      "VERTEX_ATTRIB_ARRAY_NORMALIZED",
      "CURRENT_VERTEX_ATTRIB",
    ]
    if (isWebGL2) {
      pname.push(
        ...[
          "VERTEX_ATTRIB_ARRAY_INTEGER",
          "VERTEX_ATTRIB_ARRAY_DIVISOR",
          "VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE",
        ]
      )
    }
    return random.item(pname)
  }

  /**
   * Generate a random behavior hint name.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomHint(isWebGL2: boolean): string {
    const target = ["GENERATE_MIPMAP_HINT"]
    if (isWebGL2) {
      target.push(...["FRAGMENT_SHADER_DERIVATIVE_HINT"])
    }
    return random.item(target)
  }

  /**
   * Generate a random behavior hint mode.
   */
  static randomHintMode(): string {
    const mode = ["FASTEST", "NICEST", "DONT_CARE"]
    return random.item(mode)
  }

  /**
   * Generate a random pixel storage name and value.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomPixelStorage(isWebGL2: boolean): (string | number | boolean)[] {
    const pname: Record<string, number | boolean> = {
      PACK_ALIGNMENT: random.item([1, 2, 4, 8]),
      UNPACK_ALIGNMENT: random.item([1, 2, 4, 8]),
      UNPACK_FLIP_Y_WEBGL: random.bool(),
      UNPACK_PREMULTIPLY_ALPHA_WEBGL: random.bool(),
      UNPACK_COLORSPACE_CONVERSION_WEBGL: random.item([0, 0x9244]),
    }
    if (isWebGL2) {
      Object.assign(pname, {
        PACK_ROW_LENGTH: make.numbers.any(),
        PACK_SKIP_PIXELS: make.numbers.any(),
        PACK_SKIP_ROWS: make.numbers.any(),
        UNPACK_ROW_LENGTH: make.numbers.any(),
        UNPACK_IMAGE_HEIGHT: make.numbers.any(),
        UNPACK_SKIP_PIXELS: make.numbers.any(),
        UNPACK_SKIP_ROWS: make.numbers.any(),
        UNPACK_SKIP_IMAGES: make.numbers.any(),
      })
    }
    const name = random.item(Object.keys(pname))
    return [name, pname[name]]
  }

  /**
   * Generate a random stencil action.
   */
  static randomStencilAction(): string {
    const action = ["KEEP", "ZERO", "REPLACE", "INCR", "INCR_WRAP", "DECR", "DECR_WRAP", "INVERT"]
    return random.item(action)
  }

  /**
   * Generate a random query target.
   */
  static randomQueryTarget(): string {
    const target = [
      "ANY_SAMPLES_PASSED",
      "ANY_SAMPLES_PASSED_CONSERVATIVE",
      "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN",
    ]
    return random.item(target)
  }

  /**
   * Generate a random query parameter name.
   */
  static randomQueryPname(): string {
    const pname = ["CURRENT_QUERY", "QUERY_RESULT", "QUERY_RESULT_AVAILABLE"]
    return random.item(pname)
  }

  /**
   * Generate a random sampler parameter name.
   */
  static randomSamplerParameter(): string {
    const pname = [
      "TEXTURE_MAG_FILTER",
      "TEXTURE_MIN_FILTER",
      "TEXTURE_WRAP_S",
      "TEXTURE_WRAP_T",
      "TEXTURE_BASE_LEVEL",
      "TEXTURE_COMPARE_FUNC",
      "TEXTURE_COMPARE_MODE",
      "TEXTURE_MAX_LEVEL",
      "TEXTURE_WRAP_R",
      "TEXTURE_MAX_LOD",
      "TEXTURE_MIN_LOD",
      "TEXTURE_MAX_ANISOTROPY_EXT",
    ]
    return random.item(pname)
  }

  /**
   * Generate a random sync parameter name.
   */
  static randomSyncParameter(): string {
    const pname = ["OBJECT_TYPE", "SYNC_STATUS", "SYNC_CONDITION", "SYNC_FLAGS"]
    return random.item(pname)
  }

  /**
   * Generate a random clear buffer target.
   */
  static randomClearBuffer(): string {
    const buffer = ["COLOR", "DEPTH", "STENCIL", "DEPTH_STENCIL"]
    return random.item(buffer)
  }

  /**
   * Generate a random bind buffer target.
   */
  static randomBindBufferTarget(): string {
    const target = ["TRANSFORM_FEEDBACK_BUFFER", "UNIFORM_BUFFER"]
    return random.item(target)
  }

  /**
   * Generate a random indexed parameter target name.
   */
  static randomIndexedParameterTarget(): string {
    const target = [
      "TRANSFORM_FEEDBACK_BUFFER_BINDING",
      "TRANSFORM_FEEDBACK_BUFFER_SIZE",
      "TRANSFORM_FEEDBACK_BUFFER_START",
      "UNIFORM_BUFFER_BINDING",
      "UNIFORM_BUFFER_SIZE",
      "UNIFORM_BUFFER_START",
    ]
    return random.item(target)
  }

  /**
   * Generate a random uniform parameter name.
   */
  static randomUniformParameter(): string {
    const pname = [
      "UNIFORM_TYPE",
      "UNIFORM_SIZE",
      "UNIFORM_BLOCK_INDEX",
      "UNIFORM_OFFSET",
      "UNIFORM_ARRAY_STRIDE",
      "UNIFORM_MATRIX_STRIDE",
      "UNIFORM_IS_ROW_MAJOR",
    ]
    return random.item(pname)
  }

  /**
   * Generate a random uniform block parameter name.
   */
  static randomUniformBlockParameter(): string {
    const pname = [
      "UNIFORM_BLOCK_BINDING",
      "UNIFORM_BLOCK_DATA_SIZE",
      "UNIFORM_BLOCK_ACTIVE_UNIFORMS",
      "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES",
      "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER",
      "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER",
    ]
    return random.item(pname)
  }

  /**
   * Generate a random pixel data type.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomPixelDatatype(isWebGL2: boolean): string {
    const types = [
      "UNSIGNED_BYTE",
      "UNSIGNED_SHORT_5_6_5",
      "UNSIGNED_SHORT_4_4_4_4",
      "UNSIGNED_SHORT_5_5_5_1",
      "FLOAT",
    ]

    if (isWebGL2) {
      types.push(
        ...[
          "BYTE",
          "UNSIGNED_INT_2_10_10_10_REV",
          "HALF_FLOAT",
          "SHORT",
          "UNSIGNED_SHORT",
          "INT",
          "UNSIGNED_INT",
          "UNSIGNED_INT_10F_11F_11F_REV",
          "UNSIGNED_INT_5_9_9_9_REV",
        ]
      )
    }
    return random.item(types)
  }

  /**
   * Generate a random pixel format type.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomPixelFormat(isWebGL2: boolean): string {
    const formats = ["ALPHA", "RGB", "RGBA"]
    if (isWebGL2) {
      formats.push(...["RED", "RG", "RED_INTEGER", "RG_INTEGER", "RGB_INTEGER", "RGBA_INTEGER"])
    }
    return random.item(formats)
  }

  /**
   * Generate a random buffer usage value.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomBufferUsage(isWebGL2: boolean): string {
    const usage = ["STATIC_DRAW", "DYNAMIC_DRAW", "STREAM_DRAW"]
    if (isWebGL2) {
      usage.push(
        ...[
          "STATIC_READ",
          "DYNAMIC_READ",
          "STREAM_READ",
          "STATIC_COPY",
          "DYNAMIC_COPY",
          "STREAM_COPY",
        ]
      )
    }
    return random.item(usage)
  }

  /**
   * Generate a random parameter name.
   *
   * @param isWebGL2 - Boolean indicating if WebGL2 is in use.
   */
  static randomParameter(isWebGL2: boolean): string {
    const pname = [
      "ACTIVE_TEXTURE",
      "ALIASED_LINE_WIDTH_RANGE",
      "ALIASED_POINT_SIZE_RANGE",
      "ALPHA_BITS",
      "ARRAY_BUFFER_BINDING",
      "BLEND",
      "BLEND_COLOR",
      "BLEND_DST_ALPHA",
      "BLEND_DST_RGB",
      "BLEND_EQUATION_ALPHA",
      "BLEND_EQUATION_RGB",
      "BLEND_SRC_ALPHA",
      "BLEND_SRC_RGB",
      "BLUE_BITS",
      "COLOR_CLEAR_VALUE",
      "COLOR_WRITEMASK",
      "COMPRESSED_TEXTURE_FORMATS",
      "CULL_FACE",
      "CULL_FACE_MODE",
      "CURRENT_PROGRAM",
      "DEPTH_BITS",
      "DEPTH_CLEAR_VALUE",
      "DEPTH_FUNC",
      "DEPTH_RANGE",
      "DEPTH_TEST",
      "DEPTH_WRITEMASK",
      "DITHER",
      "ELEMENT_ARRAY_BUFFER_BINDING",
      "FRAMEBUFFER_BINDING",
      "FRONT_FACE",
      "GENERATE_MIPMAP_HINT",
      "GREEN_BITS",
      "IMPLEMENTATION_COLOR_READ_FORMAT",
      "IMPLEMENTATION_COLOR_READ_TYPE",
      "LINE_WIDTH",
      "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
      "MAX_CUBE_MAP_TEXTURE_SIZE",
      "MAX_FRAGMENT_UNIFORM_VECTORS",
      "MAX_RENDERBUFFER_SIZE",
      "MAX_TEXTURE_IMAGE_UNITS",
      "MAX_TEXTURE_SIZE",
      "MAX_VARYING_VECTORS",
      "MAX_VERTEX_ATTRIBS",
      "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
      "MAX_VERTEX_UNIFORM_VECTORS",
      "MAX_VIEWPORT_DIMS",
      "PACK_ALIGNMENT",
      "POLYGON_OFFSET_FACTOR",
      "POLYGON_OFFSET_FILL",
      "POLYGON_OFFSET_UNITS",
      "RED_BITS",
      "RENDERBUFFER_BINDING",
      "RENDERER",
      "SAMPLE_ALPHA_TO_COVERAGE",
      "SAMPLE_BUFFERS",
      "SAMPLE_COVERAGE",
      "SAMPLE_COVERAGE_INVERT",
      "SAMPLE_COVERAGE_VALUE",
      "SAMPLES",
      "SCISSOR_BOX",
      "SCISSOR_TEST",
      "SHADING_LANGUAGE_VERSION",
      "STENCIL_BACK_FAIL",
      "STENCIL_BACK_FUNC",
      "STENCIL_BACK_PASS_DEPTH_FAIL",
      "STENCIL_BACK_PASS_DEPTH_PASS",
      "STENCIL_BACK_REF",
      "STENCIL_BACK_VALUE_MASK",
      "STENCIL_BACK_WRITEMASK",
      "STENCIL_BITS",
      "STENCIL_CLEAR_VALUE",
      "STENCIL_FAIL",
      "STENCIL_FUNC",
      "STENCIL_PASS_DEPTH_FAIL",
      "STENCIL_PASS_DEPTH_PASS",
      "STENCIL_REF",
      "STENCIL_TEST",
      "STENCIL_VALUE_MASK",
      "STENCIL_WRITEMASK",
      "SUBPIXEL_BITS",
      "TEXTURE_BINDING_2D",
      "TEXTURE_BINDING_CUBE_MAP",
      "UNPACK_ALIGNMENT",
      "UNPACK_COLORSPACE_CONVERSION_WEBGL",
      "UNPACK_FLIP_Y_WEBGL",
      "UNPACK_PREMULTIPLY_ALPHA_WEBGL",
      "VENDOR",
      "VERSION",
      "VIEWPORT",
      "VERSION",
      "SHADING_LANGUAGE_VERSION",
      "VENDOR",
      "RENDERER",
    ]

    if (isWebGL2) {
      pname.push(
        ...[
          "COPY_READ_BUFFER_BINDING",
          "COPY_WRITE_BUFFER_BINDING",
          "DRAW_BUFFERi",
          "DRAW_FRAMEBUFFER_BINDING",
          "FRAGMENT_SHADER_DERIVATIVE_HINT",
          "MAX_3D_TEXTURE_SIZE",
          "MAX_ARRAY_TEXTURE_LAYERS",
          "MAX_CLIENT_WAIT_TIMEOUT_WEBGL",
          "MAX_COLOR_ATTACHMENTS",
          "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",
          "MAX_COMBINED_UNIFORM_BLOCKS",
          "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",
          "MAX_DRAW_BUFFERS",
          "MAX_ELEMENT_INDEX",
          "MAX_ELEMENTS_INDICE",
          "MAX_ELEMENTS_VERTICES",
          "MAX_FRAGMENT_INPUT_COMPONENTS",
          "MAX_FRAGMENT_UNIFORM_BLOCKS",
          "MAX_FRAGMENT_UNIFORM_COMPONENTS",
          "MAX_PROGRAM_TEXEL_OFFSET",
          "MAX_SAMPLES",
          "MAX_SERVER_WAIT_TIMEOUT",
          "MAX_TEXTURE_LOD_BIAS",
          "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",
          "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",
          "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",
          "MAX_UNIFORM_BLOCK_SIZE",
          "MAX_UNIFORM_BUFFER_BINDINGS",
          "MAX_VARYING_COMPONENTS",
          "MAX_VERTEX_OUTPUT_COMPONENTS",
          "MAX_VERTEX_UNIFORM_BLOCKS",
          "MAX_VERTEX_UNIFORM_COMPONENTS",
          "MIN_PROGRAM_TEXEL_OFFSET",
          "PACK_ROW_LENGTH",
          "PACK_SKIP_PIXELS",
          "PACK_SKIP_ROWS",
          "PIXEL_PACK_BUFFER_BINDING",
          "PIXEL_UNPACK_BUFFER_BINDING",
          "RASTERIZER_DISCARD",
          "READ_BUFFER",
          "READ_FRAMEBUFFER_BINDING",
          "SAMPLER_BINDING",
          "TEXTURE_BINDING_2D_ARRAY",
          "TEXTURE_BINDING_3D",
          "TRANSFORM_FEEDBACK_ACTIVE",
          "TRANSFORM_FEEDBACK_BINDING",
          "TRANSFORM_FEEDBACK_BUFFER_BINDING",
          "TRANSFORM_FEEDBACK_PAUSED",
          "UNIFORM_BUFFER_BINDING",
          "UNIFORM_BUFFER_OFFSET_ALIGNMENT",
          "UNPACK_IMAGE_HEIGHT",
          "UNPACK_ROW_LENGTH",
          "UNPACK_SKIP_IMAGES",
          "UNPACK_SKIP_PIXELS",
          "UNPACK_SKIP_ROWS",
          "VERTEX_ARRAY_BINDING",
        ]
      )
    }
    return random.item(pname)
  }

  /**
   * Generate a random program parameter name.
   */
  static randomProgramParameter(): string {
    const pname = [
      "DELETE_STATUS",
      "LINK_STATUS",
      "VALIDATE_STATUS",
      "ATTACHED_SHADERS",
      "ACTIVE_ATTRIBUTES",
      "ACTIVE_UNIFORMS",
      "TRANSFORM_FEEDBACK_BUFFER_MODE",
      "TRANSFORM_FEEDBACK_VARYINGS",
      "ACTIVE_UNIFORM_BLOCKS",
    ]
    return random.item(pname)
  }

  /**
   * Generate a random render buffer parameter.
   */
  static randomRenderBufferParameter(): string {
    const pname = [
      "RENDERBUFFER_WIDTH",
      "RENDERBUFFER_HEIGHT",
      "RENDERBUFFER_INTERNAL_FORMAT",
      "RENDERBUFFER_RED_SIZE",
      "RENDERBUFFER_GREEN_SIZE",
      "RENDERBUFFER_BLUE_SIZE",
      "RENDERBUFFER_ALPHA_SIZE",
      "RENDERBUFFER_DEPTH_SIZE",
      "RENDERBUFFER_STENCIL_SIZE",
    ]
    return random.item(pname)
  }

  /**
   * Generate a random extension interface name.
   *
   * @param pattern - Limits results to those matching the supplied string.
   */
  static randomExtension(pattern?: string): string {
    const extensions = [
      "ANGLE_instanced_arrays",
      "EXT_blend_minmax",
      "EXT_color_buffer_half_float",
      "EXT_frag_depth",
      "EXT_sRGB",
      "EXT_shader_texture_lod",
      "EXT_texture_filter_anisotropic",
      "EXT_disjoint_timer_query",
      "OES_element_index_uint",
      "OES_standard_derivatives",
      "OES_texture_float",
      "OES_texture_float_linear",
      "OES_texture_half_float",
      "OES_texture_half_float_linear",
      "OES_vertex_array_object",
      "WEBGL_color_buffer_float",
      "WEBGL_compressed_texture_s3tc",
      "WEBGL_compressed_texture_s3tc_srgb",
      "WEBGL_debug_renderer_info",
      "WEBGL_debug_shaders",
      "WEBGL_depth_texture",
      "WEBGL_draw_buffers",
      "WEBGL_lose_context",
    ]

    if (pattern) {
      const candidates: string[] = []
      extensions.forEach((ext) => (ext.includes(pattern) ? candidates.push(ext) : ""))
      if (candidates.length >= 0) {
        return random.item(candidates)
      }
    }

    return random.item(extensions)
  }
}
