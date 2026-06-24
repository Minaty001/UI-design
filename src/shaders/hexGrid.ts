// Hex Grid Shader
export const hexVertex = `
  attribute float activation;
  attribute float timeOffset;
  varying float vActivation;
  varying float vTimeOffset;
  void main() {
    vActivation = activation;
    vTimeOffset = timeOffset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const hexFragment = `
  uniform float time;
  uniform vec3 activeColor;
  uniform vec3 inactiveColor;
  varying float vActivation;
  varying float vTimeOffset;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float hexMask = step(0.5, dist);
    
    float ripple = sin(time * 2.0 + vTimeOffset) * 0.5 + 0.5;
    float activation = smoothstep(0.0, 0.3, vActivation + ripple * 0.2);
    
    vec3 color = mix(inactiveColor, activeColor, activation);
    float alpha = 0.3 + 0.7 * activation;
    
    gl_FragColor = vec4(color, alpha * (1.0 - hexMask));
  }
`;