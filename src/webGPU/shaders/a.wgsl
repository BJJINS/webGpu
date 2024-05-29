@vertex
fn main(@location(0) pos:vec3f)->@builtin(position) vec4f {
  return pos
}