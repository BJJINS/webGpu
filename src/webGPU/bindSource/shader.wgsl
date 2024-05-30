@vertex
fn main(@location(0) pos: vec2f) -> @builtin(position) vec4f {
    return vec4f(pos, 0.0, 1.0);
}


@group(0) @binding(0) var<uniform> color:vec4<f32>;
@fragment
fn fs() -> @location(0) vec4<f32> {
    return color;
}