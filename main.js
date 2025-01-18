
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three/build/three.module.js';
import * as THREE from '/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 0);
renderer.setAnimationLoop( render );
document.body.appendChild( renderer.domElement );
window.addEventListener( 'resize', onWindowResize );

const shaderMaterial = new THREE.ShaderMaterial({
	uniforms: {
		time: { value: 0.0 },
		resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
	},
	vertexShader:`
	uniform vec2 resolution;
		void main() {
			float s = resolution.y / resolution.x * 1.5;
			gl_Position = vec4((position.xy - vec2(0.5, 0.215)) * vec2(s, 1.35) + vec2(s, 1.0) * 0.5, 0, 1);
		}`,
	fragmentShader: `
		uniform float time;
		uniform vec2 resolution;

		void main() {
			//Modified from https://glslsandbox.com/e#42263.0
			vec2 o = gl_FragCoord.xy - resolution * 0.5; //[-1, 1]
			float gradient = max(abs(o.x) * 0.9 + o.y * 0.5, -o.y) * 2.f / resolution.y - 0.25;
			float ramp = min(time * 1.01, 0.07);
			vec4 rot = ramp * sin(1.5 * vec4(1,2,3,4) + time / 45.0 + atan(o.y, o.x) + time * 1.75);
			vec4 mask = clamp(max(gradient - rot - 0.1 * sin(time), rot.yzwx - gradient) * resolution.y, 0.0, 1.0);
			gl_FragColor = dot(mask, 82.0*(rot-rot.yzwx)) * (rot-0.1)*1.5;
		}`
});

const cube = new THREE.Mesh( new THREE.PlaneGeometry( 1,1 ), shaderMaterial );
scene.add( cube );

function render() {
	shaderMaterial.uniforms.time.value += 0.005;
	renderer.render( scene, camera );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	shaderMaterial.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
}
