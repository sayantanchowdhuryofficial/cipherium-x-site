const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "2";

const gl = canvas.getContext("webgl");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

const vertex = `
attribute vec2 position;
void main(){
gl_Position = vec4(position,0.0,1.0);
}
`;

const fragment = `
precision mediump float;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

void main(){
vec2 st = gl_FragCoord.xy / u_resolution.xy;
float d = distance(st, u_mouse);
float glow = 0.02 / d;

vec3 purple = vec3(0.5,0.0,1.0);
vec3 blue = vec3(0.0,0.6,1.0);

vec3 color = mix(purple, blue, sin(u_time)*0.5+0.5);
color *= glow;

gl_FragColor = vec4(color,1.0);
}
`;

function createShader(type, source){
const shader = gl.createShader(type);
gl.shaderSource(shader, source);
gl.compileShader(shader);
return shader;
}

const program = gl.createProgram();
gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertex));
gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragment));
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
-1,-1,
1,-1,
-1,1,
1,1
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const position = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

const mouseUniform = gl.getUniformLocation(program, "u_mouse");
const resolutionUniform = gl.getUniformLocation(program, "u_resolution");
const timeUniform = gl.getUniformLocation(program, "u_time");

let mouse = {x:0.5,y:0.5};

window.addEventListener("mousemove", e=>{
mouse.x = e.clientX / canvas.width;
mouse.y = 1 - e.clientY / canvas.height;
});

function render(time){
gl.uniform2f(mouseUniform, mouse.x, mouse.y);
gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
gl.uniform1f(timeUniform, time*0.001);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
requestAnimationFrame(render);
}

render(0);

window.addEventListener("resize", ()=>{
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0,0,canvas.width,canvas.height);
});
