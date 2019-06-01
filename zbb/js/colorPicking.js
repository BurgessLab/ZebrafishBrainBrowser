/*
 * This file manages color picking for individual lines
 */

// These colors are the choosable colors for VOLUMES (not color button labels)
// The three comma-separated values are rgb values normalized from 0-1
// Note: These color values should be the same as the col-0 to col-15 class color values in individualSettings.js
const COL_0 = '0.0, 1.0, 1.0';
const COL_1 = '1.0, 1.0, 0.0';
const COL_2 = '1.0, 0.5, 0.71';
const COL_3 = '1.0, 1.0, 1.0';
const COL_4 = '0.0, 0.0, 1.0';
const COL_5 = '0.71, 1.0, 0.0';
const COL_6 = '1.0, 0.0, 0.0';
const COL_7 = '0.5, 0.5, 0.5';
const COL_8 = '1.0, 0.0, 1.0';
const COL_9 = '0.0, 1.0, 0.0';
const COL_10 = '0.87, 0.72, 0.53';
const COL_11 = '0.0, 0.0, 0.0';
const COL_12 = '0.5, 0.0, 0.5';
const COL_13 = '1.0, 0.5, 0.0';
const COL_14 = '0.5, 0.2, 0.0';
const COL_15 = '0.0, 0.0, 0.5';

// This generates the HTML contained inside a color popover, particularly the 16 color option buttons
function popoverContent(func, params) { // The parameters passed identify which function should be called onclick and other parameters for said function
	var content = 	'<button class="btn btn-default color-picker picker-button clear-left" onclick="' + func + '(\'col-0\', ' + COL_0 + ', ' + params + ')"><span class="color-label col-0"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-1\', ' + COL_1 + ', ' + params + ')"><span class="color-label col-1"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-2\', ' + COL_2 + ', ' + params + ')"><span class="color-label col-2"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-3\', ' + COL_3 + ', ' + params + ')"><span class="color-label col-3"></span></button>' +
					'<button class="btn btn-default color-picker picker-button clear-left" onclick="' + func + '(\'col-4\', ' + COL_4 + ', ' + params + ')"><span class="color-label col-4"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-5\', ' + COL_5 + ', ' + params + ')"><span class="color-label col-5"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-6\', ' + COL_6 + ', ' + params + ')"><span class="color-label col-6"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-7\', ' + COL_7 + ', ' + params + ')"><span class="color-label col-7"></span></button>' +
					'<button class="btn btn-default color-picker picker-button clear-left" onclick="' + func + '(\'col-8\', ' + COL_8 + ', ' + params + ')"><span class="color-label col-8"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-9\', ' + COL_9 + ', ' + params + ')"><span class="color-label col-9"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-10\', ' + COL_10 + ', ' + params + ')"><span class="color-label col-10"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-11\', ' + COL_11 + ', ' + params + ')"><span class="color-label col-11"></span></button>' +
					'<button class="btn btn-default color-picker picker-button clear-left" onclick="' + func + '(\'col-12\', ' + COL_12 + ', ' + params + ')"><span class="color-label col-12"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-13\', ' + COL_13 + ', ' + params + ')"><span class="color-label col-13"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-14\', ' + COL_14 + ', ' + params + ')"><span class="color-label col-14"></span></button>' +
					'<button class="btn btn-default color-picker picker-button" onclick="' + func + '(\'col-15\', ' + COL_15 + ', ' + params + ')"><span class="color-label col-15"></span></button>';
	
	return content;
}

// This function changes the color of the individual line's color button (underneath its name in the individual settings panel)
function changeSpanColor(spanID, spanColor) { // spanID contains the ID of the line to change
	// Removing all possible colors the button could have been
	$('#' + spanID).removeClass('col-0');
	$('#' + spanID).removeClass('col-1');
	$('#' + spanID).removeClass('col-2');
	$('#' + spanID).removeClass('col-3');
	$('#' + spanID).removeClass('col-4');
	$('#' + spanID).removeClass('col-5');
	$('#' + spanID).removeClass('col-6');
	$('#' + spanID).removeClass('col-7');
	$('#' + spanID).removeClass('col-8');
	$('#' + spanID).removeClass('col-9');
	$('#' + spanID).removeClass('col-10');
	$('#' + spanID).removeClass('col-11');
	$('#' + spanID).removeClass('col-12');
	$('#' + spanID).removeClass('col-13');
	$('#' + spanID).removeClass('col-14');
	$('#' + spanID).removeClass('col-15');
	
	// Setting button's new color
	$('#' + spanID).addClass(spanColor);
}

// Changes a line's volume color
function changeColor(spanColor, r, g, b, spanID, id) {
  // Changing color of line's slicer and 3D volumes
	$('.' + id + '-volume-x').attr('baseColor', r + ' ' + g + ' ' + b);
	$('.' + id + '-volume-y').attr('baseColor', r + ' ' + g + ' ' + b);
	$('.' + id + '-volume-z').attr('baseColor', r + ' ' + g + ' ' + b);
	$('.' + id + '-volume-full').attr('baseColor', r + ' ' + g + ' ' + b);
	
	// Using Fire LUT if last color button was selected
	var useFire = spanColor == 'col-15' ? 1.0 : 0.0;
	$('.' + id + '-volume-x').attr('fire', useFire);
	$('.' + id + '-volume-y').attr('fire', useFire);
	$('.' + id + '-volume-z').attr('fire', useFire);
	$('.' + id + '-volume-full').attr('fire', useFire);
	
	// Changing color button's background color
	changeSpanColor(spanID, spanColor);
	
  // Save span color as an attribute
  $('#' + id + '-settings-header').attr('spanColor', spanColor);
  
	// Changing line name's text color to white for certain line colors (to better match background)
	// Colors specified in the if-statement below will turn text white
	if(spanColor == 'col-4' || spanColor == 'col-6' || spanColor == 'col-7' || spanColor == 'col-11' || spanColor == 'col-12' || spanColor == 'col-14' || spanColor == 'col-15') {
		$('#' + id + '-settings-header').css('color', '#FFFFFF'); // Setting text color to white
	} else {
		$('#' + id + '-settings-header').css('color', '#000000'); // Setting text color to black
	}
}
