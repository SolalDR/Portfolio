precision mediump float;

varying vec2 uv;
uniform sampler2D texture;

void main() {
	vec2 trueUV = vec2(0.);
	
	trueUV.x = (uv.x + 1.) / 2.;
	trueUV.y =  (uv.y + 1.) / 2. * -1. + .5;

	vec4 textureLocal = texture2D(texture, trueUV);
	if(textureLocal.xy == vec2(0., 0.)) {
		gl_FragColor = vec4(1.0, 0., 0., 1);
	} else {
		gl_FragColor = vec4(0.5, 0.5, 0.5, 1);
	}
}