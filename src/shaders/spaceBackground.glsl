// Space Background - Starfield with parallax
export const spaceBackgroundVertex = `
  attribute float size;
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const spaceBackgroundFragment = `
  varying vec3 vPosition;
  void main() {
    float distance = length(gl_PointCoord - vec2(0.5));
    if (distance > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
    float brightness = 0.8 + 0.2 * sin(gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.1);
    
    gl_FragColor = vec4(0.9, 0.95, 1.0, alpha * brightness);
  }
`;