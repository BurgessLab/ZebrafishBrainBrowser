/*
 * This file is used for resetting values, including individual settings values, overall page settings, anatomy selection, slicer and volume views, etc.
 */

// These color values are the default volume colors (0-1 rgb values) when turning on lines, listed in order on when they appear
// While these values are seemingly misplaced, they are actually set when calling resetIndividual() after turning on a line for the first time
const LOAD_COLORS = [['0.0', '1.0', '0.0'], ['1.0', '0.0', '0.0'], ['0.0', '1.0', '1.0'], ['1.0', '1.0', '0.0'], ['1.0', '0.0', '1.0'], ['1.0', '0.5', '0.0'], ['0.0', '0.0', '1.0'], ['1.0', '0.5', '0.71'], ['0.71', '1.0', '0.0'], ['0.87', '0.72', '0.53'], ['1.0', '0.0', '1.0'], ['0.5', '0.0', '0.5']];

// This array maps to color BUTTON values (not the volumes like above), and the values here correspond to the color indices in colorPicking.js
// The colors corresponding to these indices should match the colors in the array above
const LOAD_ORDER = [9, 6, 0, 1, 8, 13, 4, 2, 5, 10, 8, 12];

var loadIndex = 0; // Index of current color being loaded (in arrays above)
var volumeOpacity = 3; // Default volume opacity value for volumes in 3D view, this value only changes when color inversion is turned on, and should be left untouched

// Helper function compatible with IE11 (larger unused and deprecated)
function includes(array, value) {
	var index = array.indexOf(value);
	return index > -1;
}

// Resets anatomy selections (ignore poor naming choice)
function resetOverall() {
	// Turning off full anatomy
	toggleFullAnatomy('z-brain', 'show-full-btn', false);
	toggleFullAnatomy('pajevic', 'show-full-btn', false);

	// Turning off render of all anatomy
	$('.anatomy-1-selectable-data, .anatomy-2-selectable-data').attr('render', 'false');

	// Setting active anatomy to z-brain
	setActiveAnatomy('z-brain', 'active-anatomy-z-brain');
	swapAnatomyPanels('z-brain');
}

// Resets all anatomical region selections
function resetRegionSelections() {
	$('.selection-checkbox, .pajevic-selection-checkbox').prop('checked', false).change();
}

// Resets only pajevic anatomical regions
function resetPajevicSelections() {
	$('.pajevic-selection-checkbox').prop('checked', false).change();
}

// Turns off fullscreen transition
// This is called from resetAdvanced() so transition does not play when hitting reset button
function turnOffTransition() {
	$('.display-window, .proj-window').css('-webkit-transition', 'width 0s, height 0s, top 0s, left 0s').css('transition', 'width 0s, height 0s, top 0s, left 0s');
}

// Turns on fullscreen transition
// This is called from resetAdvanced() to reactivate transition after everything's been reset
function turnOnTransition() {
	$('.display-window, .proj-window').css('-webkit-transition', 'width 0.5s, height 0.5s, top 0.5s, left 0.5s').css('transition', 'width 0.5s, height 0.5s, top 0.5s, left 0.5s');
}

//
function showVolumeWindowAndSliders() {
	$('#volume-window').css('display', 'block');
	$('.slice-div').css('display', 'flex');
	$('#x-window, #volume-window').addClass('border-left');
	$('#y-window, #z-window').addClass('border-right');
	updateLines();
	var checked = $('#line-show-checkbox').prop('checked');
	changeOverallAttrib('renderLines', checked ? 1.0 : 0.0);
}

