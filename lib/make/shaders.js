/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.shaders = {
  fragment1: [
    [
      '#ifdef GL_ES',
      'precision mediump float;',
      '#endif',
      'varying vec4 vColor;',
      'void main() {',
      'gl_FragColor=vColor;',
      '}'
    ],
    [
      'varying highp vec2 vTextureCoord;',
      'varying highp vec3 vLighting;',
      'uniform sampler2D uSampler;',
      'void main(void) {',
      'highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
      'gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);',
      '}'
    ]
  ],
  vertex1: [
    [
      'attribute vec4 aVertex;',
      'attribute vec4 aColor;',
      'varying vec4 vColor;',
      'void main(){',
      'vColor=aColor;',
      'gl_Position=aVertex;',
      '}'
    ],
    [
      'attribute highp vec3 aVertexNormal;',
      'attribute highp vec3 aVertexPosition;',
      'attribute highp vec2 aTextureCoord;',
      'uniform highp mat4 uNormalMatrix;',
      'uniform highp mat4 uMVMatrix;',
      'uniform highp mat4 uPMatrix;',
      'varying highp vec2 vTextureCoord;',
      'varying highp vec3 vLighting;',
      'void main(void) {',
      'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
      'vTextureCoord = aTextureCoord;',
      'highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);',
      'highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);',
      'highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);',
      'highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);',
      'highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);',
      'vLighting = ambientLight + (directionalLightColor * directional);',
      '}'
    ]
  ],
  fragment2: [
    [
      'varying highp vec2 vTextureCoord;',
      'varying highp vec3 vLighting;',
      'uniform sampler2D uSampler;',
      'void main(void) {',
      'highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
      'gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);',
      '}'
    ],
    [
      '#version proto-200',
      'uniform sampler2D albedoMap;',
      'uniform sampler2D normalMap;',
      'varying vec3 varyingTangent;',
      'varying vec3 varyingBitangent;',
      'varying vec3 varyingNormal;',
      'varying vec2 varyingUV;',
      'void main(void) {',
      'vec3 albedo=texture2D(albedoMap,varyingUV).rgb;',
      'vec3 normal=texture2D(normalMap,varyingUV).rgb*2.0-1.0;',
      'float specularFactor=pow((albedo.r+albedo.g+albedo.b)*0.33,2.0);',
      'float specularHardness=2.0;',
      'vec3 spaceNormal=varyingTangent*normal.x+varyingBitangent*normal.y+varyingNormal*normal.z;',
      'gl_FragData[0]=vec4(albedo,1.0);',
      'gl_FragData[1]=vec4(spaceNormal*0.5 +0.5,1.0);',
      'gl_FragData[2]=vec4(specularFactor,specularHardness*0.1,0.0,1.0);',
      '}'
    ]
  ],
  vertex2: [
    [
      'attribute highp vec3 aVertexNormal;',
      'attribute highp vec3 aVertexPosition;',
      'attribute highp vec2 aTextureCoord;',
      'uniform highp mat4 uNormalMatrix;',
      'uniform highp mat4 uMVMatrix;',
      'uniform highp mat4 uPMatrix;',
      'varying highp vec2 vTextureCoord;',
      'varying highp vec3 vLighting;',
      'void main(void) {',
      'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
      'vTextureCoord = aTextureCoord;',
      'highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);',
      'highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);',
      'highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);',
      'highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);',
      'highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);',
      'vLighting = ambientLight + (directionalLightColor * directional);',
      '}'
    ],
    [
      '#version proto-200',
      'attribute vec3 vertexPosition;',
      'attribute vec3 vertexTangent;',
      'attribute vec3 vertexBitangent;',
      'attribute vec3 vertexNormal;',
      'attribute vec2 vertexUV;',
      'uniform mat4 modelMatrix;',
      'uniform mat4 viewMatrix;',
      'varying vec3 varyingTangent;',
      'varying vec3 varyingBitangent;',
      'varying vec3 varyingNormal;',
      'varying vec2 varyingUV;',
      'void main(void){',
      'gl_Position=viewMatrix*(modelMatrix*vec4(vertexPosition,1.0));',
      'gl_Position.xy=gl_Position.xy*0.5+(float(gl_InstanceID)-0.5);',
      'varyingTangent=(modelMatrix*vec4(vertexTangent,0.0)).xyz;',
      'varyingBitangent=(modelMatrix*vec4(vertexBitangent,0.0)).xyz;',
      'varyingNormal=(modelMatrix*vec4(vertexNormal,0.0)).xyz;',
      'varyingUV = vertexUV;',
      '}'
    ]
  ],
  shaderPair: function (v, f) {
    let i = random.number(v.length)
    return {
      vertex: utils.common.quote(v[i].join('\n')),
      fragment: utils.common.quote(f[i].join('\n'))
    }
  }
}
