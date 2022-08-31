/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** Class for generating WebGL shader related values. */
export class shaders {
  /** Return a WebGL fragment shader. */
  static get fragment1(): string {
    return [
      "precision highp float;",
      "varying vec2 v_vec2;",
      "varying vec3 v_vec3;",
      "uniform sampler2D u_sampler2d;",
      "uniform samplerCube u_samplercube;",
      "void main() {",
      "  gl_FragColor = texture2D(u_sampler2d, v_vec2);",
      "  gl_FragColor += textureCube(u_samplercube, normalize(v_vec3));",
      "}",
    ].join("\n")
  }

  /** Return a WebGL vertex shader. */
  static get vertex1(): string {
    return [
      "precision highp float;",
      "attribute vec4 a_vec4;",
      "uniform bool u_bool;",
      "uniform bvec2 u_bvec2;",
      "uniform bvec3 u_bvec3;",
      "uniform bvec4 u_bvec4;",
      "uniform float u_float;",
      "uniform int u_int;",
      "uniform ivec2 u_ivec2;",
      "uniform ivec3 u_ivec3;",
      "uniform ivec4 u_ivec4;",
      "uniform mat2 u_mat2;",
      "uniform mat3 u_mat3;",
      "uniform mat4 u_mat4;",
      "uniform vec2 u_vec2;",
      "uniform vec3 u_vec3;",
      "uniform vec4 u_vec4;",
      "varying vec3 position;",
      "varying vec2 v_vec2;",
      "varying vec3 v_vec3;",
      "void main() {",
      "  gl_Position.x += float(a_vec4.x);",
      "  gl_Position.x += u_float;",
      "  gl_Position.x += u_vec2.x;",
      "  gl_Position.x += u_vec3.x;",
      "  gl_Position.x += u_vec4.x;",
      "  gl_Position.x += u_mat2[0][0];",
      "  gl_Position.x += u_mat3[0][0];",
      "  gl_Position.x += u_mat4[0][0];",
      "  gl_Position.x += float(u_int);",
      "  gl_Position.x += float(u_ivec2.x);",
      "  gl_Position.x += float(u_ivec3.x);",
      "  gl_Position.x += float(u_ivec4.x);",
      "  if (u_bool || u_bvec2.x || u_bvec3.x || u_bvec4.x) {",
      "    gl_Position += float(0.1);",
      "  }",
      "  gl_Position.x += float(position.x);",
      "}",
    ].join("\n")
  }

  /** Return a WebGL2 fragment shader. */
  static get fragment2(): string {
    return [
      "#version 300 es",
      "precision highp float;",
      "in vec2 v_vec2;",
      "in vec3 v_vec3;",
      "uniform sampler2D u_sampler2d;",
      "uniform samplerCube u_samplercube;",
      "out vec4 outColor;",
      "void main() {",
      "  outColor = texture(u_sampler2d, v_vec2);",
      "  outColor += texture(u_samplercube, normalize(v_vec3));",
      "}",
    ].join("\n")
  }

  /** Return a WebGL2 vertex shader. */
  static get vertex2(): string {
    return [
      "#version 300 es",
      "precision highp float;",
      "uniform bool u_bool;",
      "uniform bvec2 u_bvec2;",
      "uniform bvec3 u_bvec3;",
      "uniform bvec4 u_bvec4;",
      "uniform float u_float;",
      "uniform int u_int;",
      "uniform ivec2 u_ivec2;",
      "uniform ivec3 u_ivec3;",
      "uniform ivec4 u_ivec4;",
      "uniform mat2 u_mat2;",
      "uniform mat3 u_mat3;",
      "uniform mat4 u_mat4;",
      "uniform mat2x3 u_mat2x3;",
      "uniform mat2x4 u_mat2x4;",
      "uniform mat3x2 u_mat3x2;",
      "uniform mat3x4 u_mat3x4;",
      "uniform mat4x2 u_mat4x2;",
      "uniform mat4x3 u_mat4x3;",
      "uniform uint u_uint;",
      "uniform uvec2 u_uvec2;",
      "uniform uvec3 u_uvec3;",
      "uniform uvec4 u_uvec4;",
      "uniform vec2 u_vec2;",
      "uniform vec3 u_vec3;",
      "uniform vec4 u_vec4;",
      "in vec3 position;",
      "out vec2 v_vec2;",
      "out vec3 v_vec3;",
      "void main() {",
      "  gl_Position.x += u_float;",
      "  gl_Position.x += u_vec2.x;",
      "  gl_Position.x += u_vec3.x;",
      "  gl_Position.x += u_vec4.x;",
      "  gl_Position.x += u_mat2[0][0];",
      "  gl_Position.x += u_mat3[0][0];",
      "  gl_Position.x += u_mat4[0][0];",
      "  gl_Position.x += u_mat2x3[0][0];",
      "  gl_Position.x += u_mat2x4[0][0];",
      "  gl_Position.x += u_mat3x2[0][0];",
      "  gl_Position.x += u_mat3x4[0][0];",
      "  gl_Position.x += u_mat4x2[0][0];",
      "  gl_Position.x += u_mat4x3[0][0];",
      "  gl_Position.x += float(u_int);",
      "  gl_Position.x += float(u_uint);",
      "  gl_Position.x += float(u_ivec2.x);",
      "  gl_Position.x += float(u_ivec3.x);",
      "  gl_Position.x += float(u_ivec4.x);",
      "  gl_Position.x += float(u_uvec2.x);",
      "  gl_Position.x += float(u_uvec3.x);",
      "  gl_Position.x += float(u_uvec4.x);",
      "  if (u_bool || u_bvec2.x || u_bvec3.x || u_bvec4.x) {",
      "    gl_Position += float(0.1);",
      "  }",
      "  gl_Position.x += float(position.x);",
      "}",
    ].join("\n")
  }
}
