uniform vec2 mouse;

uniform vec2 waveCoords;
uniform float waveRadius;
uniform float waveStrength;

uniform float ratio;

uniform vec2 scroll; 
uniform vec2 offset;

uniform vec2 boundaries;

attribute vec2 position;
attribute vec2 localPosition;
attribute vec2 sPosition;

varying vec2 uv;

void main() {
		
	vec2 newPosition = position + offset;

	newPosition.y = mod(position.y + scroll.y, 2.) - 1.;
	newPosition.x = mod(position.x + scroll.x, 2.) - 1.;

	uv = position;

	float intensityMouse = 1. - min(1., distance(mouse, newPosition)/0.2);
	
	float distanceX = abs(distance(waveCoords, newPosition) - waveRadius);
	float distanceY = abs(distance(waveCoords, newPosition) - waveRadius*ratio);

	vec2 intensityWave = vec2(
		waveStrength * 2. * (1. - min(1., distanceX / 0.3)),
		waveStrength * 2. * (1. - min(1., distanceY / 0.3))
	);
	

	newPosition += localPosition * (1. + intensityMouse*1.5 + intensityWave);
	newPosition += localPosition;

	gl_Position = vec4(newPosition, 0, 1);	
}