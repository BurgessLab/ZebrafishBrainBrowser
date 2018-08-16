/*
 * This script manages behavior and interactions with the left panel (left side of screen containing all of the volume windows)
 */

// These define existing anatomical regions for both types of anatomy
// This is important for determining if a region selected with left-click actually exists
const EXISTING_ZBRAIN_SECTORS = [24, 23, 34, 35, 38, 36, 25, 5, 26, 6, 49, 2, 58, 37, 9, 50, 61, 57, 39, 73, 28, 76, 10, 74, 75, 46, 70, 11, 1, 29, 55, 41, 8, 54, 3, 33, 71, 72, 40, 42, 7, 56, 4, 45, 44, 12, 43, 30, 15, 47, 27, 48, 81, 79, 19, 18, 13, 69, 83, 59, 68, 17, 31, 77, 80, 78, 20, 67, 63, 60, 82, 32, 21];
const EXISTING_PAJEVIC_SECTORS = [114, 53, 62, 83, 15, 40, 112, 155, 105, 52, 131, 94, 77, 117, 47, 95, 2, 70, 3, 44, 69, 22, 165, 126, 121, 59, 109, 122, 170, 55, 89, 82, 16, 168, 116, 12, 150, 127, 56, 157, 123, 41, 132, 133, 92, 5, 174, 21, 63, 76, 39, 84, 48, 99, 102, 6, 153, 149, 64, 148, 34, 142, 9, 30, 134, 169, 164, 119, 50, 141, 67, 177, 37, 60, 171, 42, 175, 154, 179, 139, 35, 18, 108, 27, 65, 38, 125, 178, 180, 75, 19, 100, 36, 138, 91, 103, 161, 72, 28, 87, 57, 68, 85, 129, 88, 115, 145, 156, 80, 173, 93, 113, 158, 86, 4, 7, 26, 79, 96, 143, 151, 160, 45, 17, 130, 46, 159, 90, 71, 147, 23, 49, 137, 106, 78, 104, 10, 81, 32, 166, 97, 61, 43, 144, 162, 31, 167, 172, 74, 101, 29, 8, 135, 110, 140, 13, 11, 73, 146, 24, 54, 136, 20, 107, 33, 152, 118, 51, 124, 111, 128, 1, 120, 14, 58, 163, 98, 176, 25, 66];

