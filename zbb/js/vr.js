/*
 * This script stores information about currently rendered lines and currently selected anatomy in memory so VR page knows which volumes to load
 * See the vr folder included next to the zbb folder in this project to learn about how this data is used
 */

// Maximum RECOMMENDED number of lines that can be viewed in VR
const MAX_LINES = 3;

// Keeps track of anatomical regions currently selected in the browser
// This information is tracked in the toggleRegionSelection() function in windows.js
var currentAnatomyOnVR = [];

// Opens new window to VR page
function linkToVR() {
	window.open('../vr/index.html');
}

// This function is called when the VR button in the 3D view window is selected
// It stores information required for the VR page and launches the VR page in a separate window
function launchVR() {
	// Arrays to store currently selected lines, their color, contrast, and brightness values, and currently selected anatomical regions
	var linesOn = [];
	var colors = [];
	var contrasts = [];
	var brightnesses = [];
	var regions = [];

	// Looping through all the IDs currently being rendered
	for(var i = 0; i < currRender.length; i++) {
		var line = currRender[i];

		// Checking to make sure the ID is a line ID
		if(line == HUC_CER[0] || includes(TRANSGENIC, line) || includes(CRE, line) || includes(GAL4, line) || includes(MISC, line)) {
			// Saving line name
			linesOn.push(line);

			// Saving color
			var color = $('.' + line + '-volume-full').attr('baseColor');
			colors.push(color);

			// Saving contrast
			var contrast = $('.' + line + '-volume-full').attr('renderIntensity');
			contrasts.push(contrast *1.5);

			// Saving brightness
			var brightness = $('.' + line + '-volume-full').attr('brightness');
			brightnesses.push(brightness * 1.5);
		}
	}

	// Saves all currently selected anatomical regions in regions array
	for(var i = 0; i < currentAnatomyOnVR.length; i++) {
		regions.push(currentAnatomyOnVR[i]);
	}
	// Saving arrays to local memory, localStorage information can be found here: https://www.w3schools.com/html/html5_webstorage.asp
	// JSON.stringify() is used to convert arrays to JSON strings, as localStorage can only save data in string format
	// JSON strings can easily be parsed back into arrays on the VR page
	localStorage.setItem('ids', JSON.stringify(linesOn));
	localStorage.setItem('colors', JSON.stringify(colors));
	localStorage.setItem('contrasts', JSON.stringify(contrasts));
	localStorage.setItem('brightnesses', JSON.stringify(brightnesses));
	localStorage.setItem('regions', JSON.stringify(regions));
	linkToVR(); // Opening VR page in new window
}