// Resets all settings in the Settings menu and changes made in the left panel (slice positioning, fullscreen, etc.)
function resetAdvanced() {
  // Reset to fully-zoomed out
  resetZoomAll();

	var inverted = $('#invert-input').prop('checked');
	applyColorInversion(inverted, false); // Resetting color inversion
	$('#volume-full-checkbox').prop('checked', true).change(); // Resetting show volume

	$('#line-show-checkbox').prop('checked', true).change(); // Resetting show line
	changeResolution('res-btn-2560', 2560); // Resetting resolution (2560 is low res)
	changeWindowSize('win-size-md', 65); // Resetting window size (65% is medium)

	// Resetting viewpoint in 3D volume view
	var runtime;
	if(runtime = $('#volume-window')[0].runtime) {
		runtime.resetView();
	}

	// Turning off maximum projections and clearing partial projection lines
	toggleMaxProj(false, 'x', 0, 1);
	toggleMaxProj(false, 'y', 0, 1);
	toggleMaxProj(false, 'z', 0, 1);
	clearProjX();
	clearProjY();
	clearProjZ();

	$('#hide-annotations-checkbox').prop('checked', false).change(); // Resetting hide annotation button
	$('#depth-code-projections-checkbox').prop('checked', false).change(); // Resetting depth coding

	// Shrinking fullscreened windows and resetting other windows
	// xFull, yFull, zFull, and vFull are members of windows.js, where fullscreen operations are handled
	if(xFull) {
		turnOffTransition();
		toggleFullscreen('x');
		showVolumeWindowAndSliders();
	} else if(yFull) {
		turnOffTransition();
		toggleFullscreen('y');
		showVolumeWindowAndSliders();
	} else if(zFull) {
		turnOffTransition();
		toggleFullscreen('z');
		showVolumeWindowAndSliders();
	} else if(vFull) {
		turnOffTransition();
		toggleFullscreen('volume');
		showVolumeWindowAndSliders();
	}

	// Turns fullscreen transition back on after everything has been reset
	setTimeout(function() {
		turnOnTransition();
	}, 500); // This function is called after 500 milliseconds have passed

	// Resetting slicer inputs to midpoint
	$('#x-input').val(0.5).trigger('input');
	$('#y-input').val(0.5).trigger('input');
	$('#z-input').val(0.5).trigger('input');
	updateLines();

	// Turns all line visibility back on
	resetToggles();
}

// Resets values for an individual line
function resetIndividual(id, creating) {
	// Default brightness, contrast, and threshold values
	var brightness = 0;
	var contrast = 1;
	var threshold = 0;

	// Finding line's type and extracting its default values
	// These values are set in data.js
	if(includes(TRANSGENIC, id)) {
		var index = TRANSGENIC.indexOf(id);
		brightness = TRANSGENIC_BRIGHTNESS[index];
		contrast = TRANSGENIC_CONTRAST[index];
		threshold = TRANSGENIC_THRESHOLD[index];
	} else if(includes(GAL4, id)) {
		var index = GAL4.indexOf(id);
		brightness = GAL4_BRIGHTNESS[index];
		contrast = GAL4_CONTRAST[index];
		threshold = GAL4_THRESHOLD[index];
	} else if(includes(CRE, id)) {
		var index = CRE.indexOf(id);
		brightness = CRE_BRIGHTNESS[index];
		contrast = CRE_CONTRAST[index];
		threshold = CRE_THRESHOLD[index];
	} else if(includes(MISC, id)) {
		var index = MISC.indexOf(id);
		brightness = MISC_BRIGHTNESS[index];
		contrast = MISC_CONTRAST[index];
		threshold = MISC_THRESHOLD[index];
	} else if(id == HUC_CER[0]) {
		brightness = HUC_CER_BRIGHTNESS[0];
		contrast = HUC_CER_CONTRAST[0];
		threshold = HUC_CER_THRESHOLD[0];
	}

	// Resetting brightness and contrast inputs
	$('#' + id + '-brightness-input').val(brightness).trigger('input');
	$('#' + id + '-intensity-input').val(contrast).trigger('input');

	// Resetting threshold 3D volume opacity
	changeVolumeAttrib(id, 'retainedOpacity', volumeOpacity);
	changeIndividualAttrib(id, 'threshold', threshold);

	// Resetting color values
	if(id == HUC_CER[0]) {
		// Resetting HuC-Cer (and only HuC-Cer) to white
		changeColor('col-3', '1.0', '1.0', '1.0', id + '-color-span', id);
	} else {
		if(creating === undefined) { // "creating" is not set unless line is being turned on for the first time
			// Defaulting line reset color to green
			changeColor('col-9', '0.0', '1.0', '0.0', id + '-color-span', id);
		} else {
			// Setting color of newly turned on lines based on color values in LOAD_COLORS and LOAD_ORDER
			var color = LOAD_COLORS[loadIndex];
			changeColor('col-' + LOAD_ORDER[loadIndex], color[0], color[1], color[2], id + '-color-span', id);
			loadIndex = (loadIndex + 1) % LOAD_ORDER.length;
		}
	}
}
