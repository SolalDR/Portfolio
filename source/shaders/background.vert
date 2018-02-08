
// Wave coord start
uniform vec2 waveCoords;
uniform float waveRadius;
uniform float waveStrength;

// Mouse position in scene [-1 : 1] & screen [window.innerWidth : window.innerHeight]
uniform vec2 mouse;
uniform vec2 screenMouse;

// window.innerWidth / window.innerHeight
uniform vec2 boundaries;

// The scroll in x & y
uniform vec2 scroll; 

// Position of form 
attribute vec2 position;
attribute vec2 localPosition;

// Canvas texture
uniform sampler2D texture;

varying vec4 color;


vec4 getColor(vec2 pos, sampler2D text) {
	vec2 uv = pos;

	vec2 trueUV = vec2(0.);
	
	// trueUV.x = (uv.x + 1.) / 2. - 0.5;
	// trueUV.y =  (uv.y + 1.) / 2. * -1. + .5;


	uv.y *= -1.; 
	
	trueUV.x = (uv.x + 1.) / 2.;
	trueUV.y =  (uv.y + 1.) / 2.;

	vec4 pixColor = texture2D(text, trueUV);
	vec4 c = vec4(0.1, 0.1, 0.1, 1);

	if(pixColor.xy == vec2(0., 0.)) {
		c = vec4(1.0, 0., 0., 1);
	}

	return c; 
}

void main() {
		
	

	vec2 newPosition = position;

	newPosition.y = mod(position.y + scroll.y, 2.) - 1.;
	newPosition.x = mod(position.x + scroll.x, 2.) - 1.;


	color = getColor(newPosition, texture);

	float intensityMouse = 1. - min(1., distance(mouse, newPosition)/0.2);
	
	float distanceY = abs(distance(waveCoords, newPosition) - waveRadius);
	float distanceX = abs(distance(waveCoords, newPosition) - waveRadius);

	vec2 intensityWave = vec2(
		waveStrength  * 1.5 * (1. - min(1., distanceX / 0.15 )),
		waveStrength  * 1.5 * (1. - min(1., distanceY / 0.15 ))
	);
	

	newPosition += localPosition * (1. + intensityMouse*2. + intensityWave);
	
	if( color == vec4(1.0, 0., 0., 1) ){
		newPosition += localPosition * 5.;
	} else {
		newPosition += localPosition;
	}
	

	gl_Position = vec4(newPosition, 0, 1);	
}