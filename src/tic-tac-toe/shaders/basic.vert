  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  attribute vec3 aVertexNormal;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uNormalMatrix;

  varying lowp vec4 vColor;
  varying highp vec3 vLighting;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
    
    // apply lighting effect
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);

    highp vec3 directionalLightColor = vec3(0.8, 0.8, 0.8);
    highp vec3 directionalVector = normalize(vec3(-0.3, 0.8, 0.7));
    highp vec3 directionalVector2 = normalize(vec3(0.3, -0.2, 0.1));

    highp vec3 directionalLightColor3 = vec3(0.0, 0.0, 1.0);
    highp vec3 directionalVector3 = normalize(vec3(0.0, 0.0, 1.0));

    highp vec4 transformedNormal = normalize(uNormalMatrix * vec4(aVertexNormal, 0.0));

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    highp float directional2 = max(dot(transformedNormal.xyz, directionalVector2), 0.0);
    highp float directional3 = max(dot(transformedNormal.xyz, directionalVector3), 0.0);
    vLighting = ambientLight + (directionalLightColor * (directional + directional2)) + (directionalLightColor3 * directional3);
  }