// Coordinates locations of z-brain regions, mapped by index (i.e. region with color value 55 has x coordinate at REGION_LOC_X[55])
const REGION_LOC_X = [0, 0.1203883495145631, 0.15922330097087378, 0.1669902912621359, 0.1941747572815534, 0.2737864077669903, 0.26407766990291265, 0.2524271844660194, 0.30097087378640774, 0.3262135922330097, 0.31844660194174756, 0.27184466019417475, 0.3067961165048544, 0.3786407766990291, 0.3320388349514563, 0.2058252427184466, 0.4796116504854369, 0.3359223300970874, 0.3941747572815534, 0.36893203883495146, 0.4796116504854369, 0.40388349514563104, 0.2504854368932039, 0.43106796116504853, 0.40194174757281553, 0.41941747572815535, 0.31844660194174756, 0.4679611650485437, 0.40388349514563104, 0.4320388349514563, 0.4077669902912621, 0.4640776699029126, 0.47184466019417476, 0.47184466019417476, 0.32233009708737864, 0.5475728155339806, 0.4854368932038835, 0.49514563106796117, 0.5825242718446602, 0.5242718446601942, 0.49902912621359224, 0.6155339805825243, 0.5864077669902913, 0.5359223300970873, 0.5786407766990291, 0.7631067961165049, 0.6213592233009708, 0.7300970873786408, 0.5883495145631068, 0.8155339805825242, 0.8349514563106796, 0.6213592233009708, 0.629126213592233, 0.6427184466019418, 0.44660194174757284, 0.5242718446601942, 0.5436893203883495, 0.6310679611650486, 0.7378640776699029, 0.19029126213592232, 0.2912621359223301, 0.34368932038834954, 0.3145631067961165, 0.26407766990291265, 0.6155339805825243, 0, 0.5145631067961165, 0.2757281553398058, 0.2757281553398058, 0.2970873786407767, 0.2970873786407767, 0.3300970873786408, 0.3087378640776699, 0.3087378640776699, 0.3087378640776699, 0.3087378640776699, 0.11650485436893204, 0.42330097087378643, 0.4388349514563107, 0.6873786407766991, 0.4524271844660194, 0.6893203883495146, 0.5825242718446602, 0.566990291262136, 0, 0, 0, 0, 0.6194174757281553, 0.5242718446601942, 0.4446601941747573, 0.3145631067961165, 0.5631067961165048, 0.14951456310679612, 0.41359223300970877, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const REGION_LOC_Y = [0, 0.5454545454545454, 0.5487012987012987, 0.45454545454545453, 0.37987012987012986, 0.5, 0.4025974025974026, 0.4707792207792208, 0.44155844155844154, 0.5487012987012987, 0.36038961038961037, 0.5032467532467533, 0.461038961038961, 0.38961038961038963, 0.35714285714285715, 0.5454545454545454, 0.38961038961038963, 0.4675324675324675, 0.487012987012987, 0.2922077922077922, 0.38961038961038963, 0.4967532467532468, 0.24675324675324675, 0.4675324675324675, 0.3409090909090909, 0.4967532467532468, 0.6883116883116883, 0.4967532467532468, 0.4642857142857143, 0.487012987012987, 0.45454545454545453, 0.4935064935064935, 0.2597402597402597, 0.2597402597402597, 0.5, 0.42207792207792205, 0.5, 0.3538961038961039, 0.38961038961038963, 0.2435064935064935, 0.36363636363636365, 0.4253246753246753, 0.36038961038961037, 0.41233766233766234, 0.43506493506493504, 0.38311688311688313, 0.36038961038961037, 0.44155844155844154, 0.4967532467532468, 0.4318181818181818, 0.487012987012987, 0.5032467532467533, 0.5032467532467533, 0.42207792207792205, 0.45454545454545453, 0.42207792207792205, 0.37662337662337664, 0.4837662337662338, 0.4155844155844156, 0.5032467532467533, 0.487012987012987, 0.5, 0.42207792207792205, 0.5032467532467533, 0.5, 0, 0.4642857142857143, 0.44805194805194803, 0.4155844155844156, 0.38961038961038963, 0.38961038961038963, 0.3181818181818182, 0.33766233766233766, 0.33766233766233766, 0.33766233766233766, 0.33766233766233766, 0.6363636363636364, 0.19480519480519481, 0.2597402597402597, 0.2727272727272727, 0.237012987012987, 0.2662337662337662, 0.2435064935064935, 0.40584415584415584, 0, 0, 0, 0, 0.43506493506493504, 0.5, 0.5551948051948052, 0.37337662337662336, 0.5, 0.4967532467532468, 0.6558441558441559, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const REGION_LOC_Z = [0, 0.4666666666666667, 0.38095238095238093, 0.5857142857142857, 0.49047619047619045, 0.19047619047619047, 0.24285714285714285, 0.47619047619047616, 0.40476190476190477, 0.32857142857142857, 0.4095238095238095, 0.40476190476190477, 0.6047619047619047, 0.6190476190476191, 0.6333333333333333, 0.6333333333333333, 0.7047619047619048, 0.7142857142857143, 0.6190476190476191, 0.6190476190476191, 0.7047619047619048, 0.7904761904761904, 0.6428571428571429, 0.2619047619047619, 0.19047619047619047, 0.2619047619047619, 0.3047619047619048, 0.46190476190476193, 0.3523809523809524, 0.47619047619047616, 0.43333333333333335, 0.6428571428571429, 0.5285714285714286, 0.5285714285714286, 0.14761904761904762, 0.19523809523809524, 0.22380952380952382, 0.34285714285714286, 0.16666666666666666, 0.4523809523809524, 0.47619047619047616, 0.4, 0.45714285714285713, 0.47619047619047616, 0.4238095238095238, 0.4380952380952381, 0.4380952380952381, 0.5333333333333333, 0.5047619047619047, 0.2857142857142857, 0.23809523809523808, 0.2857142857142857, 0.3238095238095238, 0.4142857142857143, 0.4, 0.3952380952380952, 0.5047619047619047, 0.3952380952380952, 0.2857142857142857, 0.5428571428571428, 0.7142857142857143, 0.30952380952380953, 0.3523809523809524, 0.6904761904761905, 0.43333333333333335, 0, 0.5095238095238095, 0.6952380952380952, 0.6285714285714286, 0.5285714285714286, 0.42857142857142855, 0.43333333333333335, 0.44761904761904764, 0.44761904761904764, 0.44761904761904764, 0.44761904761904764, 0.49523809523809526, 0.6904761904761905, 0.7142857142857143, 0.6857142857142857, 0.6857142857142857, 0.6952380952380952, 0.8095238095238095, 0.6285714285714286, 0, 0, 0, 0, 0.15714285714285714, 0.12857142857142856, 0.09047619047619047, 0.24285714285714285, 0.6666666666666666, 0.4, 0.3952380952380952, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var pushed = [HUC_CER[0]]; // All lines that have been turned on (these lines stay in this array even after being deselected)
var addedSelections = []; // All selected z-brain regions
var addedPajevicSelections = []; // All selected pajevic regions

// These keep track of which windows are currently in fullscreen mode
var xFull = false;
var yFull = false;
var zFull = false;
var vFull = false;

// This value is true if the shift key is currently being pressed, which is used to determine anatomical region selection with shift-click
// This value is updated in event functions set in ready.js
var shiftHeld = false;

// WebGL constants for determining color blending function (used for color inversion) https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
const GL_FUNC_REVERSE_SUB = 0x800b;
const GL_FUNC_ADD = 0x8006;

// Turns color inversion of volumes on/off
// This requires changing the blend function from additive blending to subtractive blending for all x3d windows https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation
// The glContexts are stored on load in x3dom-full-formatted.js
function applyColorInversion(enabled) {
	// Setting the blend equation for all x3d windows (all glContexts)
	for(var i = 0; i < glContexts.length; i++) {
		glContexts[i].blendEquation(enabled ? GL_FUNC_REVERSE_SUB : GL_FUNC_ADD); // Reverse-subtractive blending when inversion is on, additive blending when inversion is off
	}
	
	volumeOpacity = enabled ? 0.5 : 3; // Decreasing volume opacity for 3D volumes when color inversion enabled, creates a more visibly-pleasing effect
	
	// Settings new opacity value for all 3D volumes currently being rendered
	$.each(currRender, function(i, val) {
		$('.' + val + '-volume-full').attr('retainedOpacity', volumeOpacity);
	});
}

// Initializes location and size of all x3d windows
// This function was once more useful when layout options existed, but should now be left UNTOUCHED
// All widths and heights for windows/slider inputs should sum to 100%
// The width and height values for everything here is based on proportions of the brain scan dimensions, and should be the same as in layout.css
// Called from ready.js
function setLayout() {
	// X window size and location
	$('#x-window, #proj-x-window').css('width', '37.42%');
	$('#x-window, #proj-x-window').css('height', '36.8095%');
	$('#x-window, #proj-x-window').css('left', '62.58%');
	$('#x-window, #proj-x-window').css('top', '0');
	$('#x-window, #proj-x-window').css('clear', 'none');
	
	// Y window size and location
	$('#y-window, #proj-y-window').css('width', '62.58%');
	$('#y-window, #proj-y-window').css('height', '36.8095%');
	$('#y-window, #proj-y-window').css('left', '0');
	$('#y-window, #proj-y-window').css('top', '0');
	$('#y-window, #proj-y-window').css('clear', 'left');
	
	// Z window size and location
	$('#z-window, #proj-z-window').css('width', '62.58%');
	$('#z-window, #proj-z-window').css('height', '53.988%');
	$('#z-window, #proj-z-window').css('left', '0');
	$('#z-window, #proj-z-window').css('top', '41.41075%');
	$('#z-window, #proj-z-window').css('clear', 'left');
	
	// 3D volume window size and location
	$('#volume-window').css('width', '37.42%');
	$('#volume-window').css('height', '53.988%');
	$('#volume-window').css('left', '62.58%');
	$('#volume-window').css('top', '41.41075%');
	$('#volume-window').css('clear', 'none');
	
	// X slice slider size and location
	$('#slice-div-x').css('width', '37.42%');
	$('#slice-div-x').css('height', '4.60125%');
	$('#slice-div-x').css('left', '62.58%');
	$('#slice-div-x').css('top', '36.8095%');
	$('#slice-div-x').css('clear', 'none');
	
	// Y slice slider size and location
	$('#slice-div-y').css('width', '62.58%');
	$('#slice-div-y').css('height', '4.60125%');
	$('#slice-div-y').css('left', '0');
	$('#slice-div-y').css('top', '36.8095%');
	$('#slice-div-y').css('clear', 'left');
	
	// Z slice slider size and location
	$('#slice-div-z').css('width', '62.58%');
	$('#slice-div-z').css('height', '4.60125%');
	$('#slice-div-z').css('left', '0');
	$('#slice-div-z').css('top', '95.39875%');
	$('#slice-div-z').css('clear', 'left');
	
	// 3D volume slice slider size and location (has no slider but contains other components)
	$('#slice-div-volume').css('left', '62.58%');
	$('#slice-div-volume').css('top', '95.39875%');
	$('#slice-div-volume').css('clear', 'none');
	
	// X Projection window location
	$('#proj-x-window').css('left', '62.58%'); /* Based on x-window location */
	$('#proj-x-window').css('top', '0');
	$('#proj-x-window').css('clear', 'none');
	
	// Y Projection window location
	$('#proj-y-window').css('left', '0'); /* Based on y-window location */
	$('#proj-y-window').css('top', '0');
	$('#proj-y-window').css('clear', 'left');
	
	// Z Projection window location
	$('#proj-z-window').css('left', '0'); /* Based on z-window location */
	$('#proj-z-window').css('top', '41.41075%');
	$('#proj-z-window').css('clear', 'left');
}

// Updates position of blue crosshair lines in volumes after clicking
function updateLines() {
	// Getting coordinate of currently selected point in 3D space
	// Calculated from slice slider value and total window size 
	var lineX = $('#x-input').val() * $('#z-window').width() * window.devicePixelRatio; // window.devicePixelRatio used because many browsers will automatically scale up element sizes for high-resolution screens, meaning width() and height() values would be incorrect
	var lineY = (1 - $('#y-input').val()) * $('#z-window').height() * window.devicePixelRatio;
	var lineZ = $('#z-input').val() * $('#y-window').height() * window.devicePixelRatio;
	
	// Looping through all line volumes currently being rendered and updating crosshair locations
	$.each(currRender, function(i, val) {
		$('.' + val + '-volume-x').attr('lineLoc', (lineY * (xFull ? 2.605 : 1)) + ' ' + (($('#y-window').height() * window.devicePixelRatio - lineZ) * (xFull ? 2.605 : 1)) + ' 0'); // Multipliers applied for adjustments in fullscreen
		$('.' + val + '-volume-y').attr('lineLoc', (lineX * (yFull ? 1.6025 : 1)) + ' ' + ($('#y-window').height() * window.devicePixelRatio - lineZ) + ' 0');
		$('.' + val + '-volume-z').attr('lineLoc', lineX + ' ' + ($('#z-window').height() * window.devicePixelRatio - lineY) + ' 0');
	});
}

// Function called when moving a slice slider (underneath the volume windows)
function slide(id, value, direction) {
	// Clamps the value from 0-1 to 0.001-0.999 (edge values like 0 and 1 can produce glitchy effects)
	var clampedValue;
	if(value < 0.001) {
		clampedValue = 0.001;
	} else if(value > 0.999) {
		clampedValue = 0.999;
	} else {
		clampedValue = value;
	}
	
	// Setting slice position for all currently-rendered lines in given window (x, y, or z)
	$.each(currRender, function(i, val) {
		$('.' + val + '-volume-' + id + ':not(.proj-' + id + ')').attr('positionLine', 0.5 - clampedValue / 2.0); // Mapping done to ensure positionLine is 0-0.5
	});
	
	$('#transform-' + id).attr('translation', '0,0,' + ((clampedValue - 0.5) * direction)); // Moving camera position in given window, as changing the position line actually moves the slice back/forward in 3D space
	updateLines(); // Updating blue crosshair line positions in all windows
	
	// Getting total number of slices to show in slice number display
	// "slices" is hardcoded to total slices across given dimension (based on data dimensions)
	// Projection lines are also cleared here, so brown projection lines will disappear when sliding through volume
	var slices;
	if(id == 'x') {
		slices = 1029;
		clearProjX();
	} else if(id == 'y') {
		slices = 615;
		clearProjY();
	} else {
		slices = 419;
		clearProjZ();
	}
	
	// Getting current slice number to show in slice number display
	var sliceNum = parseInt(value * slices);
	
	// Setting text for corresponding slice number display
	$('#slice-num-' + id).text(sliceNum + ' / ' + slices);
}

// Turns on/off projection windows
function togglePanels(type, show) {
	var projOn;
	
	// Determining if projection is on for given type
	if(type == 'x') {
		projOn = xProjOn;
	} else if(type == 'y') {
		projOn = yProjOn;
	} else if(type == 'z') {
		projOn = zProjOn;
	} else {
		projOn = false;
	}
	
	// Turning off projection and turning on slicer window OR turning on projection and turning off slicer window
	$('#' + type + '-window').css('display', (show && !projOn ? 'block' : 'none'));
	$('#proj-' + type + '-window').css('display', (show && projOn ? 'block' : 'none'));
	$('#slice-div-' + type).css('display', (show ? 'flex' : 'none'));
}

// Toggles fullscreen effect for specified window
function toggleFullscreen(type) {
	var madeFull;
	
	if(type == 'x') {
		if(xFull) { // Checking if x window is already in fullscreen
			setLayout(); // Changing back to original layout (all 4 windows)
			changeOverallAttrib('renderLines', 0.0); // Turning off blue crosshairs during transition
			
			// Function to be called after fullscreen transition has finished
			setTimeout(function() {
				if(!xFull) {
					// Showing other panels
					togglePanels('y', true);
					togglePanels('z', true);
					togglePanels('volume', true);
					
					updateLines(); // Updating blue crosshair lines
					var checked = $('#line-show-checkbox').prop('checked');
					changeOverallAttrib('renderLines', checked ? 1.0 : 0.0); // Showing lines again if "Show Lines" settings is enabled
					
					$('#x-window, #proj-x-window').addClass('border-left'); // Re-adding border to x windows
				}
			}, 500); // Time transition takes in milliseconds, should be same as transition time in layout.css
		} else { // Case where x is not already in fullscreen
			// Setting x window sizes and locations
			// These values were calculated so window takes up as much space on panel as possible while still maintaining proportions and leaving space for slider input
			// Also, the position was set to center the window
			$('#x-window, #proj-x-window').css('width', '96.981%');
			$('#x-window, #proj-x-window').css('height', '95.39875%');
			$('#x-window, #proj-x-window').css('left', '1.5095%');
			$('#x-window, #proj-x-window').css('top', '0');
			
			$('#x-window, #proj-x-window').removeClass('border-left'); // Removing x window border
			
			// Setting the size and location of the slice slider input (same height as before)
			$('#slice-div-x').css('width', '96.981%');
			$('#slice-div-x').css('height', '4.60125%');
			$('#slice-div-x').css('top', '95.39875%');
			$('#slice-div-x').css('left', '1.5095%');
			
			// Turning off y, z, and 3D volume windows
			togglePanels('y', false);
			togglePanels('z', false);
			togglePanels('volume', false);
			
			// Turning off blue crosshair lines during transition
			changeOverallAttrib('renderLines', 0.0);
			
			// Function that occurs after fullscreen transition has finished
			setTimeout(function() {
				updateLines(); // Updating blue crosshair lines
				var checked = $('#line-show-checkbox').prop('checked');
				changeOverallAttrib('renderLines', checked ? 1.0 : 0.0); // Re-enabling crosshair lines if "Show Line" setting is enabled
			}, 500); // Function is called after 500 milliseconds, should be same as transition values in layout.css
		}
		
		// Indicating whether x window was made fullscreen
		xFull = !xFull;
		madeFull = xFull;
		
		// Clearing brown partial projection lines
		clearProjX();
	} else if(type == 'y') { // Very similar to type = x, see comments above
		if(yFull) {
			setLayout();
			changeOverallAttrib('renderLines', 0.0);
			
			setTimeout(function() {
				if(!yFull) {
					togglePanels('x', true);
					togglePanels('z', true);
					togglePanels('volume', true);
					
					updateLines();
					var checked = $('#line-show-checkbox').prop('checked');
					changeOverallAttrib('renderLines', checked ? 1.0 : 0.0);
					
					$('#y-window, #proj-y-window').addClass('border-right');
				}
			}, 500);
		} else {
			$('#y-window, #proj-y-window').css('width', '100%');
			$('#y-window, #proj-y-window').css('height', '58.82%');
			$('#y-window, #proj-y-window').css('left', '0');
			$('#y-window, #proj-y-window').css('top', '18.289375%');
			
			$('#y-window, #proj-y-window').removeClass('border-right');
			
			$('#slice-div-y').css('width', '100%');
			$('#slice-div-y').css('height', '4.60125%');
			$('#slice-div-y').css('top', '77.109375%');
			$('#slice-div-y').css('left', '0');
			
			togglePanels('x', false);
			togglePanels('z', false);
			togglePanels('volume', false);
			
			changeOverallAttrib('renderLines', 0.0);
			
			setTimeout(function() {
				updateLines();
				var checked = $('#line-show-checkbox').prop('checked');
				changeOverallAttrib('renderLines', checked ? 1.0 : 0.0);
			}, 500);
		}
		
		yFull = !yFull;
		madeFull = yFull;
		clearProjY();
	} else if(type == 'z') { // Very similar to type = x, see comments above
		if(zFull) {
			setLayout();
			changeOverallAttrib('renderLines', 0.0);
			
			setTimeout(function() {
				if(!zFull) {
					togglePanels('x', true);
					togglePanels('y', true);
					togglePanels('volume', true);
					
					updateLines();
					var checked = $('#line-show-checkbox').prop('checked');
					changeOverallAttrib('renderLines', checked ? 1.0 : 0.0);
					
					$('#z-window, #proj-z-window').addClass('border-right');
				}
			}, 500);
		} else {
			$('#z-window, #proj-z-window').css('width', '100%');
			$('#z-window, #proj-z-window').css('height', '86.27037%');
			$('#z-window, #proj-z-window').css('left', '0');
			$('#z-window, #proj-z-window').css('top', '4.56419%');
			
			$('#z-window, #proj-z-window').removeClass('border-right');
			
			$('#slice-div-z').css('width', '100%');
			$('#slice-div-z').css('height', '4.60125%');
			$('#slice-div-z').css('top', '90.83456%');
			$('#slice-div-z').css('left', '0');
			
			togglePanels('x', false);
			togglePanels('y', false);
			togglePanels('volume', false);
			
			changeOverallAttrib('renderLines', 0.0);
			
			setTimeout(function() {
				updateLines();
				var checked = $('#line-show-checkbox').prop('checked');
				changeOverallAttrib('renderLines', checked ? 1.0 : 0.0);
			}, 500);
		}
		
		zFull = !zFull;
		madeFull = zFull;
		clearProjZ();
	} else { // Very similar to type = x, see comments above
		if(vFull) {
			setLayout();
			changeOverallAttrib('renderLines', 0.0);
			
			setTimeout(function() {
				if(!vFull) {
					togglePanels('x', true);
					togglePanels('y', true);
					togglePanels('z', true);
					
					updateLines();
					var checked = $('#line-show-checkbox').prop('checked');
					changeOverallAttrib('renderLines', checked ? 1.0 : 0.0);
					
					$('#volume-window').addClass('border-left');
					$('#slice-div-volume').css('display', 'flex');
				}
			}, 500);
		} else {
			$('#volume-window').css('width', '69.3117%');
			$('#volume-window').css('height', '100%');
			$('#volume-window').css('left', '15.34415%');
			$('#volume-window').css('top', '0');
			
			$('#volume-window').removeClass('border-left');
			
			$('#slice-div-volume').css('display', 'none');
			
			togglePanels('x', false);
			togglePanels('y', false);
			togglePanels('z', false);
			
			changeOverallAttrib('renderLines', 0.0);
			
			setTimeout(function() {
				updateLines();
				var checked = $('#line-show-checkbox').prop('checked');
				changeOverallAttrib('renderLines', checked ? 1.0 : 0.0);
			}, 500);
		}
		
		vFull = !vFull;
		madeFull = vFull;
	}
	
	updateSSVolumeAttribs(); // Updating spatial search yellow highlighted box values
	$('#full-btn-img-' + type + ', #full-btn-img-proj-' + type).attr('src', 'res/' + (madeFull ? 'lessIcon' : 'fullIcon') + '.png'); // Changing icon image of fullscreen button
}

// Updates global settings values for currently rendered items
// This is called whenever a new line is selected as to make sure all of its settings values are correct
function updateCurrRender() {
	changeResolution('res-btn-' + currRes, currRes); // Resolution
	changeOverallAttrib('renderLines', $('#line-show-checkbox').prop('checked') ? 1.0 : 0.0); // Show line
	changeOverallAttrib('invertColor', $('#invert-input').prop('checked') ? 1.0 : 0.0); // Invert color
	slide('x', $('#x-input').val(), 1); // X slice input
	slide('y', $('#y-input').val(), -1); // Y slice input
	slide('z', $('#z-input').val(), -1); // Z slice input
	updateLines(); // Updating blue crosshair lines
}

// Deprecated function (unused)
function swapInfoView(id) {
	$('.ind-info').css('display', 'none');
	$('#' + id + '-info').css('display', 'block');
}

// Function called whenever a line is toggled on/off from the Lines menu
function setRender(id, checkbox) {
	// Getting toggle index if line being turned on (keys 1-9)
	var toggleIndex = -1;
	if(checkbox.checked) {
		toggleIndex = storeSelection(id);
	}
	
	// Turning on corresponding alias checkboxes and spatial search checkboxes as well
	$('#' + id + '-alias-checkbox').prop('checked', checkbox.checked);
	$('.' + id + '-ss-checkbox').prop('checked', checkbox.checked);
	
	// Appending line settings and volumes HTML if the line has not been turned on before
	var notIncluded = !includes(pushed, id);
	if(notIncluded) {
		appendSettings(id, toggleIndex);
		appendProjections(id);
		appendVolumes(id);
	}
	
	if(checkbox.checked) {
		// Adding and updating the current render list if line is toggled on
		currRender.push(id);
		updateCurrRender();
		swapInfoView(id); // Deprecated, does nothing
	} else {
		// Removing line from current render if line is toggled off
		var index = currRender.indexOf(id);
		
		if(index != -1) {
			currRender.splice(index, 1);
		}
	}
	
	// Showing line's individual settings panel, see settingsView.js
	showSettings(checkbox.checked, id);
	
	// Changes made if line has not previously been turned on
	if(notIncluded) {
		bindSliderAndNumberInputs(id); // Connecting the line's slider and number inputs
		resetIndividual(id, true); // Resetting the line to default values (color, contrast, brightness, etc.), see resets.js
		$('#' + id + '-color').attr('data-content', popoverContent('changeColor', '\'' + id + '-color-span\', \'' + id + '\'')); // Adding button selectors to color picker button's popover
		$('[data-toggle="popover"]').popover(); // Enabling popover button
		
		pushed.push(id); // Pushing line ID to "pushed" so page knows not to append its data again
	}
	
	// Updating blue crosshair lines and partial projection lines (where applicable)
	updateLines();
	updateProjMarkers();
	
	// Setting volume render attributes to true (X3DOM attribute)
	$('.' + id + '-data').attr('render', checkbox.checked);
}

// Determines whether 3D volume is being rendered
// This function is called from the "Show Volume" checkbox in the Settings menu
function setVolumeFullRender(checkbox) {
	$('#volume-scene').attr('render', checkbox.checked); // "render" is an X3DOM scene attribute
}

// Sets the background color of the windows when toggling color inversion
// This sets the background to black when color inversion is off, and background to white when color inversion is on
function setSkyColor(value) {
	$('.window-background').attr('skyColor', value + ' ' + value + ' ' + value); // "skyColor" is an attribute of the X3DOM "Background" element
	$('.slice-num').css('color', value == '0.0' ? 'white' : 'black'); // Changing color of slice number displays so they're visible against both background colors
}

// Turns window annotations on/off
// This function is called when clicking the "Hide Annotations" checkbox in the Settings menu
function toggleAnnotations(checked) {
	$('.mp-btn').css('display', (checked ? 'none' : 'initial')); // Max proj buttons (including Slice buttons)
	$('.full-btn').css('display', (checked ? 'none' : 'initial')); // Fullscreen buttons
	$('.slice-num').css('display', (checked ? 'none' : 'initial')); // Current slice number displays
	$('#vr-btn').css('display', (checked ? 'none' : 'initial')); // VR button
}

// Turns full anatomy volumes on/off
function toggleFullAnatomy(type, btnID, enabled) {
	// Toggling anatomy based on type (z-brain or pajevic)
	if(type == 'z-brain') {
		toggleZbrain(enabled);
		fullAnatomyOnVR = enabled; // "fullAnatomyOnVR" is deprecated
	} else if(type == 'pajevic') {
		togglePajevic(enabled);
	}
	
	// Hiding "Show Full" and displaying "Hide Full" button or vice-versa
	$('.toggle-full-anatomy-btn').css('display', 'none');
	$('#' + btnID).css('display', 'block');
}

// Toggles full pajevic anatomy volume
function togglePajevic(enabled) {
	if(enabled) {
		// These three lines are redundant?
		var edgesIndex = currRender.indexOf('anatomy-1-edges');
		if(edgesIndex != -1) { currRender.splice(edgesIndex, 1); }
		$('.anatomy-1-edges-data').attr('render', 'false');
		
		currRender.push('anatomy-1-edges'); // Adding full anatomy volume to current render
		updateCurrRender(); // Updating settings values for current render
		$('.anatomy-1-edges-data').attr('render', 'true'); // Setting render to true for full anatomy
	} else {
		var index = currRender.indexOf('anatomy-1-edges');
		if(index > -1) { currRender.splice(index, 1); } // Removing anatomy from current render
		$('.anatomy-1-edges-data').attr('render', 'false'); // Turning off volume render ("render" is an X3DOM volume data attribute)
	}
}

// Toggles z-brain anatomy volume
function toggleZbrain(enabled) {
	if(enabled) {
		// These three lines are redundant?
		var edgesIndex = currRender.indexOf('anatomy-2-edges');
		if(edgesIndex != -1) { currRender.splice(edgesIndex, 1); }
		$('.anatomy-2-edges-data').attr('render', 'false');
		
		currRender.push('anatomy-2-edges'); // Adding full anatomy volume to current render
		updateCurrRender(); // Updating settings values for current render
		$('.anatomy-2-edges-data').attr('render', 'true'); // Setting render to true for full anatomy
	} else {
		var index = currRender.indexOf('anatomy-2-edges');
		if(index > -1) { currRender.splice(index, 1); } // Removing anatomy from current render
		$('.anatomy-2-edges-data').attr('render', 'false'); // Turning off volume render ("render" is an X3DOM volume data attribute)
	}
}

// Appends z-brain anatomical region based on 0-255 color value
function appendRegionSelection(num) {
	// Constructing volume HTML (X3DOM elements)
	var xText = '<VolumeData class="anatomy-selection-' + num + '-data" dimensions="1 0.598058 0.407767" render="false">' + 
					'<ImageTextureAtlas class="anatomy-selection-' + num + '-atlas" containerField="voxels" url="res/anatomy/anatomy-2-sectors/anatomy-2-' + num + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-selection-' + num + '-volume-x volume-x" isAnatomy="1.0" isEdges="1.0" originLine="1 0 0" finalLine="-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var yText = '<VolumeData class="anatomy-selection-' + num + '-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-selection-' + num + '-atlas" containerField="voxels" url="res/anatomy/anatomy-2-sectors/anatomy-2-' + num + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-selection-' + num + '-volume-y volume-y" isAnatomy="1.0" isEdges="1.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var zText = '<VolumeData class="anatomy-selection-' + num + '-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-selection-' + num + '-atlas" containerField="voxels" url="res/anatomy/anatomy-2-sectors/anatomy-2-' + num + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-selection-' + num + '-volume-z volume-z" isAnatomy="1.0" isEdges="1.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var vText = '<VolumeData class="anatomy-selection-' + num + '-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-selection-' + num + '-atlas" containerField="voxels" url="res/anatomy/anatomy-2-sectors/anatomy-2-' + num + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="anatomy-selection-' + num + '-volume-full volume-full" isAnatomy="1.0" retainedOpacity="10.0"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>';
	
	// Appending HTML to page
	$('.anatomy-selection-x-container').append(xText);
	$('.anatomy-selection-y-container').append(yText);
	$('.anatomy-selection-z-container').append(zText);
	$('.anatomy-selection-full-container').append(vText);
	
	// Indicating that this region has been added (so it's not appended again)
	addedSelections.push(num);
}

// Appends pajevic anatomical region based on 0-255 color value
function appendPajevicRegionSelection(num) {
	// Constructing volume HTML (X3DOM elements)
	var xText = '<VolumeData class="anatomy-pajevic-selection-' + num + '-data" dimensions="1 0.598058 0.407767" render="false">' + 
					'<ImageTextureAtlas class="anatomy-pajevic-selection-' + num + '-atlas" containerField="voxels" url="res/anatomy/anatomy-1-sectors/anatomy-1-' + num + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-pajevic-selection-' + num + '-volume-x volume-x" isAnatomy="1.0" isEdges="1.0" originLine="1 0 0" finalLine="-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var yText = '<VolumeData class="anatomy-pajevic-selection-' + num + '-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-pajevic-selection-' + num + '-atlas" containerField="voxels" url="res/anatomy/anatomy-1-sectors/anatomy-1-' + num + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-pajevic-selection-' + num + '-volume-y volume-y" isAnatomy="1.0" isEdges="1.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var zText = '<VolumeData class="anatomy-pajevic-selection-' + num + '-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-pajevic-selection-' + num + '-atlas" containerField="voxels" url="res/anatomy/anatomy-1-sectors/anatomy-1-' + num + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-pajevic-selection-' + num + '-volume-z volume-z" isAnatomy="1.0" isEdges="1.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var vText = '<VolumeData class="anatomy-pajevic-selection-' + num + '-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-pajevic-selection-' + num + '-atlas" containerField="voxels" url="res/anatomy/anatomy-1-sectors/anatomy-1-' + num + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="anatomy-pajevic-selection-' + num + '-volume-full volume-full" isAnatomy="1.0" retainedOpacity="10.0"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>';
	
	// Appending HTML to page
	$('.anatomy-pajevic-selection-x-container').append(xText);
	$('.anatomy-pajevic-selection-y-container').append(yText);
	$('.anatomy-pajevic-selection-z-container').append(zText);
	$('.anatomy-pajevic-selection-full-container').append(vText);
	
	// Indicating that this region has been added (so it's not appended again)
	addedPajevicSelections.push(num);
}

// Turns on/off a z-brain region volume
function toggleRegionSelection(num, checked) {
	if(includes(EXISTING_ZBRAIN_SECTORS, num)) { // Checking to make sure number is valid color ID
		if(checked) {
			if(!includes(addedSelections, num)) {
				appendRegionSelection(num); // Appending region volume if it hasn't been selected before
			}
			
			currRender.push('anatomy-selection-' + num); // Adding to current render
			$('.anatomy-selection-' + num + '-data').attr('render', 'true'); // Setting X3DOM render value to true
			updateCurrRender(); // Updating settings values of current render
		} else {
			// Removing anatomical selection from current render
			var index = currRender.indexOf('anatomy-selection-' + num);
			
			if(index > -1) {
				currRender.splice(index, 1);
				$('.anatomy-selection-' + num + '-data').attr('render', 'false');
			}
		}
	}
	
	if(!currentAnatomyOnVR.includes(num) && checked) {
		currentAnatomyOnVR.push(num); // Adding selection to VR list (so VR page knows which regions to load)
	} else if(currentAnatomyOnVR.includes(num) && !checked) {
		// Removing selection from VR list
		var index = currentAnatomyOnVR.indexOf(num);
		
		if(index > -1) {
			currentAnatomyOnVR.splice(index, 1);
		}
	}
	
	// Jumping to anatomical region's location
	if(checked && REGION_LOC_X[num] != 0 && REGION_LOC_Y[num] != 0 && REGION_LOC_Z[num] != 0) { // Making sure region location is set
		// Jumping to location by setting slider values
		// The REGION_LOC values are all normalized from 0-1, just like slider input values
		$('#x-input').val(REGION_LOC_X[num]).trigger('input');
		$('#y-input').val(REGION_LOC_Y[num]).trigger('input');
		$('#z-input').val(REGION_LOC_Z[num]).trigger('input');
		updateLines(); // Updating blue crosshair lines
	}
	
	// Applying color inversion setting
	var inverted = $('#invert-input').prop('checked');
	applyColorInversion(inverted);
}

// Turns on/off a pajevic region volume
// This function does essentially the same thing as the z-brain function, but without adding/removing from VR list and without jumping to anatomy location, are these are necessary for pajevic regions
// See comments in function above for details
function togglePajevicRegionSelection(num, checked) {
	if(includes(EXISTING_PAJEVIC_SECTORS, num)) {
		if(checked) {
			if(!includes(addedPajevicSelections, num)) {
				appendPajevicRegionSelection(num);
			}
			
			currRender.push('anatomy-pajevic-selection-' + num);
			$('.anatomy-pajevic-selection-' + num + '-data').attr('render', 'true');
			updateCurrRender();
		} else {
			var index = currRender.indexOf('anatomy-pajevic-selection-' + num);
			
			if(index > -1) {
				currRender.splice(index, 1);
				$('.anatomy-pajevic-selection-' + num + '-data').attr('render', 'false');
			}
		}
	}
	
	var inverted = $('#invert-input').prop('checked');
	applyColorInversion(inverted);
}

// This function manages everything that happens when the X window is clicked, and is bound in ready.js
function xBoxClicked(evt) {
	toggleSSHighlighting(false); // Turning off yellow spatial search highlight box
	
	clearProjX(); // Clearing brown partial projection lines
	
	// Getting location of click
	var bbox = evt.target.getBoundingClientRect();
	
	var pX = parseInt(evt.clientX - bbox.left);
	var pY = parseInt(evt.clientY - bbox.top);
	var boxW = $(evt.target).width();
	var boxH = $(evt.target).height();
	
	// Normalizing location of click to 0-1
	var posY = 1 - (pX / boxW);
	var posZ = pY / boxH;
	
	// Adjust y and z slice locations (selection is made in x window)
	$('#y-input').val(posY).trigger('input');
	$('#z-input').val(posZ).trigger('input');
	
	updateLines(); // Updating blue crosshair lines
	
	// Determining which anatomy data to use based on which anatomy type is active
	// This data can be found at the top of this file or in regions.js
	var REGION_WIDTH;
	var REGION_HEIGHT;
	var REGION_DEPTH;
	var REGION_MAP;
	var REGION_DATA;
	var EXISTING_SECTORS;
	var anatomyPath; // Used for building image file path
	
	if(activeAnatomy == 'z-brain') {
		REGION_WIDTH = ZBRAIN_WIDTH;
		REGION_HEIGHT = ZBRAIN_HEIGHT;
		REGION_DEPTH = ZBRAIN_DEPTH;
		REGION_MAP = ZBRAIN_MAP;
		REGION_DATA = ZBRAIN_DATA;
		EXISTING_SECTORS = EXISTING_ZBRAIN_SECTORS;
		anatomyPath = 'anatomy-2';
	} else {
		REGION_WIDTH = PAJEVIC_WIDTH;
		REGION_HEIGHT = PAJEVIC_HEIGHT;
		REGION_DEPTH = PAJEVIC_DEPTH;
		REGION_MAP = PAJEVIC_MAP;
		REGION_DATA = PAJEVIC_DATA;
		EXISTING_SECTORS = EXISTING_PAJEVIC_SECTORS;
		anatomyPath = 'anatomy-1';
	}
	
	// Getting click location relative to anatomy dimensions (from 0-1 to value in pixels)
	var regionX = parseInt($('#x-input').val() * REGION_WIDTH);
	var regionY = parseInt(posY * REGION_HEIGHT);
	var regionZ = parseInt(posZ * REGION_DEPTH);
	
	if(regionX < REGION_WIDTH && regionY < REGION_HEIGHT && regionZ < REGION_DEPTH) { // Making sure selection isn't offscreen
		var regionValue = REGION_DATA[regionZ][regionY][regionX]; // Getting numerical 0-255 region value
		var region = REGION_MAP[regionValue]; // Getting name of region based on color value
		
		$('#region-info').text(region); // Updating region display below 3D volume window
		
		if(shiftHeld && includes(EXISTING_SECTORS, regionValue)) { // Checking if the user shift-clicked and an image file exists for the selected anatomy
			$('.' + anatomyPath + '-selectable-atlas').attr('url', 'res/anatomy/' + anatomyPath + '-sectors/' + anatomyPath + '-' + regionValue + '_2560.png'); // Setting file path of selectable volume data to that of recently selected region
			
			// Adding selectable volume data to current render
			if(!includes(currRender, anatomyPath + '-selectable')) {
				$('.' + anatomyPath + '-selectable-data').attr('render', 'true');
				currRender.push(anatomyPath + '-selectable');
			}
			
			updateCurrRender(); // Updating settings for recently added anatomy
		} else {
			// Turning off any anatomy previously shown with shift-click
			$('.' + anatomyPath + '-selectable-data').attr('render', 'false');
			var index = currRender.indexOf(anatomyPath + '-selectable');
			if(index > -1) {
				currRender.splice(index, 1);
			}
		}
	}
}

// This function manages everything that happens when the Y window is clicked, and is bound in ready.js
// This function works very similarly to xBoxClicked(), see comments above
function yBoxClicked(evt) {
	toggleSSHighlighting(false);
	
	clearProjY();
	
	var bbox = evt.target.getBoundingClientRect();
	
	var pX = parseInt(evt.clientX - bbox.left);
	var pY = parseInt(evt.clientY - bbox.top);
	var boxW = parseInt(bbox.right - bbox.left);
	var boxH = parseInt(bbox.bottom - bbox.top);
	
	var posX = pX / boxW;
	var posZ = pY / boxH;
	
	$('#x-input').val(posX).trigger('input');
	$('#z-input').val(posZ).trigger('input');
	
	updateLines();
	
	var REGION_WIDTH;
	var REGION_HEIGHT;
	var REGION_DEPTH;
	var REGION_MAP;
	var REGION_DATA;
	var EXISTING_SECTORS;
	var anatomyPath;
	
	if(activeAnatomy == 'z-brain') {
		REGION_WIDTH = ZBRAIN_WIDTH;
		REGION_HEIGHT = ZBRAIN_HEIGHT;
		REGION_DEPTH = ZBRAIN_DEPTH;
		REGION_MAP = ZBRAIN_MAP;
		REGION_DATA = ZBRAIN_DATA;
		EXISTING_SECTORS = EXISTING_ZBRAIN_SECTORS;
		anatomyPath = 'anatomy-2';
	} else {
		REGION_WIDTH = PAJEVIC_WIDTH;
		REGION_HEIGHT = PAJEVIC_HEIGHT;
		REGION_DEPTH = PAJEVIC_DEPTH;
		REGION_MAP = PAJEVIC_MAP;
		REGION_DATA = PAJEVIC_DATA;
		EXISTING_SECTORS = EXISTING_PAJEVIC_SECTORS;
		anatomyPath = 'anatomy-1';
	}
	
	var regionX = parseInt(posX * REGION_WIDTH);
	var regionY = parseInt($('#y-input').val() * REGION_HEIGHT);
	var regionZ = parseInt(posZ * REGION_DEPTH);
	
	if(regionX < REGION_WIDTH && regionY < REGION_HEIGHT && regionZ < REGION_DEPTH) {
		var regionValue = REGION_DATA[regionZ][regionY][regionX];
		var region = REGION_MAP[regionValue];
		
		$('#region-info').text(region);
		
		if(shiftHeld && includes(EXISTING_SECTORS, regionValue)) {
			$('.' + anatomyPath + '-selectable-atlas').attr('url', 'res/anatomy/' + anatomyPath + '-sectors/' + anatomyPath + '-' + regionValue + '_2560.png');
			
			if(!includes(currRender, anatomyPath + '-selectable')) {
				$('.' + anatomyPath + '-selectable-data').attr('render', 'true');
				currRender.push(anatomyPath + '-selectable');
			}
			
			updateCurrRender();
		} else {
			$('.' + anatomyPath + '-selectable-data').attr('render', 'false');
			var index = currRender.indexOf(anatomyPath + '-selectable');
			if(index > -1) {
				currRender.splice(index, 1);
			}
		}
	}
}

// This function manages everything that happens when the Z window is clicked, and is bound in ready.js
// This function works very similarly to xBoxClicked(), see comments above
function zBoxClicked(evt) {
	toggleSSHighlighting(false);
	
	clearProjZ();
	
	var bbox = evt.target.getBoundingClientRect();
	
	var pX = parseInt(evt.clientX - bbox.left);
	var pY = parseInt(evt.clientY - bbox.top);
	var boxW = parseInt(bbox.right - bbox.left);
	var boxH = parseInt(bbox.bottom - bbox.top);
	
	var posX = pX / boxW;
	var posY = 1 - (pY / boxH);
	
	$('#x-input').val(posX).trigger('input');
	$('#y-input').val(posY).trigger('input');
	
	updateLines();
	
	var REGION_WIDTH;
	var REGION_HEIGHT;
	var REGION_DEPTH;
	var REGION_MAP;
	var REGION_DATA;
	var EXISTING_SECTORS;
	var anatomyPath;
	
	if(activeAnatomy == 'z-brain') {
		REGION_WIDTH = ZBRAIN_WIDTH;
		REGION_HEIGHT = ZBRAIN_HEIGHT;
		REGION_DEPTH = ZBRAIN_DEPTH;
		REGION_MAP = ZBRAIN_MAP;
		REGION_DATA = ZBRAIN_DATA;
		EXISTING_SECTORS = EXISTING_ZBRAIN_SECTORS;
		anatomyPath = 'anatomy-2';
	} else {
		REGION_WIDTH = PAJEVIC_WIDTH;
		REGION_HEIGHT = PAJEVIC_HEIGHT;
		REGION_DEPTH = PAJEVIC_DEPTH;
		REGION_MAP = PAJEVIC_MAP;
		REGION_DATA = PAJEVIC_DATA;
		EXISTING_SECTORS = EXISTING_PAJEVIC_SECTORS;
		anatomyPath = 'anatomy-1';
	}
	
	var regionX = parseInt(posX * REGION_WIDTH);
	var regionY = parseInt(posY * REGION_HEIGHT);
	var regionZ = parseInt($('#z-input').val() * REGION_DEPTH);
	
	if(regionX < REGION_WIDTH && regionY < REGION_HEIGHT && regionZ < REGION_DEPTH) {
		var regionValue = REGION_DATA[regionZ][regionY][regionX];
		var region = REGION_MAP[regionValue];
		
		$('#region-info').text(region);
		
		if(shiftHeld && includes(EXISTING_SECTORS, regionValue)) {
			$('.' + anatomyPath + '-selectable-atlas').attr('url', 'res/anatomy/' + anatomyPath + '-sectors/' + anatomyPath + '-' + regionValue + '_2560.png');
			
			if(!includes(currRender, anatomyPath + '-selectable')) {
				$('.' + anatomyPath + '-selectable-data').attr('render', 'true');
				currRender.push(anatomyPath + '-selectable');
			}
			
			updateCurrRender();
		} else {
			$('.' + anatomyPath + '-selectable-data').attr('render', 'false');
			var index = currRender.indexOf(anatomyPath + '-selectable');
			
			if(index > -1) {
				currRender.splice(index, 1);
			}
		}
	}
}
